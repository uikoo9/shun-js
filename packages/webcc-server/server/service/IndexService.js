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
 * githubCallback
 * @param {*} req
 * @param {*} res
 */
exports.githubCallback = async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  console.log(req.query);
  res.send('1');
};
