// path
const path = require('path');

// qiao
const cli = require('qiao-cli');

/**
 * checkPackage
 * @param {*} packageName
 * @returns
 */
exports.checkPackage = (packageName) => {
  console.log(cli.colors.gray(`开始处理包：${packageName}`));

  // check
  if (!packageName.startsWith('@shun-js')) {
    console.log(cli.colors.red(`非法包：${packageName}`));
    console.log();
    return;
  }

  // const
  const newPackageName = packageName.split('/')[1];
  console.log(cli.colors.gray(`服务名：${newPackageName}`));

  // config
  const workDir = process.cwd();
  const newPackageConfigPath = path.resolve(workDir, `./${newPackageName}.json`);
  console.log(cli.colors.gray(`配置文件：${newPackageConfigPath}`));
  console.log();

  // r
  return {
    newPackageName,
    newPackageConfigPath,
  };
};
