// service
const service = require('../service/McpService.js');

/**
 * controller
 */
module.exports = (app) => {
  // mcp index
  app.get('/', (req, res) => {
    service.index(req, res);
  });
};
