# @shun-js/cos

shun.js服务：推荐服务

## 配置文件

以`cos.json`命名

```json
{
  "port": 8005
}
```

## 启动

```shell
# 全局安装该服务
npm i -g @shun-js/user

# 安装shun-cli
npm i -g @shun-js/shun-cli

# 启动，在cos.json所在目录下
shunjs start @shun-js/cos
```

## 请求

```shell
# cos token
curl --location --request POST 'http://localhost:8005/cos/token' \
--data-urlencode 'cosSecretId=xx' \
--data-urlencode 'cosSecretKey=xx' \
--data-urlencode 'cosBucket=xx' \
--data-urlencode 'cosRegion=ap-beijing' \
--data-urlencode 'durationSeconds=1800' \
--data-urlencode 'allowPrefix=models/*'

# cos sign
curl --location --request POST 'http://localhost:8005/cos/sign' \
--data-urlencode 'cosSecretId=xx' \
--data-urlencode 'cosSecretKey=xx' \
--data-urlencode 'cosBucket=xx' \
--data-urlencode 'cosRegion=ap-beijing' \
--data-urlencode 'signKey=xx' \
--data-urlencode 'signTimeout=60' \
--data-urlencode 'cdnHost=1800' \
--data-urlencode 'filePath=models/*' \
--data-urlencode 'formatWebp=no' \
--data-urlencode 'formatWidth=150'
```
