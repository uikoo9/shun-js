// model
const { getUserInfoById } = require('../model/UserInfoModel.js');

// util
const { getUserAccessToken, setUserAccessToken } = require('../util/user.js');

/**
 * userInfo
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.userInfo = async (req, res) => {
  const methodName = 'userInfo';

  // const
  const userid = req.body.userid;
  if (!userid) {
    const msg = 'need userid';
    req.logger.warn(methodName, msg, req.body);
    res.jsonFail(msg);
    return;
  }

  // user info
  const getUserInfoByIdRes = await getUserInfoById(req, res, userid);
  if (!getUserInfoByIdRes) return;

  // access token
  const accessToken = await getUserAccessToken(req, userid);
  await setUserAccessToken(req, userid, accessToken);
  getUserInfoByIdRes.accessToken = accessToken;

  // r
  res.jsonSuccess('登录成功！', getUserInfoByIdRes);
};
