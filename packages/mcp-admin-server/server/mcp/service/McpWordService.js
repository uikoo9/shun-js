// sql
const sql = require('../sql/McpWordSQL.js');

/**
 * mcp word list
 * @param {*} req
 * @param {*} res
 */
exports.mcpWordList = async (req, res) => {
  // vars
  const mcpWordContent = req.body.mcpWordContent;
  const mcpWordOrder = req.body.mcpWordOrder;

  // sql and params
  const sqlcount = [sql.mcpWordListCount];
  const paramscount = [];

  const sqlquery = [sql.mcpWordListQuery];
  const paramsquery = [];

  // query
  if (mcpWordContent) {
    sqlcount.push(' and t.mcp_word_content = ?');
    paramscount.push(mcpWordContent);

    sqlquery.push(' and t.mcp_word_content = ?');
    paramsquery.push(mcpWordContent);
  }
  if (mcpWordOrder) {
    sqlcount.push(' and t.mcp_word_order = ?');
    paramscount.push(mcpWordOrder);

    sqlquery.push(' and t.mcp_word_order = ?');
    paramsquery.push(mcpWordOrder);
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
 * mcp word get
 * @param {*} req
 * @param {*} res
 */
exports.mcpWordGet = async (req, res) => {
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

    const rows = await req.db.query(sql.mcpWordGetById, params);
    res.jsonSuccess('query success', { rows: rows });
  } catch (e) {
    req.logger.error(e);
    res.jsonFail('query failed', { errName: e.name, errMsg: e.message });
  }
};

/**
 * mcp word save
 * @param {*} req
 * @param {*} res
 */
exports.mcpWordSave = async (req, res) => {
  // check
  if (!req.body) {
    res.jsonFail('缺少参数！');
    return;
  }
  if (!req.body.mcpWordContent) {
    res.jsonFail('缺少参数mcpWordContent！');
    return;
  }
  if (!req.body.mcpWordOrder) {
    res.jsonFail('缺少参数mcpWordOrder！');
    return;
  }

  // vars
  let id = req.body.id;
  const mcpWordContent = req.body.mcpWordContent;
  const mcpWordOrder = req.body.mcpWordOrder;

  // db
  try {
    const params = [];

    if (!id) {
      params.push(mcpWordContent);
      params.push(mcpWordOrder);

      const rs = await req.db.query(sql.mcpWordAdd, params);
      id = rs && rs.insertId ? rs.insertId : id;
    } else {
      params.push(mcpWordContent);
      params.push(mcpWordOrder);

      params.push(id);

      await req.db.query(sql.mcpWordEdit, params);
    }

    res.jsonSuccess('save success', { id: id });
  } catch (e) {
    req.logger.error(e);
    res.jsonFail('save failed', { errName: e.name, errMsg: e.message });
  }
};

/**
 * mcp word del
 * @param {*} req
 * @param {*} res
 */
exports.mcpWordDel = async (req, res) => {
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

    await req.db.query(sql.mcpWordDel, params);
    res.jsonSuccess('del success');
  } catch (e) {
    req.logger.error(e);
    res.jsonFail('del failed', { errName: e.name, errMsg: e.message });
  }
};
