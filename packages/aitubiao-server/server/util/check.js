// qiao
const { userCheck } = require('qiao-z-service');

// config
const config = require('../config.js');

/**
 * checkUserAuth
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.checkUserAuth = async function (req, res) {
  const userCheckRes = await userCheck(config.user, {
    userid: req.headers.userid,
    usertoken: req.headers.usertoken,
    paths: JSON.stringify(config.paths),
    path: req.url.pathname,
  });

  // pass
  if (userCheckRes && userCheckRes.type === 'success') return true;

  // r
  res.json(userCheckRes);
};
