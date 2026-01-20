// path
const path = require('path');

// qiao
const { readFile } = require('qiao-file');

/**
 * robots
 * @param {*} req
 * @param {*} res
 */
exports.robots = async (req, res) => {
  const txtPath = path.resolve(__dirname, '../../../assets/robots.txt');
  const txt = await readFile(txtPath);
  res.send(txt);
};

/**
 * sitemap
 * @param {*} req
 * @param {*} res
 */
exports.sitemap = async (req, res) => {
  const sitemapPath = path.resolve(__dirname, '../../../assets/sitemap.xml');
  const sitemap = await readFile(sitemapPath);
  res.send(sitemap);
};

/**
 * bingIndexNow
 * @param {*} req
 * @param {*} res
 */
exports.bingIndexNow = async (req, res) => {
  const txtPath = path.resolve(__dirname, '../../../assets/bing.txt');
  const txt = await readFile(txtPath);
  res.send(txt);
};
