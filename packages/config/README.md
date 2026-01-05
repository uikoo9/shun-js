# @shun-js/config

shun.js服务：配置服务

## 配置文件

以`config.json`命名

```json
{
  "port": 8006
}
```

## 启动

```shell
# 全局安装该服务
npm i -g @shun-js/user

# 安装shun-cli
npm i -g @shun-js/shun-cli

# 启动，在config.json所在目录下
shunjs start @shun-js/config
```

## 请求

```shell
curl --location --request POST 'http://localhost:8006/config' \
--data-urlencode 'type=mp-xiaolouai'
```
