// service
const service = require('../service/SmsService.js');

/**
 * sms controller
 */
module.exports = (app) => {
  // send
  app.post('/sms', (req, res) => {
    service.send(req, res);
  });
};
