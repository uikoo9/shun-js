// services
const { feishuBot } = require('@shun-js/shun-service');

/**
 * feishuMsg
 * @param {*} msg
 */
exports.feishuMsg = (msg) => {
  if (global.QZ_CONFIG.env !== 'production') return;

  feishuBot({
    url: global.QZ_CONFIG.feishu.url,
    feishuUrl: global.QZ_CONFIG.feishu.feishuUrl,
    feishuMsg: msg,
  });
};

/**
 * errorFeishuMsg
 * @param {*} msg
 * @returns
 */
exports.errorFeishuMsg = (msg) => {
  exports.feishuMsg(`【通知】服务异常，${msg}，请查看日志。`);
};
