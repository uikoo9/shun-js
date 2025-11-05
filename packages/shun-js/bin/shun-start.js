// path
const path = require('path');

// qiao
const cli = require('qiao-cli');

// util
const { getNPMGlobalPath } = require('./util.js');

// debug
const debug = require('debug')('shun.js');

// cmd
cli.cmd.command('start <servers...>').description('待启动的服务名').action(startServers);

// start servers
async function startServers(servers) {
  const methodName = 'startServers';

  try {
    // log
    console.log(cli.colors.gray(`开始启动以下服务：${servers.join(', ')}`));
    console.log();

    // for
    const serverInfos = [];
    for (let i = 0; i < servers.length; i++) {
      const server = servers[i];
      const serverInfo = startServer(server);
      if (!serverInfo) continue;

      serverInfos.push(serverInfo);
    }
    debug(methodName, 'serverInfos', serverInfos);
  } catch (error) {
    console.log(cli.colors.red('启动服务出错。'));
    console.log();
    console.log(error);
  }
}

// start servers
function startServer(serverName) {
  const methodName = 'startServer';
  console.log(cli.colors.gray(`开始处理服务：${serverName}`));

  // check
  if (!serverName.startsWith('@shun-js')) {
    console.log(cli.colors.red(`非法服务：${serverName}`));
    console.log();
    return;
  }

  // check package
  const npmGlobalPath = getNPMGlobalPath();
  const serverPath = path.resolve(npmGlobalPath, `./${serverName}`);
  debug(methodName, 'serverPath', serverPath);

  // const
  const serverConfigPrefix = serverName.split('/')[1];
  debug(methodName, 'serverConfigPrefix', serverConfigPrefix);

  // config
  const workDir = process.cwd();
  const serverConfigPath = path.resolve(workDir, `./${serverConfigPrefix}.json`);
  console.log(cli.colors.gray(`配置文件：${serverConfigPath}`));
  console.log();

  // r
  return {
    serverConfigPrefix,
    serverConfigPath,
  };
}
