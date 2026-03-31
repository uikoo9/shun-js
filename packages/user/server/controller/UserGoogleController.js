// service
const service = require('../service/UserGoogleService.js');

/**
 * controller
 */
module.exports = (app) => {
  // user google
  app.post('/user/google', (req, res) => {
    service.userGoogle(req, res);
  });
};
