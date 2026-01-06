// model
const { getAppUpdateVersion } = require('../model/AppModel.js');

/**
 * appUpdate
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.appUpdate = async (req, res) => {
  const methodName = 'appUpdate';

  // check
  const appName = req.body.appName;
  if (!appName) {
    const msg = 'need appName';
    req.logger.warn(methodName, msg, req.body);
    res.jsonFail(msg);
    return;
  }

  // version
  const version = await getAppUpdateVersion(req, res, appName);
  if (!version) return;

  // r
  res.jsonSuccess('get app update version success', version);
};
