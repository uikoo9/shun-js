// sms
const { submailSMS } = require('qiao-sms');

// feishu
const { sendMsgToFeishu } = require('qiao-z-service');

/**
 * sendSms
 * @param {*} req
 * @param {*} res
 * @param {*} mobile
 * @returns
 */
exports.sendSms = async (req, res, mobile, content) => {
  const methodName = 'sendSms';

  // sms
  const appId = global.QZ_CONFIG.submail.appid;
  const appKey = global.QZ_CONFIG.submail.appkey;

  // send
  const smsRes = await submailSMS({
    appid: appId,
    appkey: appKey,
    mobile: mobile,
    content: content,
  });
  req.logger.info(methodName, 'smsRes', smsRes);

  // feishu
  sendMsgToFeishu({
    url: global.QZ_CONFIG.feishu.url,
    appId: global.QZ_CONFIG.feishu.appId,
    appKey: global.QZ_CONFIG.feishu.appKey,
    feishuUrl: global.QZ_CONFIG.urls.feishuUrl,
    feishuMsg: `【提醒】status: ${smsRes.status}, msg: ${smsRes.msg}, mobile: ${mobile}, content: ${content}`,
  });

  // check
  if (smsRes.status !== 'success') {
    req.logger.error(methodName, smsRes.msg);
    return res.jsonFail(smsRes.msg);
  }

  // r
  return res.jsonSuccess('验证码已发送');
};
