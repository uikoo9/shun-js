// sql
const sql = require('../sql/McpInfoSQL.js');

/**
 * mcp info list
 * @param {*} req
 * @param {*} res
 */
exports.mcpInfoList = async (req, res) => {
  // vars
  const mcpItemCode = req.body.mcpItemCode;
  const mcpItemAuthor = req.body.mcpItemAuthor;
  const mcpItemStars = req.body.mcpItemStars;
  const mcpItemLanguage = req.body.mcpItemLanguage;
  const mcpItemLicense = req.body.mcpItemLicense;
  const mcpItemHomepage = req.body.mcpItemHomepage;
  const mcpItemBranch = req.body.mcpItemBranch;
  const mcpItemDesc = req.body.mcpItemDesc;
  const mcpItemDesczh = req.body.mcpItemDesczh;
  const mcpItemContent = req.body.mcpItemContent;
  const mcpItemContentzh = req.body.mcpItemContentzh;
  const updateDate = req.body.updateDate;

  // sql and params
  const sqlcount = [sql.mcpInfoListCount];
  const paramscount = [];

  const sqlquery = [sql.mcpInfoListQuery];
  const paramsquery = [];

  // query
  if (mcpItemCode) {
    sqlcount.push(' and t.mcp_item_code = ?');
    paramscount.push(mcpItemCode);

    sqlquery.push(' and t.mcp_item_code = ?');
    paramsquery.push(mcpItemCode);
  }
  if (mcpItemAuthor) {
    sqlcount.push(' and t.mcp_item_author = ?');
    paramscount.push(mcpItemAuthor);

    sqlquery.push(' and t.mcp_item_author = ?');
    paramsquery.push(mcpItemAuthor);
  }
  if (mcpItemStars) {
    sqlcount.push(' and t.mcp_item_stars = ?');
    paramscount.push(mcpItemStars);

    sqlquery.push(' and t.mcp_item_stars = ?');
    paramsquery.push(mcpItemStars);
  }
  if (mcpItemLanguage) {
    sqlcount.push(' and t.mcp_item_language = ?');
    paramscount.push(mcpItemLanguage);

    sqlquery.push(' and t.mcp_item_language = ?');
    paramsquery.push(mcpItemLanguage);
  }
  if (mcpItemLicense) {
    sqlcount.push(' and t.mcp_item_license = ?');
    paramscount.push(mcpItemLicense);

    sqlquery.push(' and t.mcp_item_license = ?');
    paramsquery.push(mcpItemLicense);
  }
  if (mcpItemHomepage) {
    sqlcount.push(' and t.mcp_item_homepage = ?');
    paramscount.push(mcpItemHomepage);

    sqlquery.push(' and t.mcp_item_homepage = ?');
    paramsquery.push(mcpItemHomepage);
  }
  if (mcpItemBranch) {
    sqlcount.push(' and t.mcp_item_branch = ?');
    paramscount.push(mcpItemBranch);

    sqlquery.push(' and t.mcp_item_branch = ?');
    paramsquery.push(mcpItemBranch);
  }
  if (mcpItemDesc) {
    sqlcount.push(' and t.mcp_item_desc = ?');
    paramscount.push(mcpItemDesc);

    sqlquery.push(' and t.mcp_item_desc = ?');
    paramsquery.push(mcpItemDesc);
  }
  if (mcpItemDesczh) {
    sqlcount.push(' and t.mcp_item_desczh = ?');
    paramscount.push(mcpItemDesczh);

    sqlquery.push(' and t.mcp_item_desczh = ?');
    paramsquery.push(mcpItemDesczh);
  }
  if (mcpItemContent) {
    sqlcount.push(' and t.mcp_item_content = ?');
    paramscount.push(mcpItemContent);

    sqlquery.push(' and t.mcp_item_content = ?');
    paramsquery.push(mcpItemContent);
  }
  if (mcpItemContentzh) {
    sqlcount.push(' and t.mcp_item_contentzh = ?');
    paramscount.push(mcpItemContentzh);

    sqlquery.push(' and t.mcp_item_contentzh = ?');
    paramsquery.push(mcpItemContentzh);
  }
  if (updateDate) {
    sqlcount.push(' and t.update_date = ?');
    paramscount.push(updateDate);

    sqlquery.push(' and t.update_date = ?');
    paramsquery.push(updateDate);
  }

  // order and page
  sqlquery.push(' order by CAST(t.mcp_item_stars AS UNSIGNED) desc limit ?,?');
  const pagesize = parseInt(req.body.rows || 10);
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

    res.jsonSuccess('query success', result);
  } catch (e) {
    req.logger.error(e);
    res.jsonFail('query failed', { errName: e.name, errMsg: e.message });
  }
};

/**
 * mcp info get
 * @param {*} req
 * @param {*} res
 */
exports.mcpInfoGet = async (req, res) => {
  // check
  if (!req.body) {
    res.jsonFail('缺少参数！');
    return;
  }
  if (!req.body.id) {
    res.jsonFail('缺少参数id！');
    return;
  }

  // db
  try {
    const params = [];
    params.push(req.body.id);

    const rows = await req.db.query(sql.mcpInfoGetById, params);
    res.jsonSuccess('query success', { rows: rows });
  } catch (e) {
    req.logger.error(e);
    res.jsonFail('query failed', { errName: e.name, errMsg: e.message });
  }
};

/**
 * mcp info save
 * @param {*} req
 * @param {*} res
 */
exports.mcpInfoSave = async (req, res) => {
  // check
  if (!req.body) {
    res.jsonFail('缺少参数！');
    return;
  }
  if (!req.body.mcpItemCode) {
    res.jsonFail('缺少参数mcpItemCode！');
    return;
  }
  if (!req.body.mcpItemAuthor) {
    res.jsonFail('缺少参数mcpItemAuthor！');
    return;
  }
  if (!req.body.mcpItemStars) {
    res.jsonFail('缺少参数mcpItemStars！');
    return;
  }
  if (!req.body.mcpItemLanguage) {
    res.jsonFail('缺少参数mcpItemLanguage！');
    return;
  }
  if (!req.body.mcpItemLicense) {
    res.jsonFail('缺少参数mcpItemLicense！');
    return;
  }
  if (!req.body.mcpItemHomepage) {
    res.jsonFail('缺少参数mcpItemHomepage！');
    return;
  }
  if (!req.body.mcpItemBranch) {
    res.jsonFail('缺少参数mcpItemBranch！');
    return;
  }
  if (!req.body.mcpItemTag) {
    res.jsonFail('缺少参数mcpItemTag！');
    return;
  }
  if (!req.body.mcpItemDesc) {
    res.jsonFail('缺少参数mcpItemDesc！');
    return;
  }
  if (!req.body.mcpItemDesczh) {
    res.jsonFail('缺少参数mcpItemDesczh！');
    return;
  }
  if (!req.body.mcpItemContent) {
    res.jsonFail('缺少参数mcpItemContent！');
    return;
  }
  if (!req.body.mcpItemContentzh) {
    res.jsonFail('缺少参数mcpItemContentzh！');
    return;
  }
  if (!req.body.updateDate) {
    res.jsonFail('缺少参数updateDate！');
    return;
  }

  // vars
  let id = req.body.id;
  const mcpItemCode = req.body.mcpItemCode;
  const mcpItemAuthor = req.body.mcpItemAuthor;
  const mcpItemStars = req.body.mcpItemStars;
  const mcpItemLanguage = req.body.mcpItemLanguage;
  const mcpItemLicense = req.body.mcpItemLicense;
  const mcpItemHomepage = req.body.mcpItemHomepage;
  const mcpItemBranch = req.body.mcpItemBranch;
  const mcpItemTag = req.body.mcpItemTag;
  const mcpItemDesc = req.body.mcpItemDesc;
  const mcpItemDesczh = req.body.mcpItemDesczh;
  const mcpItemContent = req.body.mcpItemContent;
  const mcpItemContentzh = req.body.mcpItemContentzh;
  const updateDate = req.body.updateDate;

  // db
  try {
    const params = [];

    if (!id) {
      params.push(mcpItemCode);
      params.push(mcpItemAuthor);
      params.push(mcpItemStars);
      params.push(mcpItemLanguage);
      params.push(mcpItemLicense);
      params.push(mcpItemHomepage);
      params.push(mcpItemBranch);
      params.push(mcpItemTag);
      params.push(mcpItemDesc);
      params.push(mcpItemDesczh);
      params.push(mcpItemContent);
      params.push(mcpItemContentzh);
      params.push(updateDate);

      const rs = await req.db.query(sql.mcpInfoAdd, params);
      id = rs && rs.insertId ? rs.insertId : id;
    } else {
      params.push(mcpItemCode);
      params.push(mcpItemAuthor);
      params.push(mcpItemStars);
      params.push(mcpItemLanguage);
      params.push(mcpItemLicense);
      params.push(mcpItemHomepage);
      params.push(mcpItemBranch);
      params.push(mcpItemTag);
      params.push(mcpItemDesc);
      params.push(mcpItemDesczh);
      params.push(mcpItemContent);
      params.push(mcpItemContentzh);
      params.push(updateDate);

      params.push(id);

      await req.db.query(sql.mcpInfoEdit, params);
    }

    res.jsonSuccess('save success', { id: id });
  } catch (e) {
    req.logger.error(e);
    res.jsonFail('save failed', { errName: e.name, errMsg: e.message });
  }
};

/**
 * mcp info del
 * @param {*} req
 * @param {*} res
 */
exports.mcpInfoDel = async (req, res) => {
  // check
  if (!req.body) {
    res.jsonFail('缺少参数！');
    return;
  }
  if (!req.body.ids) {
    res.jsonFail('缺少参数ids！');
    return;
  }

  // db
  try {
    const params = [];
    params.push(req.body.ids.split(','));

    await req.db.query(sql.mcpInfoDel, params);
    res.jsonSuccess('del success');
  } catch (e) {
    req.logger.error(e);
    res.jsonFail('del failed', { errName: e.name, errMsg: e.message });
  }
};
