// service
const service = require('../service/DataService.js');

/**
 * data controller
 */
module.exports = (app) => {
  // data
  app.post('/', (req, res) => {
    service.data(req, res);
  });
};
