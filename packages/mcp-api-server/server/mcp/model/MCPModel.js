// sql
const sql = require('../sql/MCPSQL.js');

// feishu
const { mcpErrorFeishuMsg } = require('../../util/feishu.js');

/**
 * addMCPSearchWord
 * @param {*} req
 * @returns
 */
exports.addMCPSearchWord = async (req) => {
  const methodName = 'addMCPSearchWord';

  // check
  const word = req.body.word;
  if (!word) return;

  // go
  try {
    await req.db.query(sql.addMCPSearchWord, [word]);
    req.logger.info(methodName, 'insert mcp search word success', word);
  } catch (error) {
    const msg = 'insert mcp search word error';
    mcpErrorFeishuMsg(req, `${methodName}-${msg}`);
    req.logger.error(methodName, error);
  }
};

/**
 * addMCPSearchTag
 * @param {*} req
 * @returns
 */
exports.addMCPSearchTag = async (req) => {
  const methodName = 'addMCPSearchTag';

  // check
  const tag = req.body.tag;
  if (!tag) return;

  // go
  try {
    await req.db.query(sql.addMCPSearchTag, [tag]);
    req.logger.info(methodName, 'insert mcp search tag success', tag);
  } catch (error) {
    const msg = 'insert mcp search tag error';
    mcpErrorFeishuMsg(req, `${methodName}-${msg}`);
    req.logger.error(methodName, error);
  }
};
