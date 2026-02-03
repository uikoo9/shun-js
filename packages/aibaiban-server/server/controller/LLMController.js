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

  // draw (原有方法)
  app.post('/draw', (req, res) => {
    service.draw(req, res);
  });

  // drawWithTools (Tool Calling 方法)
  app.post('/drawWithTools', (req, res) => {
    service.drawWithTools(req, res);
  });
};
