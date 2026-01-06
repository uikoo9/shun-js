// data
const { reportMCPData } = require('./report-mcp.js');
const { reportTubiaoData } = require('./report-tubiao.js');

// logger
const Logger = require('qiao-log');
const logOptions = require('../log-options.js')();
const logger = Logger(logOptions);

// ReportTask.js
exports.runAndInit = true;
exports.time = '1 1 1 * * *';
exports.tick = async () => {
  await reportDataEventAll();
};

// go
async function reportDataEventAll() {
  const methodName = 'reportDataEventAll';

  // go
  try {
    await reportMCPData();
    await reportTubiaoData();
  } catch (error) {
    logger.error(methodName, 'db error', error.name, error.message);
  }
}
