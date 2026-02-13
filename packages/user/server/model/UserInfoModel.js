// sql
const sql = require('../sql/UserInfoSQL.js');

/**
 * isUserInfoExists
 * @param {*} req
 * @param {*} res
 * @param {*} id
 * @returns
 */
exports.isUserInfoExists = async (req, res, id) => {
  const methodName = 'isUserInfoExists';

  // get user item
  try {
    return await req.db.query(sql.isUserInfoExists, [id]);
  } catch (error) {
    const msg = '获取用户信息失败！';
    req.logger.error(methodName, msg, error.name, error.message);
    res.jsonFail(msg);
  }
};

/**
 * addUserInfo
 * @param {*} req
 * @param {*} res
 * @param {*} userItemId
 * @param {*} githubUserinfo
 * @returns
 */
exports.addUserInfo = async (req, res, userItemId, githubUserinfo) => {
  const methodName = 'addUserInfo';

  // add user item
  try {
    // add user
    const params = [userItemId, githubUserinfo.login, githubUserinfo.avatar_url, githubUserinfo.email];
    await req.db.query(sql.addUserInfo, params);

    // r
    return true;
  } catch (error) {
    const msg = '添加用户失败！';
    req.logger.error(methodName, msg, error.name, error.message);
    res.jsonFail(msg);
  }
};

/**
 * getUserInfoById
 * @param {*} req
 * @param {*} res
 * @param {*} id
 * @returns
 */
exports.getUserInfoById = async (req, res, id) => {
  const methodName = 'getUserInfoById';

  // get user item
  try {
    const getUserInfoByIdRes = await req.db.query(sql.getUserInfoById, [id]);
    if (getUserInfoByIdRes.length !== 1) {
      const msg = '用户信息长度非1！';
      req.logger.error(methodName, msg);
      res.jsonFail(msg);
      return;
    }

    return getUserInfoByIdRes[0];
  } catch (error) {
    const msg = '获取用户信息失败！';
    req.logger.error(methodName, msg, error.name, error.message);
    res.jsonFail(msg);
  }
};
