// qiao
const cli = require('qiao-cli');

// cp
const { execSync } = require('child_process');

// debug
const debug = require('debug')('shun.js');

/**
 * getNPMGlobalPath
 * @returns
 */
exports.getNPMGlobalPath = () => {
  const methodName = 'getNPMRootPath';

  try {
    const npmGlobalPath = execSync('npm root -g').toString().trim();
    debug(methodName, 'npmGlobalPath', npmGlobalPath);

    return npmGlobalPath;
  } catch (error) {
    console.log(cli.colors.red('获取NPM全局路径出错。'));
    console.log();
    console.log(error);
  }
};
