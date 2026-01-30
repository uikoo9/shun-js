// fs
const fs = require('fs');

// s3
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = new S3Client({
  region: 'auto',
  endpoint: global.QZ_CONFIG.R2_ENDPOINT,
  credentials: {
    accessKeyId: global.QZ_CONFIG.R2_ACCESS_KEY_ID,
    secretAccessKey: global.QZ_CONFIG.R2_SECRET_ACCESS_KEY,
  },
});

// logger
const Logger = require('qiao-log');
const logOptions = require('../log-options.js')();
const logger = Logger(logOptions);

/**
 * 上传文件到 Cloudflare R2
 * @param {Object} options
 * @param {string} options.filePath - 本地文件路径
 * @param {string} options.workId - 作品 ID
 * @returns {Promise<string>} 文件的��开 URL
 */
exports.uploadToR2 = async ({ filePath, workId }) => {
  const methodName = 'uploadToR2';

  // const
  const fileName = `${workId}.mp4`;
  const fileContent = fs.readFileSync(filePath);

  // command
  const command = new PutObjectCommand({
    Bucket: global.QZ_CONFIG.R2_BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
    ContentType: 'video/mp4',
  });

  // go
  try {
    await s3Client.send(command);

    // 返回公开 URL
    return `${global.QZ_CONFIG.NEXT_PUBLIC_R2_PUBLIC_URL}/${fileName}`;
  } catch (error) {
    logger.error(methodName, 'Error uploading to R2:', error);
  }
};
