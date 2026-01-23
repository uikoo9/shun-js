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
  app.post('/draw', (req, res) => {
    service.draw(req, res);
  });
};
