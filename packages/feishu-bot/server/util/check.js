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
  if (appId !== global.QZ_CONFIG.feishu.appId) {
    const msg = 'not right appId';
    req.logger.warn(methodName, msg, req.body);
    res.jsonFail(msg);
    return;
  }
  if (appKey !== global.QZ_CONFIG.feishu.appKey) {
    const msg = 'not right appKey';
    req.logger.warn(methodName, msg, req.body);
    res.jsonFail(msg);
    return;
  }

  return true;
};
