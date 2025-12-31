// service
const service = require('../service/McpItemService.js');

/**
 * mcp item controller
 */
module.exports = (app) => {
  // mcp item list
  app.post('/mcp/item/list', (req, res) => {
    service.mcpItemList(req, res);
  });

  // mcp item get
  app.post('/mcp/item/get', (req, res) => {
    service.mcpItemGet(req, res);
  });

  // mcp item save
  app.post('/mcp/item/save', (req, res) => {
    service.mcpItemSave(req, res);
  });

  // mcp item del
  app.post('/mcp/item/del', (req, res) => {
    service.mcpItemDel(req, res);
  });
};
