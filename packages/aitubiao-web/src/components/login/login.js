// ucenter service
import { sendCode, userLogin } from '@services';

// util
import { setUserinfo } from '@util/userinfo.js';

/**
 * clickSendCode
 * @param {*} mobile
 * @param {*} setSendCodeBtnTxt
 * @param {*} setLoginTip
 * @returns
 */
const codeSecond = 60;
let second = codeSecond;
let sending = false;
export const clickSendCode = async (mobile, setSendCodeBtnTxt, setLoginTip) => {
  if (sending) return;
  sending = true;

  // check
  setLoginTip('');
  if (!mobile) {
    setLoginTip('请输入手机号！');
    sending = false;
    return;
  }
  if (!/^(?:(?:\+|00)86)?1\d{10}$/.test(mobile)) {
    setLoginTip('请输入正确的手机号！');
    sending = false;
    return;
  }

  // send
  const res = await sendCode(mobile);
  if (!res || res.type !== 'success') {
    setLoginTip(res.msg);
    sending = false;
    return;
  }

  // timeout
  setSendCodeBtnTxt(`${second}s`);
  setLoginTip(res.msg);
  calcCode(setSendCodeBtnTxt);
};

// calc code
function calcCode(setSendCodeBtnTxt) {
  setTimeout(() => {
    second = second - 1;
    setSendCodeBtnTxt(`${second}s`);

    if (second >= 0) {
      calcCode(setSendCodeBtnTxt);
    } else {
      second = codeSecond;
      sending = false;
      setSendCodeBtnTxt('发送验证码');
    }
  }, 1000);
}

/**
 * clickLogin
 * @param {*} mobile
 * @param {*} code
 * @param {*} setLoginTip
 * @returns
 */
export const clickLogin = async (mobile, code, setLoginTip) => {
  // check
  setLoginTip('');
  if (!mobile) {
    setLoginTip('请输入手机号！');
    return;
  }
  if (!/^(?:(?:\+|00)86)?1\d{10}$/.test(mobile)) {
    setLoginTip('请输入正确的手机号！');
    return;
  }
  if (!code) {
    setLoginTip('请输入验证码！');
    return;
  }
  if (!/^\d{6}$/g.test(code)) {
    setLoginTip('验证码输入有误，请重新输入');
    return;
  }

  // login
  const loginRes = await userLogin(mobile, code);
  if (!loginRes || loginRes.type !== 'success') {
    setLoginTip(loginRes.msg);
    return;
  }
  setLoginTip(loginRes.msg);

  // set
  setUserinfo(loginRes.obj);

  // r
  window.location.reload();
};
