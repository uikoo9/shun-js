// service
const service = require('../service/IndexService.js');

/**
 * controller
 */
module.exports = (app) => {
  // grafana alert
  app.post('/grafana/alert', (req, res) => {
    service.grafanaAlert(req, res);
  });
};
