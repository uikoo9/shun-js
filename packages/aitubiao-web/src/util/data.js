// data
import QData from 'qiao-data';

/**
 * reportWebData
 * @param {*} eventName
 * @param {*} eventDetail
 */
export const reportWebData = async (eventName, eventDetail) => {
  if (window.location.href.indexOf('aitubiao.online') > -1) {
    const appId = 'ZAaFUcFoNc';
    const appKey = 'tHAcFnmLUhvbrdZYXxEl';
    const appName = 'aitubiao.online';
    const qData = QData(appId, appKey, appName);

    qData.reportWebData(eventName, eventDetail);
  }
};
