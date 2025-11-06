# @shun-js/feishu-bot

shun.js服务：飞书机器人消息

## 配置文件

以`feishu-bot.json`命名

```json
{
  "port": 7002
}
```

## 启动

```shell
# 全局安装该服务
npm i -g @shun-js/feishu-bot

# 安装shun-cli
npm i -g @shun-js/shun-cli

# 启动，在feishu-bot.json所在目录下
shunjs start @shun-js/feishu-bot
```

## 请求

```shell
curl --location --request POST 'http://localhost:${config.port}/' \
--header 'authorization: ${config.grafanaDomain}' \
--data-urlencode 'alerts="{}"'

# 例如
curl --location --request POST 'http://localhost:7001/grafana/alert' \
--header 'authorization: domain grafana.sitin.ai' \
--data-urlencode 'alerts="{}"'
```
