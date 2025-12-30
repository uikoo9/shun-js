// path
const path = require('path');

// template path
const template = path.resolve(__dirname, './template.html');

/**
 * qiao.webpack.js
 */
module.exports = [
  // css
  {
    type: 'css',
    filename: '[name].[contenthash:8].css',
    chunkFilename: '[id].[contenthash:8].css',
    ignoreOrder: true,
  },

  // index
  {
    type: 'html',
    inject: 'body',
    title: 'index',
    chunks: ['index'],
    template: template,
    filename: '../views/index.html',
    publicPath: 'https://static-small.vincentqiao.com/mcp-admin/static/',
  },
];
