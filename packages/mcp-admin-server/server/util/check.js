// check
const { checkUserToken } = require('./check-user.js');
const { checkUserMenu } = require('./check-menu.js');

/**
 * checkUserAuthNew
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.checkUserAuthNew = async function (req, res) {
  // normal visit
  const normalVisitPath = global.QZ_CONFIG.paths;
  for (let i = 0; i < normalVisitPath.length; i++) {
    if (req.url.pathname == normalVisitPath[i]) return true;
  }

  // auth - has token
  const userid = req.headers.userid;
  const usertoken = req.headers.usertoken;
  if (!userid || !usertoken) {
    res.jsonFail('缺少token！');
    return;
  }

  // auth
  try {
    // check user
    const user = await checkUserToken(req, res, userid, usertoken);
    if (!user) return;

    // check menu
    const checkMenuRes = await checkUserMenu(req, res, userid);
    if (!checkMenuRes) return;

    // return
    return true;
  } catch (e) {
    res.jsonFail('校验auth失败！', { errName: e.name, errMsg: e.message });
    return;
  }
};
