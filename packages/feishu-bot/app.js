// qz
const qz = require('qiao-z');

// check
const { checkAppIdAndKey } = require('./server/util/check.js');

// options
const options = {
  // checks
  checks: [checkAppIdAndKey],

  // cron
  cron: require('qiao-timer'),

  // log
  log: require('qiao-log'),
  logOptions: require('./server/log-options.js')(),
};

// init
(async () => {
  const app = await qz(options);
  app.listen(9006);
})();
