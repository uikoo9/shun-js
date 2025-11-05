// pm2
const pm2 = require('pm2');

// qiao
const cli = require('qiao-cli');

/**
 * pm2Start
 * @param {*} options
 * @returns
 */
exports.pm2Start = (options) => {
  return new Promise((resolve, reject) => {
    pm2.connect((error) => {
      if (error) {
        console.log(cli.colors.red('连接PM2失败。'));
        console.log();
        console.log(error);

        process.exit(2);
      }

      pm2.start(options, function (error) {
        pm2.disconnect();
        return error ? reject(error) : resolve();
      });
    });
  });
};
