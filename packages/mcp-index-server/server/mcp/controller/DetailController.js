// service
const service = require('../service/DetailService.js');

/**
 * controller
 */
module.exports = (app) => {
  // detail
  app.get('/detail/:code', (req, res) => {
    service.detail(req, res);
  });
};
