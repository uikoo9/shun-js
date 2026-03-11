'use strict';

/**
 * parseServer
 * parse @shun-js/aitubiao-server@0.3.8
 * return { pkg, version, name }
 */
function parseServer(input) {
  const lastAt = input.lastIndexOf('@');

  let pkg, version;
  if (lastAt <= 0 || input.indexOf('@') === lastAt) {
    return null;
  } else {
    pkg = input.slice(0, lastAt);
    version = input.slice(lastAt + 1);
  }

  // pm2 process name: extract aitubiao-server from @shun-js/aitubiao-server
  const name = pkg.split('/')[1] || pkg;

  return { pkg, version, name };
}

module.exports = { parseServer };
