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

  // clear old
  const acKey = `ac-${userid}`;
  const oldToken = await req.redis.get(acKey);
  await req.redis.del(`token-${oldToken}`);

  // set new ac-
  const accessToken = uuid();
  await req.redis.set(acKey, accessToken);

  // set new token-
  const tokenKey = `token-${accessToken}`;
  await req.redis.set(tokenKey, userid);

  // r
  res.jsonSuccess('ac refresh ok', accessToken);
};

/**
 * acCheck
 * @param {*} req
 * @param {*} res
 */
exports.acCheck = async (req, res) => {
  const tokenValue = await req.redis.get(`token-${req.body.token}`);
  if (tokenValue) {
    res.jsonSuccess('ok');
  } else {
    res.jsonFail('no');
  }
};
