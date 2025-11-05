// qiao
const { readFile } = require('qiao-file');

// debug
const debug = require('debug')('@shun-js/shun-config');

/**
 * parseServerConfig
 * @param {*} params
 * @returns
 */
exports.parseServerConfig = async (params) => {
  // check
  if (!params) {
    debug('need params');
    return;
  }
  if (params.length < 3) {
    debug('params.length < 3');
    return;
  }

  // const
  const jsonPath = params[2];
  debug(`jsonPath: ${jsonPath}`);

  // read
  const jsonStr = await readFile(jsonPath);
  debug(`jsonStr: ${jsonStr}`);
  if (!jsonStr) {
    debug('need jsonStr');
    return;
  }

  // obj
  try {
    const config = JSON.parse(jsonStr);
    debug(`config: ${config}`);
    return config;
  } catch (error) {
    debug('json parse error');
  }
};
