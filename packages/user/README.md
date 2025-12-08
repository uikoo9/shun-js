# @shun-js/user

shun.js服务：用户服务

## 配置文件

以`user.json`命名

```json
{
  "port": 8003,
  "paths": ["/user/login", "/user/check"],
  "encryptKey": "xx",
  "db": {
    "connectionLimit": 20,
    "host": "127.0.0.1",
    "port": 3306,
    "database": "db_user",
    "user": "root",
    "password": "xx",
    "timezone": "Asia/Shanghai",
    "charset": "utf8mb4"
  },
  "redisOptions": {
    "port": 6380,
    "host": "127.0.0.1",
    "password": "xx",
    "db": 0
  },
  "feishu": {
    "url": "http://127.0.0.1:8001/feishu/bot",
    "feishuUrl": "https://open.feishu.cn/open-apis/bot/v2/hook/xx"
  }
}
```

## 启动

```shell
# 全局安装该服务
npm i -g @shun-js/user

# 安装shun-cli
npm i -g @shun-js/shun-cli

# 启动，在user.json所在目录下
shunjs start @shun-js/user
```

## 请求

```shell
curl --location --request POST 'http://127.0.0.1:8003/user/login' \
--data-urlencode 'mobile=xx' \
--data-urlencode 'code=123456'
```
