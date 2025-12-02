// path
const path = require('path');

// template path
const template = path.resolve(__dirname, './template-dev.html');
const templateHome = path.resolve(__dirname, './template-home-dev.html');

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
    filename: 'index.html',
    template: template,
  },

  // home
  {
    type: 'html',
    inject: 'body',
    title: 'home',
    chunks: ['home'],
    filename: 'home.html',
    template: templateHome,
  },
];
