// github
const { getGitHubAuthUrl } = require('../util/github.js');

/**
 * index
 * @param {*} req
 * @param {*} res
 */
exports.index = async (req, res) => {
  const url = getGitHubAuthUrl('1');
  console.log(url);
  res.send('1');
};

/**
 * githubAuth
 * @param {*} req
 * @param {*} res
 */
exports.githubAuth = async (req, res) => {
  // auth
  const authObj = getGitHubAuthUrl();

  // set cookie
  res.setCookie('state', authObj.state);

  // redirect
  res.redirect(authObj.finalUrl);
};

/**
 * githubCallback
 * @param {*} req
 * @param {*} res
 */
exports.githubCallback = async (req, res) => {
  console.log(req.query);
  res.send('1');
};
