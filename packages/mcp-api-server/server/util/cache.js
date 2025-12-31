const { createHash } = require('crypto');

/**
 * getDataByCache
 * @param {*} req
 * @returns
 */
exports.getDataByCache = async (req) => {
  const methodName = 'getDataByCache';

  try {
    // key
    const redisKey = getCacheKey(req);
    req.logger.info(methodName, 'redisKey', redisKey);

    // redis
    const redisValue = await req.redis.get(redisKey);
    return JSON.parse(redisValue);
  } catch (error) {
    req.logger.error(methodName, error.name, error.message);
  }
};

/**
 * setDataToCache
 * @param {*} req
 * @param {*} obj
 */
exports.setDataToCache = async (req, obj) => {
  const methodName = 'setDataToCache';

  try {
    // key
    const redisKey = getCacheKey(req);
    req.logger.info(methodName, 'redisKey', redisKey);

    // redis
    await req.redis.set(redisKey, JSON.stringify(obj));
  } catch (error) {
    req.logger.error(methodName, error.name, error.message);
  }
};

// get cache key
function getCacheKey(req) {
  const bodyStr = JSON.stringify(req.body || {});
  return createHash('sha256').update(bodyStr).digest('hex');
}
