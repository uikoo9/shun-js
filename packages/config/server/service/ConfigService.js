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
  res.jsonSuccess('success', global.QZ_CONFIG[type]);
};
