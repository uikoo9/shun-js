'use strict';

const { execSync } = require('child_process');
const log = require('./log.js');

function installGlobal(pkgWithVersion) {
  log.info(`npm i -g ${pkgWithVersion} ...`);
  try {
    const output = execSync(`npm i -g ${pkgWithVersion}`, { encoding: 'utf-8' });
    console.log(output);
  } catch (e) {
    log.error(`npm global install failed: ${pkgWithVersion}`);
    console.log(e.message);
    process.exit(1);
  }
}

function getGlobalPath() {
  try {
    return execSync('npm root -g', { encoding: 'utf-8' }).trim();
  } catch (e) {
    log.error('failed to get npm global path');
    console.log(e.message);
    process.exit(1);
  }
}

function ensurePm2() {
  try {
    execSync('pm2 --version', { encoding: 'utf-8', stdio: 'pipe' });
    log.info('pm2 is installed');
  } catch {
    log.info('pm2 not found, installing...');
    try {
      execSync('npm i -g pm2', { encoding: 'utf-8' });
      log.success('pm2 installed');
    } catch (e) {
      log.error('failed to install pm2');
      console.log(e.message);
      process.exit(1);
    }
  }
}

module.exports = { installGlobal, getGlobalPath, ensurePm2 };
