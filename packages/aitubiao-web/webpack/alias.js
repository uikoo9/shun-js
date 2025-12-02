// path
const path = require('path');

// alias
module.exports = {
  '@assets': path.resolve(__dirname, '../assets'),
  '@components': path.resolve(__dirname, '../src/components'),
  '@models': path.resolve(__dirname, '../src/models'),
  '@services': path.resolve(__dirname, '../src/services'),
  '@util': path.resolve(__dirname, '../src/util'),
  '@views': path.resolve(__dirname, '../src/views'),
};
