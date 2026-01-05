// model
const { cosToken, cosSign } = require('../model/CosModel.js');

/**
 * cosToken
 * @param {*} req
 * @param {*} res
 */
exports.cosToken = async (req, res) => {
  const methodName = 'cosToken';

  // const cos
  const cosSecretId = req.body.cosSecretId;
  const cosSecretKey = req.body.cosSecretKey;
  const cosBucket = req.body.cosBucket;
  const cosRegion = req.body.cosRegion;
  if (!cosSecretId) {
    const msg = 'need cosSecretId';
    req.logger.warn(methodName, msg);
    return res.jsonFail(msg);
  }
  if (!cosSecretKey) {
    const msg = 'need cosSecretKey';
    req.logger.warn(methodName, msg);
    return res.jsonFail(msg);
  }
  if (!cosBucket) {
    const msg = 'need cosBucket';
    req.logger.warn(methodName, msg);
    return res.jsonFail(msg);
  }
  if (!cosRegion) {
    const msg = 'need cosRegion';
    req.logger.warn(methodName, msg);
    return res.jsonFail(msg);
  }

  // const others
  const durationSeconds = req.body.durationSeconds;
  const allowPrefix = req.body.allowPrefix;
  if (!durationSeconds) {
    const msg = 'need durationSeconds';
    req.logger.warn(methodName, msg);
    return res.jsonFail(msg);
  }
  if (!allowPrefix) {
    const msg = 'need allowPrefix';
    req.logger.warn(methodName, msg);
    return res.jsonFail(msg);
  }

  // cos token
  cosToken(req, res);
};

/**
 * cosSign
 * @param {*} req
 * @param {*} res
 */
exports.cosSign = async (req, res) => {
  const methodName = 'cosSign';

  // const cos
  const cosSecretId = req.body.cosSecretId;
  const cosSecretKey = req.body.cosSecretKey;
  const cosBucket = req.body.cosBucket;
  const cosRegion = req.body.cosRegion;
  if (!cosSecretId) {
    const msg = 'need cosSecretId';
    req.logger.warn(methodName, msg);
    return res.jsonFail(msg);
  }
  if (!cosSecretKey) {
    const msg = 'need cosSecretKey';
    req.logger.warn(methodName, msg);
    return res.jsonFail(msg);
  }
  if (!cosBucket) {
    const msg = 'need cosBucket';
    req.logger.warn(methodName, msg);
    return res.jsonFail(msg);
  }
  if (!cosRegion) {
    const msg = 'need cosRegion';
    req.logger.warn(methodName, msg);
    return res.jsonFail(msg);
  }

  // const others
  const signKey = req.body.signKey;
  const signTimeout = req.body.signTimeout;
  const cdnHost = req.body.cdnHost;
  const filePath = req.body.filePath;
  const formatWebp = req.body.formatWebp;
  const formatWidth = req.body.formatWidth;
  if (!signKey) {
    const msg = 'need signKey';
    req.logger.warn(methodName, msg);
    return res.jsonFail(msg);
  }
  if (!signTimeout) {
    const msg = 'need signTimeout';
    req.logger.warn(methodName, msg);
    return res.jsonFail(msg);
  }
  if (!cdnHost) {
    const msg = 'need cdnHost';
    req.logger.warn(methodName, msg);
    return res.jsonFail(msg);
  }
  if (!filePath) {
    const msg = 'need filePath';
    req.logger.warn(methodName, msg);
    return res.jsonFail(msg);
  }
  if (!formatWebp) {
    const msg = 'need formatWebp';
    req.logger.warn(methodName, msg);
    return res.jsonFail(msg);
  }
  if (!formatWidth) {
    const msg = 'need formatWidth';
    req.logger.warn(methodName, msg);
    return res.jsonFail(msg);
  }

  // cos sign
  cosSign(req, res);
};
