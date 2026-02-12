// qiao
const { uuid, AESEncrypt } = require('qiao-encode');

// sql
const sql = require('../sql/UserItemSQL.js');

/**
 * getUserItemByName
 * @param {*} req
 * @param {*} res
 * @param {*} mobile
 * @returns
 */
exports.getUserItemByName = async (req, res, mobile) => {
  const methodName = 'getUserItemByName';

  // get user item
  try {
    return await req.db.query(sql.getUserItemByName, [mobile]);
  } catch (error) {
    const msg = '获取用户信息失败！';
    req.logger.error(methodName, msg, error.name, error.message);
    res.jsonFail(msg);
  }
};

/**
 * addUserItem
 * @param {*} req
 * @param {*} res
 * @param {*} mobile
 * @returns
 */
exports.addUserItem = async (req, res, mobile) => {
  const methodName = 'addUserItem';

  // add user item
  try {
    // pwd
    const password = uuid();
    const encryptPassword = AESEncrypt(password, global.QZ_CONFIG.encryptKey);
    req.logger.info(methodName, 'password', password);
    req.logger.info(methodName, 'encryptPassword', encryptPassword);

    // add user
    const addUserItemRes = await req.db.query(sql.addUserItem, [mobile, encryptPassword, req.body.from || 'null']);

    // userItem
    const userItem = {
      id: addUserItemRes.insertId,
      usertoken: AESEncrypt(mobile + encryptPassword, global.QZ_CONFIG.encryptKey),
      usermobile: mobile,
    };
    req.logger.info(methodName, 'userItem', userItem);

    // r
    return userItem;
  } catch (error) {
    const msg = '添加用户失败！';
    req.logger.error(methodName, msg, error.name, error.message);
    res.jsonFail(msg);
  }
};

/**
 * getUserItemById
 * @param {*} req
 * @param {*} res
 * @param {*} id
 * @returns
 */
exports.getUserItemById = async (req, res, id) => {
  const methodName = 'getUserItemById';

  // get user item
  try {
    const getUserItemByIdRes = await req.db.query(sql.getUserItemById, [id]);
    if (getUserItemByIdRes.length !== 1) {
      res.jsonFail('缺少用户信息！');
      return;
    }

    return getUserItemByIdRes[0];
  } catch (error) {
    const msg = '获取用户信息失败！';
    req.logger.error(methodName, msg, error.name, error.message);
    res.jsonFail(msg);
  }
};
