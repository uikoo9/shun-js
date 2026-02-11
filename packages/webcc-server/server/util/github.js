// encode
const { uuid } = require('qiao-encode');

/**
 * getGitHubAuthUrl
 * @returns
 */
exports.getGitHubAuthUrl = () => {
  const state = uuid();
  const params = new URLSearchParams({
    client_id: global.QZ_CONFIG.github.clientID,
    // redirect_uri: global.QZ_CONFIG.github.callbackUrl,
    redirect_uri: 'http://localhost:7008/github/callback',
    scope: global.QZ_CONFIG.github.scope,
    state: state,
  });
  const finalUrl = `${global.QZ_CONFIG.github.authUrl}?${params.toString()}`;

  // r
  return { state, finalUrl };
};
