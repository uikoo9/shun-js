// service
const service = require('../service/FeishuService.js');

/**
 * feishu controller
 */
module.exports = (app) => {
  // /
  app.post('/', (req, res) => {
    service.feishuMsg(req, res);
  });
};
