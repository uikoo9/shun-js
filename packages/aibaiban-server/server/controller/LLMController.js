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

  // drawWithTools (使用结构化 JSON 输出)
  app.post('/drawWithTools', (req, res) => {
    service.drawWithTools(req, res);
  });
};
