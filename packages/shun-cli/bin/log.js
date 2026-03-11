'use strict';

const pc = require('picocolors');

const PREFIX = pc.bold('[shunjs]');

function info(msg) {
  console.log(`${PREFIX} ${pc.gray(msg)}`);
}

function success(msg) {
  console.log(`${PREFIX} ${pc.green(msg)}`);
}

function error(msg) {
  console.log(`${PREFIX} ${pc.red(msg)}`);
}

function br() {
  console.log();
}

module.exports = { info, success, error, br };
