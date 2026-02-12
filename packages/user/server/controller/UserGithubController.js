// service
const service = require('../service/UserGithubService.js');

/**
 * controller
 */
module.exports = (app) => {
  // user github
  app.post('/user/github', (req, res) => {
    service.userGithub(req, res);
  });
};
