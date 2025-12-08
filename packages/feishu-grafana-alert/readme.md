# @shun-js/feishu-grafana-alert

shun.js服务：grafana的飞书webhook

## 配置文件

以`feishu-grafana-alert.json`命名

```json
{
  "port": 7001,
  "grafanaDomain": "domain grafana.xxx.ai"
}
```

## 启动

```shell
# 全局安装该服务
npm i -g @shun-js/feishu-grafana-alert

# 安装shun-cli
npm i -g @shun-js/shun-cli

# 启动，在feishu-grafana-alert.json所在目录下
shunjs start @shun-js/feishu-grafana-alert
```

## 请求

```shell
curl --location --request POST 'http://127.0.0.1:7001/grafana/alert' \
--header 'authorization: domain grafana.xxx.ai' \
--data-urlencode 'alerts=1'
```
