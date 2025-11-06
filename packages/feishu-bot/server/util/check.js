// config
const config = require('../config.json');

/**
 * checkAppIdAndKey
 * @param {*} req
 * @param {*} res
 */
exports.checkAppIdAndKey = async (req, res) => {
  const methodName = 'checkAppIdAndKey';

  // const
  const appId = req.body.appId;
  const appKey = req.body.appKey;

  // check
  if (!appId) {
    const msg = 'need appId';
    req.logger.warn(methodName, msg, req.body);
    res.jsonFail(msg);
    return;
  }
  if (!appKey) {
    const msg = 'need appKey';
    req.logger.warn(methodName, msg, req.body);
    res.jsonFail(msg);
    return;
  }
  if (appId !== config.feishu.appId) {
    const msg = 'not right appId';
    req.logger.warn(methodName, msg, req.body);
    res.jsonFail(msg);
    return;
  }
  if (appKey !== config.feishu.appKey) {
    const msg = 'not right appKey';
    req.logger.warn(methodName, msg, req.body);
    res.jsonFail(msg);
    return;
  }

  return true;
};
