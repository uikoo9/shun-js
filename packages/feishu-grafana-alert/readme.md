# @shun-js/feishu-grafana-alert

shun.js服务：grafana的飞书webhook

## 请求

```shell
curl --location --request POST 'http://localhost:${config.port}/grafana/alert' \
--header 'authorization: ${config.grafanaDomain}' \
--data-urlencode 'alerts="{}"'
```
