// sms
const { sendSms } = require('../model/SmsModel.js');

/**
 * send
 * @param {*} req
 * @param {*} res
 */
exports.send = async (req, res) => {
  const methodName = 'send';

  // const
  const mobile = req.body.mobile;
  const content = req.body.content;

  // check
  if (!mobile) {
    const msg = 'need mobile';
    req.logger.warn(methodName, msg);
    return res.jsonFail(msg);
  }
  if (!/^(?:(?:\+|00)86)?1\d{10}$/.test(mobile)) {
    const msg = 'need correct mobile';
    req.logger.warn(methodName, msg);
    return res.jsonFail(msg);
  }
  if (!content) {
    const msg = 'need content';
    req.logger.warn(methodName, msg);
    return res.jsonFail(msg);
  }

  // send sms
  try {
    await sendSms(req, res, mobile, content);
  } catch (error) {
    req.logger.error(methodName, error);
    return res.jsonFail(methodName, 'send sms failed');
  }
};
