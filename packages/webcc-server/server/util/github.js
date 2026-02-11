/**
 * getGitHubAuthUrl
 * @param {*} state
 * @returns
 */
exports.getGitHubAuthUrl = (state) => {
  const params = new URLSearchParams({
    client_id: global.QZ_CONFIG.github.clientID,
    redirect_uri: global.QZ_CONFIG.github.callbackUrl,
    scope: global.QZ_CONFIG.github.scope,
    state: state,
  });

  return `${global.QZ_CONFIG.github.authUrl}?${params.toString()}`;
};
