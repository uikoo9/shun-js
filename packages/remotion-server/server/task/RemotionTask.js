// model
const { fetchPendingWorks } = require('../model/RemotionModel.js');

// logger
const Logger = require('qiao-log');
const logOptions = require('../log-options.js')();
const logger = Logger(logOptions);

// RemotionTask.js
exports.runAndInit = true;
exports.time = '* 1 * * *';
exports.tick = async () => {
  await genRemotionVideo();
};

// gen remotion video
async function genRemotionVideo() {
  const methodName = 'genRemotionVideo';

  // go
  logger.info(methodName, 'start');

  const rows = await fetchPendingWorks();
  console.log(rows);

  // end
  logger.info(methodName, 'end');
}
