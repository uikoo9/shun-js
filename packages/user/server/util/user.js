// qiao
const { AESEncrypt } = require('qiao-encode');

// model
const { getUserItemByName, addUserItem } = require('../model/UserItemModel.js');

// feishu
const { feishuBot } = require('@shun-js/shun-service');

/**
 * loginORRegUser
 * @param {*} req
 * @param {*} res
 * @param {*} mobileOREmail
 * @returns
 */
exports.loginORRegUser = async (req, res, mobileOREmail) => {
  const methodName = 'loginORRegUser';

  // user item
  const getUserItemRes = await getUserItemByName(req, res, mobileOREmail);
  if (!getUserItemRes) return;

  // reg
  if (getUserItemRes.length !== 1) {
    // add user
    const addUserItemRes = await addUserItem(req, res, mobileOREmail);
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
    return addUserItemRes;
  }

  // login
  const user = getUserItemRes[0];
  const userItem = {
    id: user.id,
    usertoken: AESEncrypt(mobileOREmail + user.user_item_password, global.QZ_CONFIG.encryptKey),
    usermobile: mobileOREmail,
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
  return userItem;
};
