// dayjs
const dayjs = require('dayjs');

// mysql
const client = require('qiao-mysql')(global.QZ_CONFIG.db);
const sql = require('../sql/tubiaoSQL.js');

// feishu
const { feishuMsg } = require('../util/feishu.js');

// logger
const Logger = require('qiao-log');
const logOptions = require('../log-options.js')();
const logger = Logger(logOptions);

// click keys
const clickKeys = [
  {
    key: 'login.sendcode',
    name: '发送验证码',
  },
  {
    key: 'login.login',
    name: '登录按钮点击',
  },
  {
    key: 'index.login',
    name: '登录点击',
  },
  {
    key: 'index.banner',
    name: 'banner点击',
  },
  {
    key: 'index.run',
    name: '运行点击',
  },
];

/**
 * reportTubiaoData
 */
exports.reportTubiaoData = async () => {
  const methodName = 'reportTubiaoData';

  // const
  const nowDay = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
  logger.info(methodName, 'nowDay', nowDay);

  // datas
  const datas = {};
  datas.pvTotal = (await client.query(sql.pvTotal, [nowDay]))[0].pvTotal;
  datas.uvTotal = (await client.query(sql.uvTotal, [nowDay]))[0].uvTotal;

  // click datas
  for (let i = 0; i < clickKeys.length; i++) {
    const { key } = clickKeys[i];
    datas[key] = (await client.query(sql.clickTotal, [nowDay, key]))[0].clickTotal;
  }
  logger.info(methodName, 'datas', datas);

  // msg
  const msg = [
    `【提醒】数据报表（${nowDay}）\n\n`,

    `AITuBiao.online汇总\n`,
    `|- pv: ${datas.pvTotal}\n`,
    `|- uv: ${datas.uvTotal}\n`,
  ];
  for (let i = 0; i < clickKeys.length; i++) {
    const { key, name } = clickKeys[i];
    msg.push(`|- ${name}: ${datas[key]}\n`);
  }
  logger.info(methodName, 'msg', msg);

  // feishu
  feishuMsg(msg.join(''));
};
