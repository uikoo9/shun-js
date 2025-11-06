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

    // msg
    if (alertObj.labels.alertname === 'RAM Used') {
      msg.push(`服务器：${alertObj.labels.server_name}\n`);
      msg.push(`内网IP：${alertObj.labels.instance}\n`);
      msg.push(`内存值：${alertObj.values.B.toFixed(2)}%\n`);
    }
    const finalMsg = msg.join('');
    req.logger.warn(methodName, 'finalMsg', finalMsg);

    // feishu
    const feishuBotRes = await feishuBot({
      url: global.QZ_CONFIG.feishu.url,
      feishuUrl: global.QZ_CONFIG.feishu.feishuUrl,
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
