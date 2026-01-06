// data
const { dataEvents, addDataEvent } = require('../model/DataModel.js');

// logger
const Logger = require('qiao-log');
const logOptions = require('../log-options.js')();
const logger = Logger(logOptions);

// DataTask.js
exports.time = '*/5 * * * * *';
exports.tick = async () => {
  await addDataEventToDB();
};

// add data event to db
let addData = false;
async function addDataEventToDB() {
  const methodName = 'addDataEventToDB';

  // check length
  if (!dataEvents.length) return;

  // check data
  if (addData) return;
  addData = true;

  // go
  logger.info(methodName, 'dataEvents-start', dataEvents.length);
  try {
    while (dataEvents.length) {
      const element = dataEvents.pop();
      await addDataEvent(element);
    }
  } catch (error) {
    logger.error(methodName, 'db error', error.name, error.message);
  }

  // end
  addData = false;
  logger.info(methodName, 'dataEvents-end', dataEvents.length);
}
