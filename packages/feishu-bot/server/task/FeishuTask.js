// ajax
const { post } = require('qiao-ajax');

// data
const { feishuMsgs } = require('../model/FeishuModel.js');

// logger
const Logger = require('qiao-log');
const logOptions = require('../log-options.js')();
const logger = Logger(logOptions);

// DataTask.js
exports.time = '* * * * * *';
exports.tick = async () => {
  await sendFeishuMsg();
};

// add data event to db
async function sendFeishuMsg() {
  const methodName = 'sendFeishuMsg';

  // check length
  if (!feishuMsgs.length) return;

  // go
  logger.info(methodName, 'feishuMsgs-start', feishuMsgs.length);
  const element = feishuMsgs.shift();
  try {
    await post(element.url, {
      data: {
        msg_type: 'post',
        content: JSON.parse(element.content),
      },
    });
  } catch (error) {
    feishuMsgs.unshift(element);
    logger.error(methodName, 'send feishu msg error', error.name, error.message);
  }

  // end
  logger.info(methodName, 'feishuMsgs-end', feishuMsgs.length);
}
