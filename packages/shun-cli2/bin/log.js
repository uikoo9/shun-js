'use strict';

const pc = require('picocolors');

function info(msg) {
  console.log(pc.gray(msg));
}

function success(msg) {
  console.log(pc.green(msg));
}

function error(msg) {
  console.log(pc.red(msg));
}

module.exports = { info, success, error };
