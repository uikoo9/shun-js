/**
 * sleep
 * @param {*} ms
 * @returns
 */
exports.sleep = (ms) => {
  return new Promise((r) => setTimeout(r, ms));
};

/**
 * extractMetric
 * @param {*} data
 * @param {*} metricName
 * @returns
 */
exports.extractMetric = (data, metricName) => {
  const metric = data.find((m) => m.metricName === metricName);
  return metric?.information || [];
};

/**
 * getUV
 * @param {*} data
 * @returns
 */
exports.getUV = (data) => {
  const traffic = exports.extractMetric(data, 'Traffic')[0] || {};
  return Number(traffic.distinctUserCount) || 0;
};
