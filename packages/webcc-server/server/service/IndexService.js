// encode
const { uuid } = require('qiao-encode');

/**
 * acRefresh
 * @param {*} req
 * @param {*} res
 */
exports.acRefresh = async (req, res) => {
  // const
  const userid = req.headers.userid;

  // set
  const acKey = `ac-${userid}`;
  const accessToken = uuid();
  await req.redis.set(acKey, accessToken);

  // set token
  const tokenKey = `token-${accessToken}`;
  await req.redis.set(tokenKey, userid);

  // r
  res.jsonSuccess('ac refresh ok', accessToken);
};
