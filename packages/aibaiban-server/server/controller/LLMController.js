// service
const service = require('../service/LLMService.js');

/**
 * controller
 */
module.exports = (app) => {
  // intent
  app.post('/intent', (req, res) => {
    service.intent(req, res);
  });

  //
  app.post('/chat-streaming', (req, res) => {
    service.chatWithStreaming(req, res);
  });
};
