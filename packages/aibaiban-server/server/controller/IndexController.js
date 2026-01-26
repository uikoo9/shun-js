// service
const service = require('../service/IndexService.js');

/**
 * controller
 */
module.exports = (app) => {
  // index
  app.get('/', (req, res) => {
    service.index(req, res);
  });
  app.get('/landing-preview.html', async (req, res) => {
    // const
    const pagePath = './views/landing-preview.html';

    // is static
    const isStatic = await res.staticRender(pagePath);
    if (isStatic) return;

    // render
    res.render(pagePath, {}, true);
  });
  app.get('/landing-v1.html', async (req, res) => {
    // const
    const pagePath = './views/landing-v1.html';

    // is static
    const isStatic = await res.staticRender(pagePath);
    if (isStatic) return;

    // render
    res.render(pagePath, {}, true);
  });
  app.get('/landing-v2.html', async (req, res) => {
    // const
    const pagePath = './views/landing-v2.html';

    // is static
    const isStatic = await res.staticRender(pagePath);
    if (isStatic) return;

    // render
    res.render(pagePath, {}, true);
  });
  app.get('/landing-v3.html', async (req, res) => {
    // const
    const pagePath = './views/landing-v3.html';

    // is static
    const isStatic = await res.staticRender(pagePath);
    if (isStatic) return;

    // render
    res.render(pagePath, {}, true);
  });
  app.get('/landing-v4.html', async (req, res) => {
    // const
    const pagePath = './views/landing-v4.html';

    // is static
    const isStatic = await res.staticRender(pagePath);
    if (isStatic) return;

    // render
    res.render(pagePath, {}, true);
  });
  app.get('/landing-v5.html', async (req, res) => {
    // const
    const pagePath = './views/landing-v5.html';

    // is static
    const isStatic = await res.staticRender(pagePath);
    if (isStatic) return;

    // render
    res.render(pagePath, {}, true);
  });
};
