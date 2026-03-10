// services
const { feishuBot } = require('@shun-js/shun-service');

// util
const { extractMetric } = require('./data.js');

/**
 * buildFeishuMessage
 * @param {*} results
 * @param {*} numOfDays
 * @returns
 */
exports.buildFeishuMessage = (results, numOfDays) => {
  const today = new Date().toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai' });
  let content = `提醒: 网站流量日报 (${today}, 近${numOfDays}天)\n\n`;

  const totalUV = results.reduce((sum, r) => sum + r.uv, 0);
  const totalPV = results.reduce((sum, r) => sum + r.pv, 0);
  content += `汇总: UV ${totalUV} | PV ${totalPV}\n`;
  content += '━'.repeat(30) + '\n\n';

  for (const r of results) {
    const traffic = extractMetric(r.data, 'Traffic')[0] || {};
    const pages = extractMetric(r.data, 'PopularPages');
    const pv = pages.reduce((sum, p) => sum + (Number(p.visitsCount) || 0), 0);

    content += `📊 ${r.name}\n`;
    content += `   UV: ${traffic.distinctUserCount || 0}  |  会话: ${traffic.totalSessionCount || 0}  |  PV: ${pv}\n`;

    if (pages.length > 0) {
      for (const page of pages.slice(0, 5)) {
        content += `   ${page.visitsCount}次 ${page.url}\n`;
      }
    }
    content += '\n';
  }

  return content;
};

/**
 * feishuMsg
 * @param {*} msg
 */
exports.feishuMsg = (msg) => {
  if (global.QZ_CONFIG.env !== 'production') return;

  feishuBot({
    url: global.QZ_CONFIG.feishu.url,
    feishuUrl: global.QZ_CONFIG.feishu.feishuUrl,
    feishuMsg: msg,
  });
};
