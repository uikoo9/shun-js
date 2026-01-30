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
  const tempDir = path.join(__dirname, 'temp', Date.now().toString());
  const entryPoint = path.join(tempDir, 'src', 'Root.jsx');

  try {
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
        remotion: '^4.0.0',
      },
    };
    fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify(packageJson, null, 2));

    // 4. Bundle 代码
    logger.info(methodName, 'Bundling code...');
    const bundleLocation = await bundle({
      entryPoint,
      webpackOverride: (config) => config,
    });

    // 5. 获取 composition
    logger.info(methodName, 'Getting composition...');
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'MyComposition', // 默认 composition ID
      inputProps: {},
    });

    // 6. 渲染视频
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
import { Composition, AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';

// 用户代码
${sourceCode}

// Root 组件 - Remotion 入口
export const RemotionRoot = () => {
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
`;
}
