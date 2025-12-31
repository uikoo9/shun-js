// sql
const sql = require('../sql/McpItemSQL.js');

/**
 * mcp item list
 * @param {*} req
 * @param {*} res
 */
exports.mcpItemList = async (req, res) => {
  // vars
  const mcpInfoId = req.body.mcpInfoId;
  const mcpItemCode = req.body.mcpItemCode;
  const mcpItemDesczh = req.body.mcpItemDesczh;
  const mcpItemPrompt = req.body.mcpItemPrompt;
  const mcpItemUrl = req.body.mcpItemUrl;
  const updateDate = req.body.updateDate;

  // sql and params
  const sqlcount = [sql.mcpItemListCount];
  const paramscount = [];

  const sqlquery = [sql.mcpItemListQuery];
  const paramsquery = [];

  // query
  if (mcpInfoId) {
    sqlcount.push(' and t.mcp_info_id = ?');
    paramscount.push(mcpInfoId);

    sqlquery.push(' and t.mcp_info_id = ?');
    paramsquery.push(mcpInfoId);
  }
  if (mcpItemCode) {
    sqlcount.push(' and t.mcp_item_code = ?');
    paramscount.push(mcpItemCode);

    sqlquery.push(' and t.mcp_item_code = ?');
    paramsquery.push(mcpItemCode);
  }
  if (mcpItemDesczh) {
    sqlcount.push(' and t.mcp_item_desczh = ?');
    paramscount.push(mcpItemDesczh);

    sqlquery.push(' and t.mcp_item_desczh = ?');
    paramsquery.push(mcpItemDesczh);
  }
  if (mcpItemPrompt) {
    sqlcount.push(' and t.mcp_item_prompt = ?');
    paramscount.push(mcpItemPrompt);

    sqlquery.push(' and t.mcp_item_prompt = ?');
    paramsquery.push(mcpItemPrompt);
  }
  if (mcpItemUrl) {
    sqlcount.push(' and t.mcp_item_url = ?');
    paramscount.push(mcpItemUrl);

    sqlquery.push(' and t.mcp_item_url = ?');
    paramsquery.push(mcpItemUrl);
  }
  if (updateDate) {
    sqlcount.push(' and t.update_date = ?');
    paramscount.push(updateDate);

    sqlquery.push(' and t.update_date = ?');
    paramsquery.push(updateDate);
  }

  // order and page
  sqlquery.push(' order by t.? ? limit ?,?');
  const order = req.body.order || 'desc';
  const orderby = req.body.orderby || 'id';
  const pagesize = parseInt(req.body.rows || 10);
  const pagenumber = parseInt(req.body.page || 1);
  const start = (pagenumber - 1) * pagesize;
  paramsquery.push(req.db.mysql.raw(orderby));
  paramsquery.push(req.db.mysql.raw(order));
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
 * mcp item get
 * @param {*} req
 * @param {*} res
 */
exports.mcpItemGet = async (req, res) => {
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

    const rows = await req.db.query(sql.mcpItemGetById, params);
    res.jsonSuccess('query success', { rows: rows });
  } catch (e) {
    req.logger.error(e);
    res.jsonFail('query failed', { errName: e.name, errMsg: e.message });
  }
};

/**
 * mcp item save
 * @param {*} req
 * @param {*} res
 */
exports.mcpItemSave = async (req, res) => {
  // check
  if (!req.body) {
    res.jsonFail('缺少参数！');
    return;
  }
  if (!req.body.mcpInfoId) {
    res.jsonFail('缺少参数mcpInfoId！');
    return;
  }
  if (!req.body.mcpItemCode) {
    res.jsonFail('缺少参数mcpItemCode！');
    return;
  }
  if (!req.body.mcpItemDesczh) {
    res.jsonFail('缺少参数mcpItemDesczh！');
    return;
  }
  if (!req.body.mcpItemPrompt) {
    res.jsonFail('缺少参数mcpItemPrompt！');
    return;
  }
  if (!req.body.mcpItemUrl) {
    res.jsonFail('缺少参数mcpItemUrl！');
    return;
  }
  if (!req.body.updateDate) {
    res.jsonFail('缺少参数updateDate！');
    return;
  }

  // vars
  let id = req.body.id;
  const mcpInfoId = req.body.mcpInfoId;
  const mcpItemCode = req.body.mcpItemCode;
  const mcpItemDesczh = req.body.mcpItemDesczh;
  const mcpItemPrompt = req.body.mcpItemPrompt;
  const mcpItemUrl = req.body.mcpItemUrl;
  const updateDate = req.body.updateDate;

  // db
  try {
    const params = [];

    if (!id) {
      params.push(mcpInfoId);
      params.push(mcpItemCode);
      params.push(mcpItemDesczh);
      params.push(mcpItemPrompt);
      params.push(mcpItemUrl);
      params.push(updateDate);

      const rs = await req.db.query(sql.mcpItemAdd, params);
      id = rs && rs.insertId ? rs.insertId : id;
    } else {
      params.push(mcpInfoId);
      params.push(mcpItemCode);
      params.push(mcpItemDesczh);
      params.push(mcpItemPrompt);
      params.push(mcpItemUrl);
      params.push(updateDate);

      params.push(id);

      await req.db.query(sql.mcpItemEdit, params);
    }

    res.jsonSuccess('save success', { id: id });
  } catch (e) {
    req.logger.error(e);
    res.jsonFail('save failed', { errName: e.name, errMsg: e.message });
  }
};

/**
 * mcp item del
 * @param {*} req
 * @param {*} res
 */
exports.mcpItemDel = async (req, res) => {
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

    await req.db.query(sql.mcpItemDel, params);
    res.jsonSuccess('del success');
  } catch (e) {
    req.logger.error(e);
    res.jsonFail('del failed', { errName: e.name, errMsg: e.message });
  }
};
