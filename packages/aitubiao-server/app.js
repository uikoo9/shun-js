// config
const config = require('./server/config.js');

// sentry
const options = {};

// options cros
options.cros = true;

// options config
options.config = config;

// options.redis
options.redis = require('qiao-redis');
options.redisOptions = config.redisOptions;

// options log
options.log = require('qiao-log');
options.logOptions = require('./server/log-options.js')();

// options rate limit
options.rateLimitLib = require('qiao-rate-limit');
options.rateLimitOptions = config.rateLimitOptions;

// options checks
options.checks = [require('./server/util/check.js').checkUserAuth];

// options modules
options.modules = [require('qiao-z-sms').init, require('qiao-z-nuser').init];

// init
(async () => {
  const app = await require('qiao-z')(options);
  app.listen(8002);
})();
