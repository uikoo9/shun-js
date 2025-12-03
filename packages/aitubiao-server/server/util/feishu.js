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
 * errorFeishuMsg
 * @param {*} req
 * @param {*} msg
 * @returns
 */
exports.errorFeishuMsg = (req, msg) => {
  // check
  if (isBot(req)) return;

  // msg
  const uaJson = JSON.stringify(req.useragent || {});
  exports.feishuMsg(`【通知】服务异常，${msg}，请查看日志，ua：${uaJson}`);
};

/**
 * chartFeishuMsg
 * @param {*} req
 * @returns
 */
exports.chartFeishuMsg = (req) => {
  // check
  if (isBot(req)) return;

  // msg
  const uaJson = JSON.stringify(req.useragent || {});
  const userid = req.headers.userid;
  const prompt = req.body.userPrompt;

  const msg = `【通知】/chart被访问\nuserid:${userid}\nua:\n${uaJson}\nprompt:\n${prompt}`;
  exports.feishuMsg(msg);
};

/**
 * chartResFeishuMsg
 * @param {*} req
 * @returns
 */
exports.chartResFeishuMsg = (req, chartRes) => {
  // check
  if (isBot(req)) return;

  // msg
  const uaJson = JSON.stringify(req.useragent || {});
  const userid = req.headers.userid;
  const prompt = req.body.userPrompt;

  const msg = `【通知】/chart生成成功\nuserid:${userid}\nua:\n${uaJson}\nprompt:\n${prompt}\nres:${chartRes}`;
  exports.feishuMsg(msg);
};
