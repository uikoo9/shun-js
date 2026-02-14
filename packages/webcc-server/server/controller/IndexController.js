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

  // ac check
  app.post('/ac/check', (req, res) => {
    service.acCheck(req, res);
  });
};
