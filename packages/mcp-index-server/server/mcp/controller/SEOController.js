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
  app.get('/e8268ea999af4be887958cc352a5e058.txt', (req, res) => {
    service.bingIndexNow(req, res);
  });
};
