// qiao
const cli = require('qiao-cli');

// util
const { checkPackage } = require('./util.js');

// debug
const debug = require('debug')('shun.js');

/**
 * startServer
 */
const startServer = async (packageNames) => {
  const methodName = 'startServer';

  try {
    // log
    console.log(cli.colors.gray(`开始启动以下服务：${packageNames.join(', ')}`));
    console.log();

    // for
    const packageInfos = [];
    for (let i = 0; i < packageNames.length; i++) {
      const packageName = packageNames[i];
      const packageInfo = checkPackage(packageName);
      if (!packageInfo) continue;

      packageInfos.push(packageInfo);
    }
    debug(methodName, 'packageInfos', packageInfos);
  } catch (e) {
    console.log(cli.colors.red('启动服务出错。'));
    console.log();
    console.log(e);
  }
};

// cmd
cli.cmd.command('start <packageNames...>').description('待启动的NPM包名').action(startServer);
