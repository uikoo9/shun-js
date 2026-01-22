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

  // chat
  app.post('/chat-streaming', (req, res) => {
    service.chatWithStreaming(req, res);
  });
};
