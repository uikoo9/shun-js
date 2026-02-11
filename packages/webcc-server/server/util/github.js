// encode
const { uuid } = require('qiao-encode');

// ajax
const { get } = require('qiao-ajax');

/**
 * getGitHubAuthUrl
 * @returns
 */
exports.getGitHubAuthUrl = () => {
  const state = uuid();
  const params = new URLSearchParams({
    client_id: global.QZ_CONFIG.github.clientID,
    redirect_uri: global.QZ_CONFIG.github.callbackUrl,
    scope: global.QZ_CONFIG.github.scope,
    state: state,
  });
  const finalUrl = `${global.QZ_CONFIG.github.authUrl}?${params.toString()}`;

  // r
  return { state, finalUrl };
};

/**
 * getGithubUserinfo
 * @param {*} code
 */
exports.getGithubUserinfo = async (code) => {
  try {
    // get token
    const tokenUrl = global.QZ_CONFIG.github.tokenUrl;
    const tokenConfig = {
      params: {
        client_id: global.QZ_CONFIG.github.clientID,
        client_secret: global.QZ_CONFIG.github.clientSecret,
        redirect_uri: global.QZ_CONFIG.github.callbackUrl,
        code: code,
      },
      headers: {
        Accept: 'application/json',
      },
    };
    console.log(tokenConfig);
    const tokenResponse = await get(tokenUrl, tokenConfig);
    console.log(tokenResponse);
  } catch (error) {
    console.log(error);
  }
};
