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

  // options cros
  options.cros = true;

  // options config
  options.config = config;

  // options log
  options.log = require('qiao-log');
  options.logOptions = require('./server/log-options.js')();

  // options modules
  options.modules = [require('qiao-z-nuser').initUserInfo, require('qiao-z-nuser').initGithub];

  // go
  const app = await require('qiao-z')(options);
  app.listen(config.port);
})();
