// cos
const COS = require('qiao-cos');

/**
 * cosToken
 * @param {*} req
 * @param {*} res
 */
exports.cosToken = async (req, res) => {
  const methodName = 'cosToken';

  // qcos
  const qcos = COS({
    SecretId: req.body.cosSecretId,
    SecretKey: req.body.cosSecretKey,
    Bucket: req.body.cosBucket,
    Region: req.body.cosRegion,
  });

  // const
  const durationSeconds = req.body.durationSeconds;
  const allowPrefix = req.body.allowPrefix;

  // sts
  try {
    const sts = await qcos.getCredential(durationSeconds, allowPrefix);
    req.logger.info(methodName, 'sts', sts);
    res.jsonSuccess('cos token success', sts);
  } catch (error) {
    const msg = 'cos token error';
    req.logger.error(methodName, msg, error);
    res.jsonFail(msg);
  }
};

/**
 * cosSign
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.cosSign = (req, res) => {
  const methodName = 'cosSign';

  // qcos
  const qcos = COS({
    SecretId: req.body.cosSecretId,
    SecretKey: req.body.cosSecretKey,
    Bucket: req.body.cosBucket,
    Region: req.body.cosRegion,
    signKey: req.body.signKey,
  });

  // const
  const signTimeout = req.body.signTimeout;
  const cdnHost = req.body.cdnHost;
  const filePath = req.body.filePath;
  const formatWebp = req.body.formatWebp;
  const formatWidth = req.body.formatWidth;

  // sign
  const signUrl = qcos.cdnSign(filePath, signTimeout);
  const finalUrl = [cdnHost + signUrl];

  // webp
  if (formatWebp === 'yes') {
    // mp4
    if (filePath.endsWith('mp4')) {
      finalUrl.push('&ci-process=snapshot&time=0&width=0&height=0&format=jpg&rotate=auto&mode=exactframe');
    }

    // format
    finalUrl.push('&imageMogr2/format/webp');
    if (formatWidth) finalUrl.push(`|imageMogr2/thumbnail/${formatWidth}x`);
  }

  // r
  const url = finalUrl.join('');
  req.logger.info(methodName, 'url', url);
  res.jsonSuccess('cos sign success', url);
};
