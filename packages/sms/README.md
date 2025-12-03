# @shun-js/sms

shun.js服务：国内短信服务

## 配置文件

以`sms.json`命名

```json
{
  "port": 8002,
  "submail": {
    "appid": "xx",
    "appkey": "xx"
  },
  "feishu": {
    "url": "http://localhost:8001/feishu/bot",
    "feishuUrl": "https://open.feishu.cn/open-apis/bot/v2/hook/xx"
  }
}
```

## 启动

```shell
# 全局安装该服务
npm i -g @shun-js/sms

# 安装shun-cli
npm i -g @shun-js/shun-cli

# 启动，在sms.json所在目录下
shunjs start @shun-js/sms
```

## 请求

```shell
curl --location --request POST 'http://localhost:8002/sms' \
--data-urlencode 'mobile=xx' \
--data-urlencode 'content=【xx】验证码：123456，如非本人操作，请忽略此短信。'
```
