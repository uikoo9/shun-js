// fs
const fs = require('fs');
const path = require('path');

// renderer
const { renderVideo } = require('./renderer.js');

// upload
const { uploadToR2 } = require('./uploader.js');

// model
const { updateRenderStatus } = require('../model/RemotionModel.js');

// logger
const Logger = require('qiao-log');
const logOptions = require('../log-options.js')();
const logger = Logger(logOptions);

/**
 * processWork
 * @param {*} work
 */
exports.processWork = async (work) => {
  const methodName = 'processWork';

  // const
  const workId = work.id;
  const outputPath = path.join(global.QZ_CONFIG.OUTPUT_DIR, `${workId}.mp4`);
  logger.info(methodName, `\n[${new Date().toISOString()}] Processing work: ${workId}`);
  logger.info(methodName, `Title: ${work.title}`);
  logger.info(methodName, `Status: ${work.status}, Render Status: ${work.render_status}`);

  try {
    // 1. 渲染视频
    logger.info(methodName, 'Rendering video...');
    await renderVideo({
      sourceCode: work.source_code,
      outputPath,
      width: work.width || 1920,
      height: work.height || 1080,
      fps: work.fps || 30,
    });

    logger.info(methodName, 'Video rendered successfully');

    // 2. 上传到 R2
    logger.info(methodName, 'Uploading to R2...');
    const videoUrl = await uploadToR2({
      filePath: outputPath,
      workId: workId,
    });

    logger.info(methodName, 'Video uploaded:', videoUrl);

    // 3. 获取视频信息
    fs.statSync(outputPath);
    const durationInFrames = Math.round(5 * (work.fps || 30)); // 暂时硬编码为5秒

    // 4. 更新数据库为渲染完成
    await updateRenderStatus(workId, 'completed', {
      video_url: videoUrl,
      render_completed_at: new Date().toISOString(),
      duration_in_frames: durationInFrames,
      duration_seconds: durationInFrames / (work.fps || 30),
    });

    logger.info(methodName, `✅ Work ${workId} completed successfully`);
    logger.info(methodName, `   Status: ${work.status}, Render Status: completed`);

    // 5. 清理本地文件
    fs.unlinkSync(outputPath);
  } catch (error) {
    logger.error(methodName, `❌ Error processing work ${workId}:`, error);

    // 更新为渲染失败状态
    await updateRenderStatus(workId, 'failed', {
      render_error: error.message,
      render_completed_at: new Date().toISOString(),
    });

    // 清理可能存在的文件
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
  }
};
