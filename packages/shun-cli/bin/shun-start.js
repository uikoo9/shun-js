// path
const path = require('path');

// qiao
const cli = require('qiao-cli');
const { isExists } = require('qiao-file');

// util
const { getNPMGlobalPath } = require('./util.js');
const { pm2Start } = require('./pm2.js');

// debug
const debug = require('debug')('@shun-js/shun-cli');

// cmd
cli.cmd.command('start <servers...>').description('待启动的服务名').action(startServers);

// start servers
async function startServers(servers) {
  try {
    for (let i = 0; i < servers.length; i++) {
      await startServer(servers[i]);
    }
  } catch (error) {
    console.log(cli.colors.red('启动服务出错。'));
    console.log();
    console.log(error);
  }
}

// start servers
async function startServer(serverName) {
  const methodName = 'startServer';
  console.log(cli.colors.gray(`开始启动服务：${serverName}`));

  // check
  if (!serverName.startsWith('@shun-js')) {
    console.log(cli.colors.red(`非法服务：${serverName}`));
    console.log();
    return;
  }

  // check package
  const npmGlobalPath = getNPMGlobalPath();
  const serverRootPath = path.resolve(npmGlobalPath, `./${serverName}`);
  const serverAppPath = path.resolve(serverRootPath, './app.js');
  const serverAppPathIsExists = await isExists(serverAppPath);
  debug(methodName, 'serverRootPath', serverRootPath);
  debug(methodName, 'serverAppPath', serverAppPath);
  debug(methodName, 'serverAppPathIsExists', serverAppPathIsExists);
  if (!serverAppPathIsExists) {
    console.log(cli.colors.red(`服务未安装：${serverName}`));
    console.log();
    return;
  }

  // check config
  const workDir = process.cwd();
  const serverConfigPrefix = serverName.split('/')[1];
  const serverConfigPath = path.resolve(workDir, `./${serverConfigPrefix}.json`);
  const serverConfigPathIsExists = await isExists(serverConfigPath);
  debug(methodName, 'serverConfigPath', serverConfigPath);
  debug(methodName, 'serverConfigPathIsExists', serverConfigPathIsExists);

  // pm2
  try {
    await pm2Start({
      name: serverConfigPrefix,
      cwd: serverRootPath,
      script: serverAppPath,
      args: serverConfigPath,
    });
  } catch (error) {
    console.log(cli.colors.red(`服务启动失败：${serverName}`));
    console.log();
    console.log(error);
  }

  // r
  console.log(cli.colors.green(`服务启动成功：${serverName}`));
  console.log();
}
