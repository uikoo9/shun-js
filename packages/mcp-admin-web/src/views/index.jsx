// react
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router';

// antd
import '@ant-design/v5-patch-for-react-19';
import { ConfigProvider, Layout, Menu, theme, message } from 'antd';
import { DiscordOutlined, UserOutlined } from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';
const { Header, Content, Sider } = Layout;

// cookie
import { cookie } from 'qiao.cookie.js';

// ajax
import { postWithToken } from '@util/fetch.js';

// constants
import { host } from '@util/constants.js';

// components
import {
  Login,
  UcenterUser,
  UcenterMenu,
  UcenterRole,
  UcenterRolemenu,
  UcenterRoleuser,
  McpItem,
  McpInfo,
  McpWord,
} from '@components';

/**
 * index view
 */
const IndexView = () => {
  // const
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // state
  const [collapsed, setCollapsed] = useState(false);
  const [menus, setMenus] = useState([]);

  // effect
  useEffect(() => {
    listMenus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // list
  const listMenus = async () => {
    if (!cookie('userid') || !cookie('usertoken')) return;

    // list
    const listMenusRes = await postWithToken(`${host()}/ucenter/menus`, {});
    if (listMenusRes.type !== 'success') {
      message.error('获取菜单失败！');
      return;
    }
    console.log(listMenusRes);

    // set
    const menusItems = [];
    const rows = listMenusRes.obj.rows;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      menusItems.push({
        key: row.ucenter_menu_url,
        icon: <DiscordOutlined />,
        label: row.ucenter_menu_title,
      });
    }
    menusItems.push({
      key: 'logout',
      icon: <UserOutlined />,
      label: '退出登录',
    });
    setMenus(menusItems);
  };

  // menu click
  const menuClick = (e) => {
    const { origin, pathname, search } = new URL(window.location.href);

    // logout
    if (e.key === 'logout') {
      cookie('userid', null);
      cookie('usertoken', null);
      location.href = `${origin}${pathname}${search}`;
    } else {
      location.href = `${origin}${pathname}${search}#${e.key}`;
    }
  };

  return (
    <ConfigProvider locale={zhCN}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div style={{ height: '64px', color: '#fff', lineHeight: '64px', textAlign: 'center', fontSize: '18px' }}>
            管理后台
          </div>
          <Menu theme="dark" mode="inline" onClick={menuClick} items={menus} />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }} />
          <Content style={{ margin: '0 16px' }}>
            <HashRouter>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/ucenter/user" element={<UcenterUser />} />
                <Route path="/ucenter/menu" element={<UcenterMenu />} />
                <Route path="/ucenter/role" element={<UcenterRole />} />
                <Route path="/ucenter/rolemenu" element={<UcenterRolemenu />} />
                <Route path="/ucenter/roleuser" element={<UcenterRoleuser />} />
                <Route path="/mcp/item" element={<McpItem />} />
                <Route path="/mcp/info" element={<McpInfo />} />
                <Route path="/mcp/word" element={<McpWord />} />
              </Routes>
            </HashRouter>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<IndexView />);
