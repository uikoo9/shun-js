# shun.js

顺滑的启动各种业务模块

## 准备工作

```shell
# 安装cli工具
npm i -g @shun-js/shun-cli

# 启动，在feishu-grafana-alert.json所在目录下
shunjs start @shun-js/feishu-grafana-alert

# 可以启动多个服务
shunjs start @shun-js/feishu-grafana-alert @shun-js/xxx
```

## 基础模块

- [@shun-js/feishu-bot](./packages/feishu-bot/README.md): 8001-飞书机器人模块
- [@shun-js/sms](./packages/sms/README.md): 8002-短信模块
- [@shun-js/user](./packages/user/README.md): 8003-用户模块
- [@shun-js/recommend](./packages/recommend/README.md): 8004-推荐模块
- [@shun-js/cos](./packages/cos/README.md): 8005-COS模块
- [@shun-js/config](./packages/config/README.md): 8006-config模块
- [@shun-js/app](./packages/app/README.md): 8007-app模块
- [@shun-js/data](./packages/data/README.md): 8008-data模块

## 业务模块

- [@shun-js/feishu-grafana-alert](./packages/feishu-grafana-alert/README.md): 7001-grafana告警的飞书webhook
- @shun-js/aitubiao-server: 7002-aitubiao.online
- @shun-js/mcp-admin-server: 7003-mcp-servers.online admin
- @shun-js/mcp-index-server: 7004-mcp-servers.online index
- @shun-js/mcp-api-server: 7005-mcp-servers.online api
- @shun-js/aibaiban-server: 7006-aibaiban.com
- @shun-js/remotion-server: 7007-remotion.cool
- @shun-js/webcc-server: 7008-webcc.dev
- @shun-js/webcc-ws: 7009-ws.webcc.dev
