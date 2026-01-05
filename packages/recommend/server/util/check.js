/**
 * checkParams
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.checkParams = async (req, res) => {
  const methodName = 'checkParams';

  // const
  const userId = req.body.userId;
  const newUserId = req.body.newUserId;

  // check
  if (!userId) {
    const msg = 'need userId';
    req.logger.warn(methodName, msg, req.body);
    res.jsonFail(msg);
    return;
  }
  if (!newUserId) {
    const msg = 'need newUserId';
    req.logger.warn(methodName, msg, req.body);
    res.jsonFail(msg);
    return;
  }

  return true;
};
