// fetch
import { post } from '@util/fetch.js';

/**
 * sendCode
 * @returns
 */
export const sendCode = async (mobile) => {
  return await post('/sms', {
    mobile: mobile,
  });
};

/**
 * userLogin
 * @param {*} mobile
 * @param {*} code
 * @returns
 */
export const userLogin = async (mobile, code) => {
  return await post('/user/login', {
    mobile: mobile,
    code: code,
  });
};
