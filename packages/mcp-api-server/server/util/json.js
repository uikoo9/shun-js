/**
 * extractJsonFromText
 * @param {*} req
 * @param {*} text
 * @returns
 */
exports.extractJsonFromText = (req, text) => {
  const methodName = 'extractJsonFromText';

  try {
    // check
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) return null;

    // go
    const jsonStr = text.slice(start, end + 1);

    // r
    return JSON.parse(jsonStr);
  } catch (error) {
    const msg = 'parse msg error';
    req.logger.error(methodName, msg, error);
  }
};
