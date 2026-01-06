// service
const service = require('../service/AppService.js');

/**
 * app controller
 */
module.exports = (app) => {
  // app update
  app.post('/app/update', (req, res) => {
    service.appUpdate(req, res);
  });
};
