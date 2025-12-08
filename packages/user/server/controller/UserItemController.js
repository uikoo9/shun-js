// service
const service = require('../service/UserItemService.js');

/**
 * controller
 */
module.exports = (app) => {
  // user login
  app.post('/user/login', (req, res) => {
    service.userLogin(req, res);
  });

  // user check
  app.post('/user/check', (req, res) => {
    service.userCheck(req, res);
  });
};
