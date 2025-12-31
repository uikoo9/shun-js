// path
const path = require('path');

// qiao-webpack
const qwebpack = require('qiao-webpack');

// alias
const alias = require('./alias.js');

// entry
const entry = require('./entry.js');

// plugins
const plugins = require('./plugins-prod.js');

// output path
const outputPath = path.resolve(__dirname, '../../mcp-index-web/static');

/**
 * qiao.webpack.js
 */
module.exports = {
  cssIncludes: [/node_modules[\\/]artalk/],
  entry: entry,
  output: qwebpack.output(outputPath),
  plugins: plugins,
  resolve: {
    alias: alias,
  },
  performance: {
    hints: false,
  },
};
