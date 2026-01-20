// service
const service = require('../service/SEOService.js');

/**
 * controller
 */
module.exports = (app) => {
  // seo
  app.get('/robots.txt', (req, res) => {
    service.robots(req, res);
  });
  app.get('/sitemap.xml', (req, res) => {
    service.sitemap(req, res);
  });
  app.get('/4cb288d7aef5469c92616c0f5b5aeb89.txt', (req, res) => {
    service.bingIndexNow(req, res);
  });
};
