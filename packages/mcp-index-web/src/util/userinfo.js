// qiao
import { ls } from 'qiao.ls.js';
import { cookie } from 'qiao.cookie.js';

/**
 * setUserinfo
 * @param {*} userinfo
 */
export const setUserinfo = (userinfo) => {
  ls('userinfo', userinfo);

  const cookieOptions = { sPath: '/', vEnd: 60 * 60 * 24 * 7, bSecure: true };
  cookie('userid', userinfo.id, cookieOptions);
  cookie('usertoken', userinfo.usertoken, cookieOptions);
};

/**
 * getUserinfo
 * @returns
 */
export const getUserinfo = () => {
  return ls('userinfo');
};

/**
 * clearUserinfo
 */
export const clearUserinfo = (reload) => {
  ls('userinfo', null);
  cookie('userid', null);
  cookie('usertoken', null);

  if (reload) location.reload();
};
