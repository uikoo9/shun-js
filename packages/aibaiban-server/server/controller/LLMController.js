// service
const service = require('../service/LLMService.js');

/**
 * controller
 */
module.exports = (app) => {
  // draw agent
  app.post('/chat-streaming', (req, res) => {
    service.drawAgent(req, res);
  });
};
