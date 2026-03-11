const { google } = require('googleapis');

/**
 * getAuthClient
 * @param {*} credentials
 * @returns
 */
const getAuthClient = (credentials) => {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  return auth;
};

/**
 * fetchSearchConsoleData
 * @param {*} credentials - service account JSON object
 * @param {*} googleConsoleDomain - e.g. 'sc-domain:example.com'
 * @param {*} numOfDays
 * @returns
 */
exports.fetchSearchConsoleData = async (credentials, googleConsoleDomain, numOfDays) => {
  const auth = getAuthClient(credentials);
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - numOfDays);

  const res = await searchconsole.searchanalytics.query({
    siteUrl: googleConsoleDomain,
    requestBody: {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      dimensions: ['page'],
      rowLimit: 10,
    },
  });

  return res.data.rows || [];
};

/**
 * getSearchConsoleSummary
 * @param {*} rows - searchanalytics query rows
 * @returns { clicks, impressions, ctr, position }
 */
exports.getSearchConsoleSummary = (rows) => {
  let clicks = 0;
  let impressions = 0;

  for (const row of rows) {
    clicks += row.clicks || 0;
    impressions += row.impressions || 0;
  }

  const ctr = impressions > 0 ? clicks / impressions : 0;
  const position = rows.length > 0 ? rows.reduce((sum, r) => sum + (r.position || 0), 0) / rows.length : 0;

  return {
    clicks,
    impressions,
    ctr: (ctr * 100).toFixed(1),
    position: position.toFixed(1),
  };
};

/**
 * formatDate
 * @param {*} date
 * @returns yyyy-MM-dd
 */
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};
