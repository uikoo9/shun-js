// service
const service = require('../service/IndexService.js');

/**
 * controller
 */
module.exports = (app) => {
  // ac refresh
  app.post('/ac/refresh', (req, res) => {
    service.acRefresh(req, res);
  });
};
