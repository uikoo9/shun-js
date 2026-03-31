// ajax
const { get, post } = require('qiao-ajax');

/**
 * getGoogleUserinfo
 * @param {*} req
 * @param {*} code
 */
exports.getGoogleUserinfo = async (req, code) => {
  const methodName = 'getGoogleUserinfo';

  try {
    // get token
    const tokenUrl = global.QZ_CONFIG.google.tokenUrl;
    const tokenConfig = {
      params: {
        client_id: global.QZ_CONFIG.google.clientID,
        client_secret: global.QZ_CONFIG.google.clientSecret,
        redirect_uri: global.QZ_CONFIG.google.callbackUrl,
        grant_type: 'authorization_code',
        code: code,
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
    const tokenResponse = await post(tokenUrl, tokenConfig);

    // check
    if (!tokenResponse) {
      req.logger.error(methodName, 'tokenResponse is null');
      return;
    }
    if (tokenResponse.status !== 200) {
      req.logger.error(methodName, 'tokenResponse.status !== 200', tokenResponse.status);
      return;
    }
    if (!tokenResponse.data) {
      req.logger.error(methodName, 'tokenResponse.data is null');
      return;
    }
    if (!tokenResponse.data.access_token || !tokenResponse.data.token_type) {
      req.logger.error(methodName, 'tokenResponse.data.access_token is null or tokenResponse.data.token_type is null');
      return;
    }

    // get user
    req.logger.info(methodName, 'get token success');
    const userUrl = global.QZ_CONFIG.google.userUrl;
    const userConfig = {
      headers: {
        Authorization: `${tokenResponse.data.token_type} ${tokenResponse.data.access_token}`,
        Accept: 'application/json',
      },
    };
    const userResponse = await get(userUrl, userConfig);

    // check
    if (!userResponse) {
      req.logger.error(methodName, 'userResponse is null');
      return;
    }
    if (userResponse.status !== 200) {
      req.logger.error(methodName, 'userResponse.status !== 200', userResponse.status);
      return;
    }
    if (!userResponse.data) {
      req.logger.error(methodName, 'userResponse.data is null');
      return;
    }
    req.logger.info(methodName, 'get user success');

    // r
    return userResponse.data;
  } catch (error) {
    req.logger.error(methodName, 'error', error);
  }
};

// {
//   sub: '113888573080949768314',
//   name: 'vincent v',
//   given_name: 'vincent',
//   family_name: 'v',
//   picture: 'https://lh3.googleusercontent.com/a/ACg8ocIeChCoXJwZ4Yqsa9g3wn7iw54hF1qEg6Aqm4p3QiBjBRJV5mD6=s96-c',
//   email: 'uikoo9@gmail.com',
//   email_verified: true
// }
