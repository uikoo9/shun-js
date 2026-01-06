// sql
const sql = require('../sql/app-sql.json');

/**
 * getAppUpdateVersion
 * @param {*} req
 * @param {*} res
 * @param {*} appName
 */
exports.getAppUpdateVersion = async (req, res, appName) => {
  const methodName = 'getAppUpdateVersion';

  // get app update version
  try {
    const versions = await req.db.query(sql.getAppUpdateVersion, [appName]);
    if (versions.length !== 1) {
      const msg = 'app version is empty';
      req.logger.error(methodName, msg);
      res.jsonFail(msg);
      return;
    }

    // r
    return versions[0];
  } catch (error) {
    const msg = 'get app version fail';
    req.logger.error(methodName, msg, error.name, error.message);
    res.jsonFail(msg);
  }
};
