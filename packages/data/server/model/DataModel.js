// mysql
const client = require('qiao-mysql')(global.QZ_CONFIG.db);
const sql = require('../sql/data-sql.json');

/**
 * dataEvents
 */
exports.dataEvents = [];

/**
 * addDataEvent
 * @param {*} req
 * @param {*} imagePath
 * @param {*} imageSize
 * @returns
 */
exports.addDataEvent = async (dataEvent) => {
  // params
  const params = [];
  params.push(dataEvent.data_app_name || '');
  params.push(dataEvent.data_web_id || '');
  params.push(dataEvent.data_user_id || '');
  params.push(dataEvent.data_event_name || '');
  params.push(dataEvent.data_event_detail || '');

  // add image
  await client.query(sql.addDataEvent, params);
};
