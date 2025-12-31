// ajax
import { post } from '@util/fetch.js';

/**
 * mcpList
 * @returns
 */
export const mcpList = async (options) => {
  const listDataRes = await post('/mcp/list', options || {});
  if (listDataRes.type !== 'success') {
    console.log(`list data error: ${listDataRes.msg}`);
    return;
  }
  if (!listDataRes.obj || !listDataRes.obj.rows) {
    console.log(`list data error: no rows`);
    return;
  }

  // r
  return listDataRes.obj;
};
