// qiao
import { fail } from 'qiao-json';
import { cookie } from 'qiao.cookie.js';
import { get as ajaxGet, post as ajaxPost } from 'qiao-ajax';

// Logger
import { Logger } from 'qiao.log.js';
const logger = Logger('fetch');

/**
 * get
 * @param {*} url
 * @param {*} data
 * @returns
 */
export const get = async (url) => {
  try {
    return await ajaxGet(url);
  } catch (error) {
    logger.error('get', error);
    return fail('quest fail');
  }
};

/**
 * post
 * @param {*} url
 * @param {*} data
 * @returns
 */
export const post = async (url, data, headers) => {
  return await ajax(url, data, headers);
};

/**
 * postWithToken
 * @param {*} url
 * @param {*} data
 * @param {*} headers
 * @returns
 */
export const postWithToken = async (url, data, headers) => {
  const userid = cookie('userid');
  const usertoken = cookie('usertoken');

  const defaultHeaders = {};
  if (userid) defaultHeaders.userid = userid;
  if (usertoken) defaultHeaders.usertoken = usertoken;

  return await ajax(url, data, Object.assign(defaultHeaders, headers));
};

// ajax
async function ajax(url, data, headers) {
  // res
  let res;
  try {
    res = await ajaxPost(url, { data: data, headers: headers });
  } catch (error) {
    logger.error('ajax', error);
  }

  // res error
  if (!res) return fail('request fail');

  // not 200
  if (res.status != 200) return fail(`request fail: ${res.status}`);

  // no data
  const json = res.data;
  if (!json) return fail(`request fail: no data`);

  // danger
  if (json.type !== 'success') return fail(json.msg);
  return json;
}
