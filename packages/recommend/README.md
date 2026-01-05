# @shun-js/recommend

shun.js服务：推荐服务

## 配置文件

以`recommend.json`命名

```json
{
  "port": 8004,
  "db": {
    "connectionLimit": 20,
    "host": "127.0.0.1",
    "port": 3306,
    "database": "db_recommend",
    "user": "root",
    "password": "xx",
    "timezone": "Asia/Shanghai",
    "charset": "utf8mb4"
  },
  "feishu": {
    "url": "http://127.0.0.1:8001/feishu/bot",
    "feishuUrl": "https://open.feishu.cn/open-apis/bot/v2/hook/2cd0xx"
  }
}
```

## 启动

```shell
# 全局安装该服务
npm i -g @shun-js/user

# 安装shun-cli
npm i -g @shun-js/shun-cli

# 启动，在recommend.json所在目录下
shunjs start @shun-js/recommend
```

## 请求

```shell

```
