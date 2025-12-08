# @shun-js/feishu-bot

shun.js服务：飞书机器人消息

## 配置文件

以`feishu-bot.json`命名

```json
{
  "port": 8001
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
curl --location --request POST 'http://127.0.0.1:8001/feishu/bot' \
--data-urlencode 'content={ "post": { "zh_cn": { "content": [[{ "tag": "text", "text": "【告警】测试" }]] } } }' \
--data-urlencode 'url=https://open.feishu.cn/open-apis/bot/v2/hook/xx'
```
