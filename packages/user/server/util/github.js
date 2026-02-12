// ajax
const { get } = require('qiao-ajax');

/**
 * getGithubUserinfo
 * @param {*} req
 * @param {*} code
 */
exports.getGithubUserinfo = async (req, code) => {
  const methodName = 'getGithubUserinfo';

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
    const tokenResponse = await get(tokenUrl, tokenConfig);

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
    const userUrl = global.QZ_CONFIG.github.userUrl;
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
//   login: 'uikoo9',
//   id: 10345351,
//   node_id: 'MDQ6VXNlcjEwMzQ1MzUx',
//   avatar_url: 'https://avatars.githubusercontent.com/u/10345351?v=4',
//   gravatar_id: '',
//   url: 'https://api.github.com/users/uikoo9',
//   html_url: 'https://github.com/uikoo9',
//   followers_url: 'https://api.github.com/users/uikoo9/followers',
//   following_url: 'https://api.github.com/users/uikoo9/following{/other_user}',
//   gists_url: 'https://api.github.com/users/uikoo9/gists{/gist_id}',
//   starred_url: 'https://api.github.com/users/uikoo9/starred{/owner}{/repo}',
//   subscriptions_url: 'https://api.github.com/users/uikoo9/subscriptions',
//   organizations_url: 'https://api.github.com/users/uikoo9/orgs',
//   repos_url: 'https://api.github.com/users/uikoo9/repos',
//   events_url: 'https://api.github.com/users/uikoo9/events{/privacy}',
//   received_events_url: 'https://api.github.com/users/uikoo9/received_events',
//   type: 'User',
//   user_view_type: 'private',
//   site_admin: false,
//   name: null,
//   company: null,
//   blog: '',
//   location: null,
//   email: 'uikoo9@qq.com',
//   hireable: null,
//   bio: null,
//   twitter_username: null,
//   notification_email: 'uikoo9@qq.com',
//   public_repos: 27,
//   public_gists: 0,
//   followers: 91,
//   following: 4,
//   created_at: '2014-12-30T03:11:05Z',
//   updated_at: '2026-01-29T09:08:41Z',
//   private_gists: 0,
//   total_private_repos: 33,
//   owned_private_repos: 33,
//   disk_usage: 1026748,
//   collaborators: 4,
//   two_factor_authentication: true,
//   plan: {
//     name: 'free',
//     space: 976562499,
//     collaborators: 0,
//     private_repos: 10000
//   }
// }
