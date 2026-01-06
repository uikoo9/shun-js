// data
const { dataEvents } = require('../model/DataModel.js');

/**
 * data
 * @param {*} req
 * @param {*} res
 */
exports.data = async (req, res) => {
  const methodName = 'data';

  // push
  req.logger.info(methodName, dataEvents.length);
  dataEvents.push(req.body);
  req.logger.info(methodName, dataEvents.length);

  // r
  res.jsonSuccess('ok');
};
