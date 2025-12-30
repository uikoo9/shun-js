// react
import React, { useState } from 'react';

// antd
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Flex, Button, Input, message } from 'antd';

// cookie
import { cookie } from 'qiao.cookie.js';

// ajax
import { post } from '@util/fetch.js';

// constants
import { host } from '@util/constants.js';

/**
 * Login
 */
export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // on login
  const onLogin = async () => {
    // check
    if (!username) {
      message.error('缺少用户名！');
      return;
    }
    if (!password) {
      message.error('缺少密码！');
      return;
    }

    // login
    setLoading(true);
    const loginRes = await post(`${host()}/ucenter/login`, {
      username,
      password,
    });
    setLoading(false);
    if (loginRes.type !== 'success') {
      message.error(loginRes.msg);
      return;
    }

    // cookie
    cookie('userid', loginRes.obj.userid);
    cookie('usertoken', loginRes.obj.usertoken);
    message.success({
      content: loginRes.msg,
      onClose: () => {
        location.reload();
      },
    });
  };

  // login box
  const loginBox = (
    <div
      className="login"
      style={{
        width: '360px',
        margin: '100px auto',
      }}
    >
      <Flex vertical gap={16}>
        <Input
          type="text"
          placeholder="用户名"
          value={username}
          prefix={<UserOutlined />}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <Input
          type="password"
          placeholder="密码"
          value={password}
          prefix={<LockOutlined />}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Button type="primary" loading={loading} onClick={onLogin}>
          登录
        </Button>
      </Flex>
    </div>
  );

  return cookie('userid') && cookie('usertoken') ? null : loginBox;
};
