// service
const service = require('../service/FeishuService.js');

/**
 * feishu controller
 */
module.exports = (app) => {
  // /feishu/bot
  app.post('/feishu/bot', (req, res) => {
    service.feishuMsg(req, res);
  });
};
