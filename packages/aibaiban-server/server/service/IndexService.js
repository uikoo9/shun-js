/**
 * index
 * @param {*} req
 * @param {*} res
 */
exports.index = async (req, res) => {
  // const
  const pagePath = './views/index.html';

  // is static
  const isStatic = await res.staticRender(pagePath);
  if (isStatic) return;

  // render
  res.render(pagePath, {}, true);
};

/**
 * board
 * @param {*} req
 * @param {*} res
 */
exports.board = async (req, res) => {
  // const
  const pagePath = './views/board.html';

  // is static
  const isStatic = await res.staticRender(pagePath);
  if (isStatic) return;

  // render
  res.render(pagePath, {}, true);
};
