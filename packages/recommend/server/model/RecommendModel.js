// mysql
const sql = require('../sql/recommend-sql.json');

/**
 * addRecommend
 * @param {*} req
 * @param {*} res
 */
exports.addRecommend = async (req, res) => {
  const methodName = 'addRecommend';

  // const
  const userId = req.body.userId;
  const newUserId = req.body.newUserId;

  // params
  const params = [];
  params.push(userId);
  params.push(newUserId);

  // add recommend
  try {
    await req.db.query(sql.addRecommend, params);

    const msg = 'add success';
    req.logger.info(methodName, msg);
    res.jsonSuccess(msg);
  } catch (error) {
    const msg = 'add fail';
    req.logger.error(methodName, msg, error.name, error.message);
    res.jsonFail(msg);
  }
};

/**
 * listRecommend
 * @param {*} req
 * @param {*} res
 * @param {*} userId
 */
exports.listRecommend = async (req, res, userId) => {
  const methodName = 'listRecommend';

  // list recommend
  try {
    return await req.db.query(sql.listRecommend, [userId]);
  } catch (error) {
    const msg = 'list fail';
    req.logger.error(methodName, msg, error.name, error.message);
    res.jsonFail(msg);
  }
};

/**
 * getRecommend
 * @param {*} req
 * @param {*} res
 */
exports.getRecommend = async (req, res) => {
  const methodName = 'getRecommend';

  // const
  const userId = req.body.userId;
  const newUserId = req.body.newUserId;

  // params
  const params = [];
  params.push(userId);
  params.push(newUserId);

  // get recommend
  try {
    return await req.db.query(sql.getRecommend, params);
  } catch (error) {
    const msg = 'get fail';
    req.logger.error(methodName, msg, error.name, error.message);
    res.jsonFail(msg);
  }
};

/**
 * updateRecommend
 * @param {*} req
 * @param {*} res
 */
exports.updateRecommend = async (req, res, id) => {
  const methodName = 'updateRecommend';

  // get recommend
  try {
    await req.db.query(sql.updateRecommend, [id]);

    const msg = 'update success';
    req.logger.info(methodName, msg);
    res.jsonSuccess(msg);
  } catch (error) {
    const msg = 'update fail';
    req.logger.error(methodName, msg, error.name, error.message);
    res.jsonFail(msg);
  }
};
