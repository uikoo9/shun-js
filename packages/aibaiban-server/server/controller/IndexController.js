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

  // board
  app.get('/board', (req, res) => {
    service.board(req, res);
  });
};
