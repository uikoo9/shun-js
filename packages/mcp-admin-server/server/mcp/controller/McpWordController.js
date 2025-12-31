// service
const service = require('../service/McpWordService.js');

/**
 * mcp word controller
 */
module.exports = (app) => {
  // mcp word list
  app.post('/mcp/word/list', (req, res) => {
    service.mcpWordList(req, res);
  });

  // mcp word get
  app.post('/mcp/word/get', (req, res) => {
    service.mcpWordGet(req, res);
  });

  // mcp word save
  app.post('/mcp/word/save', (req, res) => {
    service.mcpWordSave(req, res);
  });

  // mcp word del
  app.post('/mcp/word/del', (req, res) => {
    service.mcpWordDel(req, res);
  });
};
