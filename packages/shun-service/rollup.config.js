// json
const { rollupPluginJson } = require('qiao-project');

/**
 * rollup.config.js
 */
module.exports = {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'es',
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
    },
  ],
  external: ['qiao-ajax', 'qiao-json'],
  plugins: [rollupPluginJson()],
};
