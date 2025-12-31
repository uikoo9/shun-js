// model
const { addMCPSearchWord, addMCPSearchTag } = require('../model/MCPModel.js');

// sql
const sql = require('../sql/MCPSQL.js');

// util
const { mcpListFeishuMsg, mcpErrorFeishuMsg } = require('../../util/feishu.js');
const { getDataByCache, setDataToCache } = require('../../util/cache.js');

/**
 * mcp list
 * @param {*} req
 * @param {*} res
 */
exports.mcpList = async (req, res) => {
  const methodName = 'mcpList';

  // feishu
  mcpListFeishuMsg(req);

  // word
  addMCPSearchWord(req);
  addMCPSearchTag(req);

  // cache
  const cacheObj = await getDataByCache(req);
  if (cacheObj) {
    res.jsonSuccess('query success', cacheObj);
    return;
  }

  // vars
  const word = req.body.word;
  const tag = req.body.tag;

  // sql and params
  const sqlcount = [sql.mcpItemListCount];
  const paramscount = [];

  const sqlquery = [sql.mcpItemListQuery];
  const paramsquery = [];

  // query
  if (word) {
    sqlcount.push(' and (t.mcp_item_code like ? or t.mcp_item_desc like ? or t.mcp_item_desczh like ?)');
    paramscount.push(`%${word}%`);
    paramscount.push(`%${word}%`);
    paramscount.push(`%${word}%`);

    sqlquery.push(' and (t.mcp_item_code like ? or t.mcp_item_desc like ? or t.mcp_item_desczh like ?)');
    paramsquery.push(`%${word}%`);
    paramsquery.push(`%${word}%`);
    paramsquery.push(`%${word}%`);
  }
  if (tag) {
    sqlcount.push(' and t.mcp_item_tag like ?');
    paramscount.push(`%${tag}%`);

    sqlquery.push(' and t.mcp_item_tag like ?');
    paramsquery.push(`%${tag}%`);
  }

  // order and page
  sqlquery.push(' order by CAST(t.mcp_item_stars AS UNSIGNED) desc limit ?,?');
  const pagesize = parseInt(req.body.rows || 28);
  const pagenumber = parseInt(req.body.page || 1);
  const start = (pagenumber - 1) * pagesize;
  paramsquery.push(start);
  paramsquery.push(pagesize);

  // db
  try {
    const rs = await req.db.query(sqlcount.join(''), paramscount);
    const rows = await req.db.query(sqlquery.join(''), paramsquery);

    // result
    const result = {};
    result.total = rs[0]['tcount'];
    result.rows = rows;
    result.sumpage = Math.ceil(result.total / pagesize);
    result.pagenumber = pagenumber;
    result.pagesize = pagesize;

    // cache
    setDataToCache(req, result);

    // r
    res.jsonSuccess('query success', result);
  } catch (error) {
    const msg = 'get mcp list error';
    mcpErrorFeishuMsg(req, `${methodName}-${msg}`);
    req.logger.error(methodName, error);
    res.jsonFail(msg);
  }
};
