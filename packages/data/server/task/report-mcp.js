// dayjs
const dayjs = require('dayjs');

// mysql
const client = require('qiao-mysql')(global.QZ_CONFIG.db);
const sql = require('../sql/mcpSQL.js');

// feishu
const { feishuMsg } = require('../util/feishu.js');

// logger
const Logger = require('qiao-log');
const logOptions = require('../log-options.js')();
const logger = Logger(logOptions);

// click keys
const clickKeys = [
  {
    key: 'index.runmcp',
    name: '运行点击',
  },
  {
    key: 'index.loadmore',
    name: '加载更多',
  },
  {
    key: 'search.search',
    name: '搜索点击',
  },
  {
    key: 'search.reset',
    name: '重置点击',
  },
];

/**
 * reportMCPData
 */
exports.reportMCPData = async () => {
  const methodName = 'reportMCPData';

  // const
  const nowDay = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
  logger.info(methodName, 'nowDay', nowDay);

  // datas
  const datas = {};
  datas.pvTotal = (await client.query(sql.pvTotal, [nowDay]))[0].pvTotal;
  datas.uvTotal = (await client.query(sql.uvTotal, [nowDay]))[0].uvTotal;
  datas.pvIndexTotal = (await client.query(sql.pvIndexTotal, [nowDay]))[0].pvIndexTotal;
  datas.uvIndexTotal = (await client.query(sql.uvIndexTotal, [nowDay]))[0].uvIndexTotal;
  datas.pvDetailTotal = (await client.query(sql.pvDetailTotal, [nowDay]))[0].pvDetailTotal;
  datas.uvDetailTotal = (await client.query(sql.uvDetailTotal, [nowDay]))[0].uvDetailTotal;
  datas.tagClickTotal = (await client.query(sql.tagClickTotal, [nowDay]))[0].tagClickTotal;
  datas.cardClickTotal = (await client.query(sql.cardClickTotal, [nowDay]))[0].cardClickTotal;

  // click datas
  for (let i = 0; i < clickKeys.length; i++) {
    const { key } = clickKeys[i];
    datas[key] = (await client.query(sql.clickTotal, [nowDay, key]))[0].clickTotal;
  }
  logger.info(methodName, 'datas', datas);

  // msg
  const msg = [
    `【提醒】数据报表（${nowDay}）\n\n`,

    `mcp-servers.online汇总\n`,
    `|- pv: ${datas.pvTotal}\n`,
    `|- uv: ${datas.uvTotal}\n`,
    `|- pv-index: ${datas.pvIndexTotal}\n`,
    `|- uv-index: ${datas.uvIndexTotal}\n`,
    `|- pv-detail: ${datas.pvDetailTotal}\n`,
    `|- uv-detail: ${datas.uvDetailTotal}\n`,
    `|- tag点击: ${datas.tagClickTotal}\n`,
    `|- 卡片点击: ${datas.cardClickTotal}\n`,
  ];
  for (let i = 0; i < clickKeys.length; i++) {
    const { key, name } = clickKeys[i];
    msg.push(`|- ${name}: ${datas[key]}\n`);
  }
  logger.info(methodName, 'msg', msg);

  // feishu
  feishuMsg(msg.join(''));
};
