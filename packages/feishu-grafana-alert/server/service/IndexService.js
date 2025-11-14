// services
const { feishuBot } = require('@shun-js/shun-service');

/**
 * grafana alert
 * @param {*} req
 * @param {*} res
 */
exports.grafanaAlert = async (req, res) => {
  const methodName = 'grafanaAlert';

  // check body
  if (!req.body) {
    const msg = 'req.body is null';
    req.logger.warn(methodName, msg);
    res.jsonFail(msg);
    return;
  }
  if (!req.body.alerts || !req.body.alerts.length) {
    const msg = 'req.body.alerts is null';
    req.logger.warn(methodName, msg);
    res.jsonFail(msg);
    return;
  }

  try {
    // const
    const alertObj = req.body.alerts[0];
    const msg = [`【告警】${alertObj.labels.alertname}\n\n`];
    msg.push(`状态：${req.body.status}\n`);

    // msg
    if (req.body.status === 'firing') {
      if (alertObj.labels.alertname.indexOf('RAM Used') > -1) {
        msg.push(`内存值：${alertObj.values.B.toFixed(2)}%\n`);
      }
      if (alertObj.labels.alertname.indexOf('CPU Busy') > -1) {
        msg.push(`CPU值：${alertObj.values.A.toFixed(2)}%\n`);
      }
      if (alertObj.labels.alertname.indexOf('Root FS Used') > -1) {
        msg.push(`硬盘值：${alertObj.values.A.toFixed(2)}%\n`);
      }
    }

    // final msg
    const finalMsg = msg.join('');
    req.logger.warn(methodName, 'finalMsg', finalMsg);

    // feishu
    const feishuUrl =
      alertObj.labels.alertname.indexOf('prod') > -1
        ? global.QZ_CONFIG.feishu.feishuUrlOnline
        : global.QZ_CONFIG.feishu.feishuUrlTest;
    const feishuBotRes = await feishuBot({
      url: global.QZ_CONFIG.feishu.url,
      feishuUrl: feishuUrl,
      feishuMsg: finalMsg,
    });
    req.logger.warn(methodName, 'feishuBotRes', feishuBotRes);
    res.json(feishuBotRes);
  } catch (error) {
    const msg = 'handle alert error';
    req.logger.error(methodName, error);
    res.jsonFail(msg);
  }
};
