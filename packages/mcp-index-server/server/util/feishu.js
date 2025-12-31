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

// is bot
function isBot(req) {
  const ua = req.useragent;
  const hasOSName = ua && ua.os && ua.os.name;
  const isGoogleBot = ua && ua.browser && ua.browser.name === 'Googlebot';
  const isMetaBot = ua && ua.browser && ua.browser.name === 'meta-externalagent';
  const isSafariBot = ua && ua.engine && ua.engine.name === 'WebKit' && ua.engine.version === '605.1.15';
  return !hasOSName || isGoogleBot || isMetaBot || isSafariBot;
}

/**
 * mcpDetailFeishuMsg
 * @param {*} req
 * @returns
 */
exports.mcpDetailFeishuMsg = (req) => {
  // check
  if (isBot(req)) return;

  // msg
  const code = req.params.code;
  const uaJson = JSON.stringify(req.useragent || {});
  exports.feishuMsg(`【通知】detail被访问，code：${code}，ua：${uaJson}`);
};

/**
 * mcpErrorFeishuMsg
 * @param {*} req
 * @param {*} msg
 * @returns
 */
exports.mcpErrorFeishuMsg = (req, msg) => {
  // check
  if (isBot(req)) return;

  // msg
  const uaJson = JSON.stringify(req.useragent || {});
  exports.feishuMsg(`【通知】服务异常，${msg}，请查看日志，ua：${uaJson}`);
};
