// service
const { genVideo } = require('../service/RemotionService.js');

// logger
const Logger = require('qiao-log');
const logOptions = require('../log-options.js')();
const logger = Logger(logOptions);

// RemotionTask.js
exports.runAndInit = true;
exports.time = '* 1 * * *';

// tick
let start = false;
exports.tick = async () => {
  logger.info('start', start);
  if (start) return;

  start = true;
  logger.info('start', start);

  await genVideo();

  start = false;
  logger.info('start', start);
};
