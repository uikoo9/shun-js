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

## 业务模块

- [@shun-js/feishu-grafana-alert](./packages/feishu-grafana-alert/README.md): 7001-grafana告警的飞书webhook
- [@shun-js/aitubiao-server](./packages/aitubiao-server/README.md): 7002-aitubiao.online
- [@shun-js/mcp-admin-server](./packages/mcp-admin-server/README.md): 7003-mcp-servers.online admin
- [@shun-js/mcp-index-server](./packages/mcp-index-server/README.md): 7004-mcp-servers.online index
