#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs');
const { program } = require('commander');

const { parseServer } = require('./parse.js');
const log = require('./log.js');
const npm = require('./npm.js');
const pm2 = require('./pm2.js');

// version
program.version(require('../package.json').version, '-v, --version');

// start
program
  .command('start <servers...>')
  .description('install and start servers, e.g. @shun-js/xxx@1.0.0')
  .action(async (servers) => {
    try {
      npm.ensurePm2();
      log.br();
      await pm2.connect();

      for (const server of servers) {
        await startServer(server);
      }

      log.br();
      pm2.save();
    } catch (e) {
      log.error('failed to start servers');
      console.log(e);
    } finally {
      pm2.disconnect();
    }
  });

async function startServer(input) {
  const parsed = parseServer(input);
  if (!parsed) {
    log.error(`version is required: ${input}, e.g. ${input}@1.0.0`);
    console.log();
    return;
  }

  const { pkg, version, name } = parsed;
  const pkgWithVersion = `${pkg}@${version}`;

  log.info(`starting server: ${pkgWithVersion}`);
  log.br();

  // 1. npm install -g
  npm.installGlobal(pkgWithVersion);
  log.br();

  // 2. 定位 app.js
  const globalPath = npm.getGlobalPath();
  const serverRoot = path.resolve(globalPath, pkg);
  const appPath = path.resolve(serverRoot, 'app.js');

  if (!fs.existsSync(appPath)) {
    log.error(`app.js not found: ${appPath}`);
    console.log();
    return;
  }

  // 3. 查找配置文件
  const configPath = path.resolve(process.cwd(), `${name}.json`);
  if (!fs.existsSync(configPath)) {
    log.error(`config not found: ${configPath}`);
    console.log();
    return;
  }

  // 4. pm2 startOrReload
  await pm2.startOrReload({
    name,
    cwd: serverRoot,
    script: appPath,
    args: configPath,
  });

  log.success(`server started: ${pkgWithVersion}`);
  console.log();
}

program.parse(process.argv);
