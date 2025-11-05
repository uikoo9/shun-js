#!/usr/bin/env node

// qiao
const cli = require('qiao-cli');

// cmds
require('./shun-start.js');
require('./shun-version.js');

// parse
cli.cmd.parse(process.argv);
