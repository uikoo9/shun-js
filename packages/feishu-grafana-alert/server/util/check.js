/**
 * checkGrafanaDomain
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.checkGrafanaDomain = async function (req, res) {
  const methodName = 'checkGrafanaDomain';

  // check headers
  if (!req.headers) {
    const msg = 'req.headers is null';
    req.logger.warn(methodName, msg);
    res.jsonFail(msg);
    return;
  }

  // const
  const requestDomain = req.headers.authorization;
  const grafanaDomain = global.QZ_CONFIG.grafanaDomain;

  // check domain
  if (grafanaDomain !== requestDomain) {
    const msg = 'grafanaDomain !== requestDomain';
    req.logger.warn(methodName, msg);
    res.jsonFail(msg);
    return;
  }

  // r
  return true;
};
