// util
const { checkParams } = require('../util/check.js');
const { feishuMsg } = require('../util/feishu.js');

// model
const { addRecommend, listRecommend, getRecommend, updateRecommend } = require('../model/RecommendModel.js');

/**
 * recommendAdd
 * @param {*} req
 * @param {*} res
 */
exports.recommendAdd = async (req, res) => {
  // check params
  const checkParamsRes = checkParams(req, res);
  if (!checkParamsRes) return;

  // add
  await addRecommend(req, res);

  // feishu
  feishuMsg(`【提醒】用户-${req.body.userId}，推荐新用户-${req.body.newUserId}注册成功！`);
};

/**
 * recommendList
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.recommendList = async (req, res) => {
  const methodName = 'recommendList';

  // check
  const userId = req.body.userId;
  if (!userId) {
    const msg = 'need userId';
    req.logger.warn(methodName, msg, req.body);
    res.jsonFail(msg);
    return;
  }

  // list
  const list = await listRecommend(req, res, userId);
  if (!list) return;

  // r
  res.jsonSuccess('list success', list);
};

/**
 * recommendChange
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.recommendChange = async (req, res) => {
  const methodName = 'recommendChange';

  // check params
  const checkParamsRes = checkParams(req, res);
  if (!checkParamsRes) return;

  // get
  const recommends = await getRecommend(req, res);
  if (!recommends) return;

  // check recommends
  if (recommends.length !== 1) {
    const msg = '该记录已经兑换！';
    req.logger.error(methodName, msg);
    res.jsonFail(msg);
    return;
  }

  // update
  const recommend = recommends[0];
  await updateRecommend(req, res, recommend.id);

  // feishu
  feishuMsg(`【提醒】用户-${recommend.recommend_user_id}-${recommend.recommend_newuser_id}兑换VIP会员成功！`);
};
