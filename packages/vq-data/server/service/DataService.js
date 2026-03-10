// model
const { fetchClarityData } = require('../model/DataModel.js');

// util
const { sleep, extractMetric, getUV } = require('../util/data.js');
const { buildFeishuMessage, feishuMsg } = require('../util/feishu.js');

// logger
const Logger = require('qiao-log');
const logOptions = require('../log-options.js')();
const logger = Logger(logOptions);

/**
 * clarityReport
 */
exports.clarityReport = async () => {
  const methodName = 'clarityReport';

  // const
  const projects = global.QZ_CONFIG.projects;
  const numOfDays = global.QZ_CONFIG.numOfDays;

  // check
  if (!projects || projects.length === 0) {
    logger.error(methodName, '请在 config.json 中配置项目');
    return;
  }
  logger.log(methodName, `正在获取 ${projects.length} 个项目的数据...`);

  // 逐个请求，每次间隔 1 秒
  const results = [];
  for (const project of projects) {
    try {
      const data = await fetchClarityData(project.token, numOfDays);
      const pages = extractMetric(data, 'PopularPages');
      const pv = pages.reduce((sum, p) => sum + (Number(p.visitsCount) || 0), 0);
      results.push({ name: project.name, data, uv: getUV(data), pv });
      logger.log(methodName, `  ✅ ${project.name}`);
    } catch (err) {
      logger.error(methodName, `  ❌ ${project.name}: ${err.message}`);
    }

    await sleep(1000);
  }

  // 按 UV 倒序
  results.sort((a, b) => b.uv - a.uv);

  // 构建消息并发送到飞书
  const message = buildFeishuMessage(results, numOfDays);
  logger.log(methodName, '\n' + message);

  try {
    await feishuMsg(message);
    logger.log(methodName, '✅ 已发送到飞书');
  } catch (err) {
    logger.error(methodName, `❌ 飞书发送失败: ${err.message}`);
  }
};
