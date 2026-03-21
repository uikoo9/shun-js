const https = require('https');

/**
 * fetchBingWebmasterData
 * @param {string} apiKey - Bing Webmaster API Key
 * @param {string} siteUrl - 网站 URL，例如 'https://example.com'
 * @param {number} numOfDays - 查询天数
 * @returns {Promise<object>} { clicks, impressions, ctr, position }
 */
exports.fetchBingWebmasterData = async (apiKey, siteUrl, numOfDays) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - numOfDays);

  const params = new URLSearchParams({
    siteUrl,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  });

  const options = {
    hostname: 'ssl.bing.com',
    path: `/webmaster/api.svc/json/GetQueryStats?${params.toString()}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
  };

  const data = await makeRequest(options);
  return parseBingData(data);
};

/**
 * makeRequest
 */
const makeRequest = (options) => {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`Bing API error: ${res.statusCode} ${body}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
};

/**
 * parseBingData
 */
const parseBingData = (data) => {
  if (!data || !data.d) return { clicks: 0, impressions: 0, ctr: '0.0', position: '0.0' };

  const queries = data.d || [];
  let clicks = 0;
  let impressions = 0;
  let totalPosition = 0;

  for (const query of queries) {
    clicks += query.Clicks || 0;
    impressions += query.Impressions || 0;
    totalPosition += query.AvgImpressionPosition || 0;
  }

  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const position = queries.length > 0 ? totalPosition / queries.length : 0;

  return {
    clicks,
    impressions,
    ctr: ctr.toFixed(1),
    position: position.toFixed(1),
  };
};

/**
 * formatDate
 */
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};
