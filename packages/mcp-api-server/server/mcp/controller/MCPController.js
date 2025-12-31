// service
const service = require('../service/MCPService.js');

/**
 * controller
 */
module.exports = (app) => {
  // mcp list
  app.post('/mcp/list', (req, res) => {
    service.mcpList(req, res);
  });
};
