// options
const options = {};

// options log
options.log = require('qiao-log');
options.logOptions = require('./server/log-options.js')();

// options checks
options.checks = [require('./server/util/check.js').checkGrafanaDomain];

console.log(process.argv);

// init
(async () => {
  const app = await require('qiao-z')(options);
  app.listen(7001);
})();
