// service
const service = require('../service/UcenterService.js');

/**
 * ucenter controller
 */
module.exports = (app) => {
  // ucenter login
  app.post('/ucenter/login', (req, res) => {
    service.userLogin(req, res);
  });

  // user menus
  app.post('/ucenter/menus', (req, res) => {
    service.userMenus(req, res);
  });
};
