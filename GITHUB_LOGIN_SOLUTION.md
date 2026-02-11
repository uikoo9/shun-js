# GitHub OAuth 登录技术方案

## 概述

使用 Node.js 实现 GitHub OAuth 2.0 登录流程，允许用户通过 GitHub 账号登录应用。

## 前置要求

1. GitHub 账号
2. 注册 GitHub OAuth 应用
3. Node.js 环境
4. Express 服务器（或其他 Node.js web 框架）

## 步骤一：注册 GitHub OAuth 应用

### 1.1 访问 GitHub Developer Settings

访问：https://github.com/settings/developers

### 1.2 创建新的 OAuth App

- 点击 "New OAuth App"
- 填写以下信息：
  - **Application name**: 你的应用名称（如：webcc.dev）
  - **Homepage URL**: https://webcc.dev
  - **Authorization callback URL**: https://webcc.dev/api/auth/github/callback
    - 开发环境：http://localhost:3000/api/auth/github/callback

### 1.3 获取凭证

创建后会获得：

- **Client ID**: 公开的客户端标识符
- **Client Secret**: 私密的客户端密钥（需要保密）

## 步骤二：环境配置

### 2.1 创建 .env 文件

```bash
# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback

# Session Secret
SESSION_SECRET=your_random_session_secret

# App URL
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

### 2.2 安装依赖

```bash
npm install express express-session axios dotenv
```

## 步骤三：实现 OAuth 流程

### 3.1 创建 GitHub OAuth 配置

```javascript
// packages/index/lib/github-oauth.js

const GITHUB_OAUTH_CONFIG = {
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  redirectUri: process.env.GITHUB_CALLBACK_URL,
  authUrl: 'https://github.com/login/oauth/authorize',
  tokenUrl: 'https://github.com/login/oauth/access_token',
  userUrl: 'https://api.github.com/user',
  scope: 'read:user user:email', // 请求的权限范围
};

module.exports = GITHUB_OAUTH_CONFIG;
```

### 3.2 创建授权 URL

```javascript
// packages/index/lib/github-oauth.js

function getGitHubAuthUrl(state) {
  const params = new URLSearchParams({
    client_id: GITHUB_OAUTH_CONFIG.clientId,
    redirect_uri: GITHUB_OAUTH_CONFIG.redirectUri,
    scope: GITHUB_OAUTH_CONFIG.scope,
    state: state, // 防止 CSRF 攻击
  });

  return `${GITHUB_OAUTH_CONFIG.authUrl}?${params.toString()}`;
}

module.exports = { GITHUB_OAUTH_CONFIG, getGitHubAuthUrl };
```

### 3.3 创建 API 路由

```javascript
// packages/index/app/api/auth/github/route.js (Next.js 14+ App Router)

import { NextResponse } from 'next/server';
import crypto from 'crypto';

// GET /api/auth/github - 发起 GitHub 登录
export async function GET(request) {
  // 生成随机 state 用于防止 CSRF
  const state = crypto.randomBytes(16).toString('hex');

  // 存储 state 到 cookie（稍后验证）
  const response = NextResponse.redirect(getGitHubAuthUrl(state));
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 600, // 10 分钟
    sameSite: 'lax',
  });

  return response;
}
```

```javascript
// packages/index/app/api/auth/github/callback/route.js (Next.js 14+ App Router)

import { NextResponse } from 'next/server';
import axios from 'axios';

// GET /api/auth/github/callback - GitHub 回调处理
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const storedState = request.cookies.get('oauth_state')?.value;

  // 验证 state 防止 CSRF
  if (!state || state !== storedState) {
    return NextResponse.redirect(`${process.env.FRONTEND_URL}/?error=invalid_state`);
  }

  if (!code) {
    return NextResponse.redirect(`${process.env.FRONTEND_URL}/?error=no_code`);
  }

  try {
    // 步骤 1: 用 code 换取 access_token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
        redirect_uri: process.env.GITHUB_CALLBACK_URL,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );

    const { access_token, token_type } = tokenResponse.data;

    if (!access_token) {
      throw new Error('No access token received');
    }

    // 步骤 2: 使用 access_token 获取用户信息
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `${token_type} ${access_token}`,
        Accept: 'application/json',
      },
    });

    const githubUser = userResponse.data;

    // 步骤 3: 获取用户邮箱（如果需要）
    const emailResponse = await axios.get('https://api.github.com/user/emails', {
      headers: {
        Authorization: `${token_type} ${access_token}`,
        Accept: 'application/json',
      },
    });

    const primaryEmail = emailResponse.data.find((email) => email.primary)?.email;

    // 步骤 4: 创建或更新用户记录
    const user = {
      id: githubUser.id,
      username: githubUser.login,
      displayName: githubUser.name,
      email: primaryEmail || githubUser.email,
      avatarUrl: githubUser.avatar_url,
      githubUrl: githubUser.html_url,
      provider: 'github',
      accessToken: access_token, // 可选：存储以便后续 API 调用
    };

    // TODO: 存储用户信息到数据库

    // 步骤 5: 创建会话并重定向
    const response = NextResponse.redirect(process.env.FRONTEND_URL);

    // 设置会话 cookie（简单示例，生产环境应使用 JWT 或 session 库）
    response.cookies.set('user_session', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 天
      sameSite: 'lax',
    });

    // 清除 oauth_state cookie
    response.cookies.delete('oauth_state');

    return response;
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return NextResponse.redirect(`${process.env.FRONTEND_URL}/?error=auth_failed`);
  }
}
```

### 3.4 创建登出接口

```javascript
// packages/index/app/api/auth/logout/route.js

import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // 清除会话 cookie
  response.cookies.delete('user_session');

  return response;
}
```

### 3.5 创建获取当前用户接口

```javascript
// packages/index/app/api/auth/user/route.js

import { NextResponse } from 'next/server';

export async function GET(request) {
  const userSession = request.cookies.get('user_session')?.value;

  if (!userSession) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const user = JSON.parse(userSession);

    // 移除敏感信息
    const { accessToken, ...safeUser } = user;

    return NextResponse.json({ user: safeUser });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
```

## 步骤四：前端集成

### 4.1 更新 AuthContext

```typescript
// packages/index/src/contexts/AuthContext.tsx

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  username: string;
  displayName: string | null;
  email: string;
  avatarUrl: string;
  githubUrl: string;
  provider: 'github';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGithub: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 检查用户会话
  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch('/api/auth/user');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  // 发起 GitHub 登录
  const signInWithGithub = () => {
    window.location.href = '/api/auth/github';
  };

  // 登出
  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      window.location.reload();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGithub, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### 4.2 更新 LoginModal

```typescript
// packages/index/src/components/LoginModal.tsx

const { signInWithGithub } = useAuth();

const handleGitHubLogin = () => {
  signInWithGithub(); // 直接跳转到 /api/auth/github
};
```

## OAuth 流程图

```
┌─────────┐                 ┌──────────┐                ┌────────┐
│ 用户    │                 │ 你的应用 │                │ GitHub │
└────┬────┘                 └────┬─────┘                └───┬────┘
     │                           │                          │
     │ 1. 点击 "Login with GitHub" │                          │
     ├───────────────────────────>│                          │
     │                           │                          │
     │                           │ 2. 重定向到 GitHub       │
     │                           ├─────────────────────────>│
     │                           │   (带 client_id, state)  │
     │                           │                          │
     │        3. GitHub 授权页面  │                          │
     │<──────────────────────────┼──────────────────────────┤
     │                           │                          │
     │ 4. 用户授权               │                          │
     ├───────────────────────────┼─────────────────────────>│
     │                           │                          │
     │                           │ 5. 回调 URL + code       │
     │                           │<─────────────────────────┤
     │                           │                          │
     │                           │ 6. 用 code 换 token      │
     │                           ├─────────────────────────>│
     │                           │                          │
     │                           │ 7. 返回 access_token     │
     │                           │<─────────────────────────┤
     │                           │                          │
     │                           │ 8. 获取用户信息          │
     │                           ├─────────────────────────>│
     │                           │    (用 access_token)     │
     │                           │                          │
     │                           │ 9. 返回用户信息          │
     │                           │<─────────────────────────┤
     │                           │                          │
     │ 10. 设置会话，重定向首页  │                          │
     │<──────────────────────────┤                          │
     │                           │                          │
```

## 安全注意事项

### 1. CSRF 防护

- 使用 `state` 参数防止 CSRF 攻击
- 在回调时验证 state 值

### 2. 敏感信息保护

- Client Secret 必须保密，仅在服务端使用
- 不要在前端代码中暴露 Client Secret
- Access Token 应安全存储（httpOnly cookie 或加密存储）

### 3. HTTPS

- 生产环境必须使用 HTTPS
- Callback URL 必须使用 HTTPS

### 4. Session 管理

- 使用安全的 session 管理（如 JWT + httpOnly cookie）
- 设置合理的过期时间
- 实现 token 刷新机制

### 5. 权限范围（Scope）

- 只请求必要的权限
- 常用 scope:
  - `read:user` - 读取用户基本信息
  - `user:email` - 读取用户邮箱
  - `repo` - 访问仓库（如果需要）

## 数据库集成（可选）

如果需要持久化用户数据，可以使用数据库：

```javascript
// 使用 Prisma 示例
async function findOrCreateUser(githubUser, accessToken) {
  const user = await prisma.user.upsert({
    where: {
      provider_providerId: {
        provider: 'github',
        providerId: String(githubUser.id),
      },
    },
    update: {
      username: githubUser.login,
      displayName: githubUser.name,
      email: githubUser.email,
      avatarUrl: githubUser.avatar_url,
      accessToken: accessToken, // 应该加密存储
      lastLoginAt: new Date(),
    },
    create: {
      provider: 'github',
      providerId: String(githubUser.id),
      username: githubUser.login,
      displayName: githubUser.name,
      email: githubUser.email,
      avatarUrl: githubUser.avatar_url,
      accessToken: accessToken, // 应该加密存储
    },
  });

  return user;
}
```

## 测试流程

### 开发环境测试

1. 启动本地服务器：`npm run dev`
2. 访问：http://localhost:3000
3. 点击 "Login with GitHub"
4. 在 GitHub 授权页面点击授权
5. 应该重定向回首页并显示用户信息

### 调试技巧

- 使用 `console.log` 记录每个步骤
- 检查 Network 面板查看请求
- 验证 cookies 设置正确
- 检查 GitHub OAuth 应用设置

## 常见问题

### Q1: redirect_uri_mismatch 错误

**原因**: Callback URL 不匹配
**解决**: 确保 GitHub OAuth 应用设置的 callback URL 与代码中的完全一致

### Q2: 获取不到用户邮箱

**原因**: 用户邮箱设置为私有
**解决**: 请求 `user:email` scope 并使用 `/user/emails` API

### Q3: Access token 过期

**原因**: GitHub access token 默认不会过期，但可能被用户撤销
**解决**: 实现 token 验证和刷新逻辑

## 生产环境部署清单

- [ ] 设置环境变量（GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET）
- [ ] 使用 HTTPS
- [ ] 更新 GitHub OAuth App 的 Callback URL 为生产域名
- [ ] 实现安全的 session 管理
- [ ] 加密存储敏感信息
- [ ] 设置 CORS 正确配置
- [ ] 实现错误处理和日志记录
- [ ] 添加速率限制（防止滥用）

## 参考资料

- [GitHub OAuth Documentation](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
- [GitHub REST API](https://docs.github.com/en/rest)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

**创建时间**: 2026-02-10
**更新时间**: 2026-02-10
**状态**: 待实现
