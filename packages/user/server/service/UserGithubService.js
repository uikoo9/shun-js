// github
const { getGithubUserinfo } = require('../util/github.js');

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
  req.logger.info(methodName, 'githubUserinfo', githubUserinfo);

  // r
  res.jsonSuccess('登录成功！');
};
