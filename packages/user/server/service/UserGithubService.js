// github
const { getGithubUserinfo } = require('../util/github.js');

// util
const { loginORRegUser } = require('../util/user.js');

/**
 * userGithub
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.userGithub = async (req, res) => {
  const methodName = 'userGithub';

  // fallback url
  const fallbackUrl = global.QZ_CONFIG.github.fallbackUrl;

  // const
  const code = req.body.code;
  if (!code) {
    const msg = 'need code';
    req.logger.warn(methodName, msg, req.body);
    res.jsonFail(msg);
    return;
  }

  // userinfo
  const githubUserinfo = await getGithubUserinfo(req, code);
  if (!githubUserinfo) {
    req.logger.error(methodName, 'githubUserinfo is null');
    res.redirect(fallbackUrl);
    return;
  }

  // user item
  const userItem = await loginORRegUser(req, res, githubUserinfo.email);
  if (!userItem) return;
  req.logger.info(methodName, 'github login or reg ok');

  // r
  const finalUser = {
    userid: userItem.id,
    usertoken: userItem.usertoken,
  };
  res.jsonSuccess('登录成功！', finalUser);
};
