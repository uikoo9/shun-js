// qiao
const { genChart } = require('qiao-agent');

// util
const { chartFeishuMsg, chartResFeishuMsg, errorFeishuMsg } = require('../../util/feishu.js');

/**
 * index
 * @param {*} req
 * @param {*} res
 */
exports.index = async (req, res) => {
  // const
  const pagePath = './views/index.html';

  // is static
  const isStatic = await res.staticRender(pagePath);
  if (isStatic) return;

  // render
  res.render(pagePath, {}, true);
};

/**
 * chart
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.chart = async (req, res) => {
  const methodName = 'chart';

  // check
  if (!req.body.userPrompt) {
    const msg = 'need userPrompt';
    req.logger.error(methodName, msg);
    res.jsonFail(msg);
    return;
  }

  // const
  const userPrompt = decodeURIComponent(req.body.userPrompt);
  req.logger.info(methodName, 'userPrompt', userPrompt);
  chartFeishuMsg(req);

  // go
  try {
    const mcpUrl = global.QZ_CONFIG.mcpChartUrl;
    const chartRes = await genChart(global.QZ_CONFIG.llm, userPrompt, mcpUrl);
    req.logger.info(methodName, 'chartRes', chartRes);

    // check
    if (!chartRes) {
      const msg = 'chart res is null';
      errorFeishuMsg(req, msg);
      req.logger.error(methodName, msg);
      res.jsonFail(msg);
      return;
    }

    // r
    chartResFeishuMsg(req, JSON.stringify(chartRes));
    res.jsonSuccess('success', chartRes);
  } catch (error) {
    const msg = 'gen chart error';
    errorFeishuMsg(req, msg);
    req.logger.error(methodName, msg, error);
    res.jsonFail(msg);
  }
};
