// service
const service = require('../service/UserInfoService.js');

/**
 * controller
 */
module.exports = (app) => {
  // user info
  app.post('/user/info', (req, res) => {
    service.userInfo(req, res);
  });
};
