// path
const path = require('path');

// qiao-webpack
const qwebpack = require('qiao-webpack');

// alias
const alias = require('./alias.js');

// entry
const entry = require('./entry.js');

// plugins
const plugins = require('./plugins-dev.js');

// server path
const serverPath = path.resolve(__dirname, '../static');

/**
 * qiao.webpack.js
 */
module.exports = {
  cssIncludes: [/node_modules[\\/]artalk/],
  devServer: qwebpack.server(serverPath),
  entry: entry,
  plugins: plugins,
  resolve: {
    alias: alias,
  },
  performance: {
    hints: false,
  },
  postCssConfig: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },
};
