// service
const service = require('../service/RecommendService.js');

/**
 * recommend controller
 */
module.exports = (app) => {
  // recommend add
  app.post('/recommend/add', (req, res) => {
    service.recommendAdd(req, res);
  });

  // recommend list
  app.post('/recommend/list', (req, res) => {
    service.recommendList(req, res);
  });

  // recommend change
  app.post('/recommend/change', (req, res) => {
    service.recommendChange(req, res);
  });
};
