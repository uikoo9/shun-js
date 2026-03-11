// services
const { feishuBot } = require('@shun-js/shun-service');

// util
const { extractMetric } = require('./clarity.js');

/**
 * buildFeishuMessage
 * @param {*} results
 * @param {*} numOfDays
 * @returns
 */
exports.buildFeishuMessage = (results, numOfDays) => {
  const today = new Date().toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai' });
  let content = `提醒: 网站流量日报 (${today}, 近${numOfDays}天)\n\n`;

  // 汇总
  const totalUV = results.reduce((sum, r) => sum + (r.clarity ? r.clarity.uv : 0), 0);
  const totalPV = results.reduce((sum, r) => sum + (r.clarity ? r.clarity.pv : 0), 0);
  const totalClicks = results.reduce((sum, r) => sum + (r.google ? r.google.clicks : 0), 0);
  const totalImpressions = results.reduce((sum, r) => sum + (r.google ? r.google.impressions : 0), 0);
  content += `汇总: UV ${totalUV} | PV ${totalPV} | 点击 ${totalClicks} | 曝光 ${totalImpressions}\n`;
  content += '━'.repeat(30) + '\n\n';

  // 逐项
  for (const r of results) {
    content += `📊 ${r.name}\n`;

    // Clarity
    if (r.clarity) {
      const traffic = extractMetric(r.clarity.data, 'Traffic')[0] || {};
      const pages = extractMetric(r.clarity.data, 'PopularPages');
      const pv = pages.reduce((sum, p) => sum + (Number(p.visitsCount) || 0), 0);
      content += `   UV: ${traffic.totalSessionCount || 0}  |  PV: ${pv}\n`;

      if (pages.length > 0) {
        for (const page of pages.slice(0, 5)) {
          content += `   ${page.visitsCount}次 ${page.url}\n`;
        }
      }
    } else {
      content += `   UV: -  |  PV: -\n`;
    }

    // Google Search Console
    if (r.google) {
      content += `   点击: ${r.google.clicks}  |  曝光: ${r.google.impressions}  |  CTR: ${r.google.ctr}%  |  排名: ${r.google.position}\n`;
    } else {
      content += `   点击: -  |  曝光: -  |  CTR: -  |  排名: -\n`;
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
