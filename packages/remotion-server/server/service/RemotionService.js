// model
const { fetchPendingWorks } = require('../model/RemotionModel.js');

// go
const { processWork } = require('../util/work.js');

// logger
const Logger = require('qiao-log');
const logOptions = require('../log-options.js')();
const logger = Logger(logOptions);

/**
 * genVideo
 */
exports.genVideo = async () => {
  const methodName = 'genVideo';

  // go
  logger.info(methodName, 'start');

  // rows
  const rows = await fetchPendingWorks();
  logger.info(methodName, 'rows', rows);
  if (!rows || !rows.length) return;

  // work
  const work = rows[0];
  await processWork(work);

  // end
  logger.info(methodName, 'end');
};
