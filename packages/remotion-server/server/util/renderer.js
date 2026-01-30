// fs
const fs = require('fs');
const path = require('path');

// remotion
const { bundle } = require('@remotion/bundler');
const { renderMedia, selectComposition } = require('@remotion/renderer');

// logger
const Logger = require('qiao-log');
const logOptions = require('../log-options.js')();
const logger = Logger(logOptions);

// 浏览器配置 - 使用固定的全局路径，避免每次重新下载
const BROWSER_EXECUTABLE_PATH = path.join(
  '/home/ubuntu/remotions/browser',
  'chrome-headless-shell',
  'linux-arm64',
  'chrome-headless-shell-linux-arm64',
  'headless_shell',
);

/**
 * 初始化浏览器 - 如果全局浏览器不存在，从 node_modules 复制
 */
function ensureBrowserExists() {
  const methodName = 'ensureBrowserExists';

  // 如果全局浏览器已存在，直接返回
  if (fs.existsSync(BROWSER_EXECUTABLE_PATH)) {
    logger.info(methodName, 'Browser already exists at:', BROWSER_EXECUTABLE_PATH);
    return;
  }

  logger.info(methodName, 'Global browser not found, attempting to copy from node_modules...');

  // 查找 node_modules 中的浏览器
  const nodeModulesBrowserPath = path.join(__dirname, '..', '..', 'node_modules', '.remotion', 'chrome-headless-shell');

  if (fs.existsSync(nodeModulesBrowserPath)) {
    // 创建目标目录
    const globalBrowserDir = path.join('/home/ubuntu/remotions/browser');
    fs.mkdirSync(globalBrowserDir, { recursive: true });

    // 复制浏览器文件
    logger.info(methodName, 'Copying browser from:', nodeModulesBrowserPath);
    logger.info(methodName, 'Copying browser to:', globalBrowserDir);

    fs.cpSync(nodeModulesBrowserPath, path.join(globalBrowserDir, 'chrome-headless-shell'), {
      recursive: true,
    });

    logger.info(methodName, 'Browser copied successfully to:', BROWSER_EXECUTABLE_PATH);
  } else {
    logger.warn(methodName, 'Browser not found in node_modules, will download on first use');
  }
}

/**
 * 渲染 Remotion 视频
 * @param {Object} options
 * @param {string} options.sourceCode - 用户的 React 代码
 * @param {string} options.outputPath - 输出视频路径
 * @param {number} options.width - 视频宽度
 * @param {number} options.height - 视频高度
 * @param {number} options.fps - 帧率
 */
exports.renderVideo = async ({ sourceCode, outputPath, width, height, fps }) => {
  const methodName = 'renderVideo';

  // const
  const tempDir = path.join('/tmp', 'remotion-render', Date.now().toString());
  const entryPoint = path.join(tempDir, 'src', 'Root.jsx');

  try {
    // 0. 确保浏览器存在（首次运行时自动复制到全局目录）
    ensureBrowserExists();

    // 1. 创建临时项目结构
    fs.mkdirSync(path.join(tempDir, 'src'), { recursive: true });

    // 2. 写入用户代码
    const wrappedCode = wrapUserCode(sourceCode);
    fs.writeFileSync(entryPoint, wrappedCode);

    // 3. 创建 package.json
    const packageJson = {
      name: 'temp-remotion-project',
      version: '1.0.0',
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        remotion: '^4.0.0',
      },
    };
    fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify(packageJson, null, 2));

    // 4. 创建 remotion.config.js (可选但推荐)
    const remotionConfig = `
module.exports = {
  // Remotion 配置
};
`;
    fs.writeFileSync(path.join(tempDir, 'remotion.config.js'), remotionConfig);

    // 5. Bundle 代码
    logger.info(methodName, 'Bundling code...');
    const bundleLocation = await bundle({
      entryPoint,
      webpackOverride: (config) => config,
    });

    // 6. 获取 composition
    logger.info(methodName, 'Getting composition...');
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'MyComposition', // 默认 composition ID
      inputProps: {},
      browserExecutable: fs.existsSync(BROWSER_EXECUTABLE_PATH) ? BROWSER_EXECUTABLE_PATH : undefined,
    });

    // 7. 渲染视频
    logger.info(methodName, 'Rendering frames...');
    await renderMedia({
      composition: {
        ...composition,
        width: width,
        height: height,
        fps: fps,
        durationInFrames: composition.durationInFrames || 150, // 默认5秒
      },
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: {},
      browserExecutable: fs.existsSync(BROWSER_EXECUTABLE_PATH) ? BROWSER_EXECUTABLE_PATH : undefined,
      onProgress: ({ progress }) => {
        if (progress % 0.1 < 0.01) {
          // 每10%打印一次
          logger.info(`Render progress: ${(progress * 100).toFixed(1)}%`);
        }
      },
    });

    logger.info(methodName, 'Render completed');
  } finally {
    // 清理临时目录
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
};

/**
 * 包装用户代码为 Remotion 项目
 */
function wrapUserCode(sourceCode) {
  return `
import React from 'react';
import { Composition, registerRoot, AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';

// 用户代码
${sourceCode}

// Root 组件 - Remotion 入口
const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="MyComposition"
        component={MyComposition}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

// 注册 Root 组件（Remotion 4.x 要求）
registerRoot(RemotionRoot);
`;
}
