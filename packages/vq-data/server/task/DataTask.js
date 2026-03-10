// service
const { clarityReport } = require('../service/DataService.js');

// logger
const Logger = require('qiao-log');
const logOptions = require('../log-options.js')();
const logger = Logger(logOptions);

exports.time = '0 1 * * *';
// exports.time = '*/5 * * * * *';

exports.tick = async () => {
  await websiteReport();
};

// go
let go = false;
async function websiteReport() {
  const methodName = 'websiteReport';

  // check data
  if (go) return;
  go = true;

  // go
  logger.info(methodName, 'websiteReport-start');

  clarityReport();

  // end
  go = false;
  logger.info(methodName, 'websiteReport-end');
}
