// service
const service = require('../service/McpInfoService.js');

/**
 * mcp info controller
 */
module.exports = (app) => {
  // mcp info list
  app.post('/mcp/info/list', (req, res) => {
    service.mcpInfoList(req, res);
  });

  // mcp info get
  app.post('/mcp/info/get', (req, res) => {
    service.mcpInfoGet(req, res);
  });

  // mcp info save
  app.post('/mcp/info/save', (req, res) => {
    service.mcpInfoSave(req, res);
  });

  // mcp info del
  app.post('/mcp/info/del', (req, res) => {
    service.mcpInfoDel(req, res);
  });
};
