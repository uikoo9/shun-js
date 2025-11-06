// model
const { feishuMsgs } = require('../model/FeishuModel.js');

/**
 * feishuMsg
 * @param {*} req
 * @param {*} res
 */
exports.feishuMsg = async (req, res) => {
  const methodName = 'feishuMsg';

  // const
  const url = req.body.url;
  const content = req.body.content;
  if (!url) {
    const msg = 'need url';
    req.logger.warn(methodName, msg);
    return res.jsonFail(msg);
  }
  if (!content) {
    const msg = 'need content';
    req.logger.warn(methodName, msg);
    return res.jsonFail(msg);
  }

  // feishu msg
  req.logger.info(methodName, feishuMsgs.length);
  feishuMsgs.push(req.body);
  req.logger.info(methodName, feishuMsgs.length);

  // r
  const msg = 'feishu msg success';
  req.logger.info(methodName, msg);
  res.jsonSuccess(msg);
};
