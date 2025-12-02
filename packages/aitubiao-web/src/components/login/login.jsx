// react
import React, { useState } from 'react';

// css
import './login.scss';

// ui
import { Input, Button } from 'qiao-ui';

// js
import { clickSendCode, clickLogin } from './login.js';

// data
import { reportWebData } from '@util/data.js';

/**
 * Login
 */
export const Login = () => {
  // state
  const [mobile, setMobile] = useState('');
  const [code, setCode] = useState('');
  const [sendCodeBtnTxt, setSendCodeBtnTxt] = useState('发送验证码');
  const [loginTip, setLoginTip] = useState('');

  return (
    <div className="login-container">
      <div className="login-username">
        <Input
          type="text"
          placeholder="请输入手机号"
          value={mobile}
          onChange={(e) => {
            setMobile(e.target.value);
          }}
        />
      </div>
      <div className="login-code">
        <div className="login-code-l">
          <Input
            type="text"
            placeholder="请输入短信验证码"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
            }}
          />
        </div>
        <div className="login-code-r">
          <Button
            text={sendCodeBtnTxt}
            onClick={async () => {
              reportWebData('click.btn', 'login.sendcode');
              await clickSendCode(mobile, setSendCodeBtnTxt, setLoginTip);
            }}
          />
        </div>
      </div>
      <div className="login-tips">{loginTip}</div>
      <div className="login-btn">
        <Button
          text="登录/注册"
          onClick={async () => {
            reportWebData('click.btn', 'login.login');
            await clickLogin(mobile, code, setLoginTip);
          }}
        />
      </div>
    </div>
  );
};
