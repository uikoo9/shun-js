// config
const config = require('../config.json');

/**
 * config
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.config = async (req, res) => {
  // type
  const type = req.body.type || 'mp-xiaolouai';

  // r
  res.jsonSuccess('success', config[type]);
};
