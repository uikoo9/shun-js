// qiao
const { userCheck } = require('qiao-z-service');

/**
 * checkUserAuth
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.checkUserAuth = async function (req, res) {
  const userCheckRes = await userCheck(global.QZ_CONFIG.user, {
    userid: req.headers.userid,
    usertoken: req.headers.usertoken,
    paths: JSON.stringify(global.QZ_CONFIG.paths),
    path: req.url.pathname,
  });

  // pass
  if (userCheckRes && userCheckRes.type === 'success') return true;

  // r
  res.json(userCheckRes);
};
