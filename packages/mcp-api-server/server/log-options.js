/**
 * log options
 * @returns
 */
module.exports = () => {
  // log options
  const logLevel = 'debug';
  const logPattern = 'yyyy-MM-dd-hh';
  const logPath = require('path').resolve(__dirname, '../logs/qiao-z.log');

  return {
    pm2: true,
    pm2InstanceVar: 'INSTANCE_ID',
    appenders: {
      stdout: {
        type: 'stdout',
      },
      datefile: {
        type: 'dateFile',
        pattern: logPattern,
        filename: logPath,
        keepFileExt: true,
        numBackups: 30,
        compress: true,
      },
    },
    categories: {
      default: {
        level: logLevel,
        appenders: ['stdout', 'datefile'],
      },
    },
  };
};
