// qiao
const { post } = require('qiao-ajax');

// mysql
const sql = require('../sql/MCPSQL.js');

// util
const { mcpErrorFeishuMsg } = require('../../util/feishu.js');

/**
 * getMCPListFirstPage
 * @param {*} req
 * @returns
 */
exports.getMCPListFirstPage = async (req) => {
  const methodName = 'getMCPListFirstPage';

  // url
  const url = '/mcp/list';

  // go
  try {
    // check
    const mcpListRes = await post(global.QZ_CONFIG.urls.mcpUrl + url);
    if (mcpListRes.status !== 200) {
      const msg = `request ${url} fail: status is ${mcpListRes.status}`;
      req.logger.warn(methodName, msg);
      return {
        type: 'fail',
        msg: msg,
      };
    }

    // r
    return mcpListRes.data;
  } catch (error) {
    const msg = `request ${url} error`;
    mcpErrorFeishuMsg(req, `${methodName}-${msg}`);
    req.logger.error(methodName, msg, error);
    return {
      type: 'fail',
      msg: msg,
    };
  }
};

/**
 * getMCPTags
 * @param {*} req
 * @returns
 */
exports.getMCPTags = async (req) => {
  const methodName = 'getMCPTags';
  try {
    const mcpTagsStr = await req.redis.get('mcpTags');
    const mcpTagsObj = JSON.parse(mcpTagsStr);
    req.logger.info(methodName, 'mcpTagsObj', mcpTagsObj.length);

    return mcpTagsObj;
  } catch (error) {
    const msg = 'get mcp tags error';
    mcpErrorFeishuMsg(req, `${methodName}-${msg}`);
    req.logger.error(methodName, msg, error);
  }
};

/**
 * getMCPWords
 * @param {*} req
 * @returns
 */
exports.getMCPWords = async (req) => {
  const methodName = 'getMCPWords';
  try {
    const mcpWrodsStr = await req.redis.get('mcpWords');
    const mcpWordsObj = JSON.parse(mcpWrodsStr);
    req.logger.info(methodName, 'mcpWordsObj', mcpWordsObj.length);

    return mcpWordsObj;
  } catch (error) {
    const msg = 'get mcp words error';
    mcpErrorFeishuMsg(req, `${methodName}-${msg}`);
    req.logger.error(methodName, msg, error);
  }
};

/**
 * getMCPDetailByCode
 * @param {*} req
 * @param {*} res
 * @param {*} code
 * @returns
 */
exports.getMCPDetailByCode = async (req, res, code) => {
  const methodName = 'getMCPDetailByCode';

  // go
  try {
    const getMCPDetailByCodeRes = await req.db.query(sql.getMCPDetailByCode, [code]);
    if (getMCPDetailByCodeRes.length !== 1) {
      req.logger.warn(methodName, 'getMCPDetailByCodeRes.length !== 1');
      return;
    }

    return getMCPDetailByCodeRes[0];
  } catch (error) {
    req.logger.warn(methodName, error.name, error.message);
  }
};

/**
 * addMCPSearchDetail
 * @param {*} req
 * @param {*} detail
 * @returns
 */
exports.addMCPSearchDetail = async (req, detail) => {
  const methodName = 'addMCPSearchDetail';

  // check
  if (!detail) return;

  // go
  try {
    await req.db.query(sql.addMCPSearchDetail, [detail]);
    req.logger.info(methodName, 'insert mcp search detail success', detail);
  } catch (error) {
    const msg = 'insert mcp search detail error';
    mcpErrorFeishuMsg(req, `${methodName}-${msg}`);
    req.logger.error(methodName, error);
  }
};
