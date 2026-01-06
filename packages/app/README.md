# @shun-js/app

shun.js服务：app服务

## 配置文件

以`app.json`命名

```json
{
  "port": 8007,
  "db": {
    "connectionLimit": 20,
    "host": "127.0.0.1",
    "port": 3306,
    "database": "db_app",
    "user": "root",
    "password": "xx",
    "timezone": "Asia/Shanghai",
    "charset": "utf8mb4"
  }
}
```

## 启动

```shell
# 全局安装该服务
npm i -g @shun-js/user

# 安装shun-cli
npm i -g @shun-js/shun-cli

# 启动，在app.json所在目录下
shunjs start @shun-js/app
```

## 请求

```shell
# add
curl --location --request POST 'http://localhost:8007/app/update' \
--data-urlencode 'appName=1'
```
