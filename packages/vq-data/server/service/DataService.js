// model
const { fetchClarityData } = require('../model/DataModel.js');

// util
const { sleep, extractMetric, getUV } = require('../util/clarity.js');
const { fetchSearchConsoleData, getSearchConsoleSummary } = require('../util/google.js');
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
  const googleCredentials = global.QZ_CONFIG.googleCredentials;

  // check
  if (!projects || projects.length === 0) {
    logger.error(methodName, '请在 config.json 中配置项目');
    return;
  }
  logger.info(methodName, `正在获取 ${projects.length} 个项目的数据...`);

  // 逐个请求，每次间隔 1 秒
  const results = [];
  for (const project of projects) {
    const result = { name: project.name, clarity: false, google: false };

    // Clarity
    if (project.clarityToken) {
      try {
        const data = await fetchClarityData(project.clarityToken, numOfDays);
        const pages = extractMetric(data, 'PopularPages');
        const pv = pages.reduce((sum, p) => sum + (Number(p.visitsCount) || 0), 0);
        result.clarity = { data, uv: getUV(data), pv };
        logger.info(methodName, `  ✅ ${project.name} [Clarity]`);
      } catch (err) {
        logger.error(methodName, `  ❌ ${project.name} [Clarity]: ${err.message}`);
      }
    }

    // Google Search Console
    if (project.googleConsoleDomain && googleCredentials) {
      try {
        const rows = await fetchSearchConsoleData(googleCredentials, project.googleConsoleDomain, numOfDays);
        result.google = getSearchConsoleSummary(rows);
        logger.info(methodName, `  ✅ ${project.name} [Google]`);
      } catch (err) {
        logger.error(methodName, `  ❌ ${project.name} [Google]: ${err.message}`);
      }
    }

    results.push(result);
    await sleep(1000);
  }

  // 按 UV 倒序（没有 clarity 的排后面）
  results.sort((a, b) => {
    const uvA = a.clarity ? a.clarity.uv : 0;
    const uvB = b.clarity ? b.clarity.uv : 0;
    return uvB - uvA;
  });

  // 构建消息并发送到飞书
  const message = buildFeishuMessage(results, numOfDays);
  logger.info(methodName, '\n' + message);

  try {
    await feishuMsg(message);
    logger.info(methodName, '✅ 已发送到飞书');
  } catch (err) {
    logger.error(methodName, `❌ 飞书发送失败: ${err.message}`);
  }
};
