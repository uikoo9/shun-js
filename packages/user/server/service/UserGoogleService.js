// model
const { addUserInfoByGoogle, isUserInfoExists } = require('../model/UserInfoModel.js');

// google
const { getGoogleUserinfo } = require('../util/google.js');

// util
const { loginORRegUser } = require('../util/user.js');

/**
 * userGoogle
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.userGoogle = async (req, res) => {
  const methodName = 'userGoogle';

  // fallback url
  const fallbackUrl = global.QZ_CONFIG.google.fallbackUrl;

  // const
  const code = req.body.code;
  if (!code) {
    const msg = 'need code';
    req.logger.warn(methodName, msg, req.body);
    res.jsonFail(msg);
    return;
  }

  // userinfo
  const googleUserinfo = await getGoogleUserinfo(req, code);
  if (!googleUserinfo) {
    req.logger.error(methodName, 'googleUserinfo is null');
    res.redirect(fallbackUrl);
    return;
  }

  // user item
  const userItem = await loginORRegUser(req, res, googleUserinfo.email);
  if (!userItem) return;
  req.logger.info(methodName, 'github login or reg ok');

  // user info
  const isUserInfoExistsRes = await isUserInfoExists(req, res, userItem.id);
  if (!isUserInfoExistsRes) return;
  if (isUserInfoExistsRes.length === 0) {
    const addUserInfoRes = await addUserInfoByGoogle(req, res, userItem.id, googleUserinfo);
    if (!addUserInfoRes) return;
  }

  // r
  const finalUser = {
    userid: userItem.id,
    usertoken: userItem.usertoken,
  };
  res.jsonSuccess('登录成功！', finalUser);
};
