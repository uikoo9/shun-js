// service
const service = require('../service/IndexService.js');

/**
 * controller
 */
module.exports = (app) => {
  // index
  app.get('/', (req, res) => {
    service.index(req, res);
  });

  // github auth
  app.get('/github/auth', (req, res) => {
    service.githubAuth(req, res);
  });

  // github callback
  app.get('/github/callback', (req, res) => {
    service.githubCallback(req, res);
  });
};
