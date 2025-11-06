# @shun-js/shun-config

shun.js 服务启动前后去配置文件的工具类

## 示例

```js
// config
const { parseServerConfig } = require('@shun-js/shun-config');

// init
(async () => {
  // config
  const config = await parseServerConfig(process.argv);
  if (!config) {
    console.log('read server config fail');
    return;
  }

  // start app
})();
```
