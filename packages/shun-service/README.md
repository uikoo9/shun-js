# @shun-js/shun-service

shun.js 各服务之间调用的工具

## 示例

```js
// services
const { feishuBot } = require('@shun-js/shun-service');

// feishu
const feishuBotRes = await feishuBot({
  url: global.QZ_CONFIG.feishu.url,
  feishuUrl: global.QZ_CONFIG.feishu.feishuUrl,
  feishuMsg: finalMsg,
});
req.logger.warn(methodName, 'feishuBotRes', feishuBotRes);
res.json(feishuBotRes);
```
