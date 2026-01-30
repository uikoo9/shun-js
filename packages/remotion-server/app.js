// config
const { parseServerConfig } = require('@shun-js/shun-config');

// init
(async () => {
  // config
  const config = await parseServerConfig(process.argv);
  if (!config) {
    console.log('read server config fail');
    return;
  }

  // options
  const options = {};

  // options config
  options.config = config;

  // options cron
  options.cron = require('qiao-timer');

  // options log
  options.log = require('qiao-log');
  options.logOptions = require('./server/log-options.js')();

  // go
  const app = await require('qiao-z')(options);
  app.listen(config.port);
})();
