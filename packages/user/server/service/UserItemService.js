// qiao
const { AESEncrypt } = require('qiao-encode');

// model
const { getUserItemByName, addUserItem, getUserItemById } = require('../model/UserItemModel.js');

// feishu
const { feishuBot } = require('@shun-js/shun-service');

/**
 * userLogin
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.userLogin = async (req, res) => {
  const methodName = 'userLogin';

  // const
  const mobile = req.body.mobile;
  const code = req.body.code;
  if (!mobile) {
    const msg = 'need mobile';
    req.logger.warn(methodName, msg, req.body);
    res.jsonFail(msg);
    return;
  }
  if (!code) {
    const msg = 'need code';
    req.logger.warn(methodName, msg, req.body);
    res.jsonFail(msg);
    return;
  }

  // user code
  const cacheKey = `code-${mobile}`;
  const cacheCode = await req.redis.get(cacheKey);
  req.logger.info(methodName, 'cacheKey', cacheKey);
  req.logger.info(methodName, 'cacheCode', cacheCode);
  req.logger.info(methodName, 'code', code);
  if (cacheCode === code) {
    await req.redis.del(cacheKey);
  } else {
    const msg = '验证码错误，请重新填写';
    req.logger.error(methodName, msg, mobile, code);
    res.jsonFail(msg);
    return;
  }

  // user item
  const getUserItemRes = await getUserItemByName(req, res, mobile);
  if (!getUserItemRes) return;

  // reg
  if (getUserItemRes.length !== 1) {
    // add user
    const addUserItemRes = await addUserItem(req, res, mobile);
    if (!addUserItemRes) return;

    // feishu
    const finalMsg = `【提醒】success - ${methodName} - new user reg - ${addUserItemRes.id}`;
    const feishuBotRes = await feishuBot({
      url: global.QZ_CONFIG.feishu.url,
      feishuUrl: global.QZ_CONFIG.feishu.feishuUrl,
      feishuMsg: finalMsg,
    });
    req.logger.warn(methodName, 'feishuBotRes', feishuBotRes);

    // r
    res.jsonSuccess('登录成功！', addUserItemRes);
    return;
  }

  // login
  const user = getUserItemRes[0];
  const userItem = {
    id: user.id,
    usertoken: AESEncrypt(mobile + user.user_item_password, global.QZ_CONFIG.encryptKey),
    usermobile: mobile,
  };

  // feishu
  const finalMsg = `【提醒】success - ${methodName} - user login - ${userItem.id}`;
  const feishuBotRes = await feishuBot({
    url: global.QZ_CONFIG.feishu.url,
    feishuUrl: global.QZ_CONFIG.feishu.feishuUrl,
    feishuMsg: finalMsg,
  });
  req.logger.warn(methodName, 'feishuBotRes', feishuBotRes);

  // r
  res.jsonSuccess('登录成功！', userItem);
};

/**
 * userCheck
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.userCheck = async (req, res) => {
  const methodName = 'userCheck';

  // const
  const paths = JSON.parse(req.headers.paths || '[]');
  const path = req.headers.path;

  // normal visit
  const finalPaths = [].concat(global.QZ_CONFIG.paths, paths);
  const normalVisit = finalPaths.includes(path);
  req.logger.info(methodName, 'paths', paths);
  req.logger.info(methodName, 'path', path);
  req.logger.info(methodName, 'finalPaths', finalPaths);
  req.logger.info(methodName, 'normalVisit', normalVisit);
  if (normalVisit) {
    res.jsonSuccess('normal path');
    return;
  }

  // check userid and usertoken
  const userid = req.headers.userid;
  const usertoken = req.headers.usertoken;
  if (!userid || !usertoken) {
    res.jsonFail('缺少用户token！');
    return;
  }

  // get user
  const userItemRes = await getUserItemById(req, res, userid);
  if (!userItemRes) {
    res.jsonFail('非法token！');
    return;
  }

  // check token
  const username = userItemRes['user_item_name'];
  const password = userItemRes['user_item_password'];
  const rUsertoken = AESEncrypt(username + password, global.QZ_CONFIG.encryptKey);
  if (rUsertoken !== decodeURIComponent(usertoken)) {
    res.jsonFail('非法token！');
    return;
  }

  // r
  res.jsonSuccess('合法token！');
};
