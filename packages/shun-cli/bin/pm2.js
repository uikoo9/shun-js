'use strict';

const pm2 = require('pm2');
const { execSync } = require('child_process');
const log = require('./log.js');

function connect() {
  return new Promise((resolve) => {
    pm2.connect((err) => {
      if (err) {
        log.error('failed to connect pm2');
        console.log(err);
        process.exit(2);
      }
      resolve();
    });
  });
}

function disconnect() {
  pm2.disconnect();
}

function isRunning(name) {
  return new Promise((resolve) => {
    pm2.list((err, list) => {
      if (err) return resolve(false);
      resolve(list.some((p) => p.name === name));
    });
  });
}

function start(config) {
  return new Promise((resolve, reject) => {
    pm2.start(config, (err) => {
      return err ? reject(err) : resolve();
    });
  });
}

function reload(name) {
  return new Promise((resolve, reject) => {
    pm2.reload(name, (err) => {
      return err ? reject(err) : resolve();
    });
  });
}

async function startOrReload(config) {
  const running = await isRunning(config.name);
  if (running) {
    log.info(`process exists, reloading: ${config.name}`);
    await reload(config.name);
  } else {
    log.info(`starting new process: ${config.name}`);
    await start(config);
  }
}

function save() {
  try {
    log.info('pm2 saving...');
    execSync('pm2 save', { encoding: 'utf-8' });
    log.success('pm2 saved');
  } catch (e) {
    log.error('pm2 save failed');
    console.log(e.message);
  }
}

module.exports = { connect, disconnect, startOrReload, save };
