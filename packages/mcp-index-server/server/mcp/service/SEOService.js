// path
const path = require('path');

// dayjs
const dayjs = require('dayjs');

// template
const template = require('art-template');

// qiao
const { readFile } = require('qiao-file');

// util
const { mcpErrorFeishuMsg } = require('../../util/feishu.js');

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
  const methodName = 'sitemap';

  try {
    // template
    const sitemapTemplate = path.resolve(__dirname, '../../../assets/sitemap.template');

    // data
    const mpcList = await req.redis.get('mcpInfoList');
    const mcpListObj = JSON.parse(mpcList);
    const mcpListData = mcpListObj.map((item) => item.mcp_item_code);
    const sitemapData = template(sitemapTemplate, {
      date: dayjs().format('YYYY-MM-DD'),
      sitemaps: mcpListData,
    });

    // res
    res.send(sitemapData);
  } catch (e) {
    const msg = 'gen sitemap error';
    mcpErrorFeishuMsg(req, `${methodName}-${msg}`);
    req.logger.error(methodName, msg, e);
    res.send(msg);
  }
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
