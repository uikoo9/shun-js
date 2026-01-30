// supabase
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(global.QZ_CONFIG.SUPABASE_URL, global.QZ_CONFIG.SUPABASE_SERVICE_KEY);

// logger
const Logger = require('qiao-log');
const logOptions = require('../log-options.js')();
const logger = Logger(logOptions);

/**
 * fetchPendingWorks
 * @returns
 */
exports.fetchPendingWorks = async () => {
  const methodName = 'fetchPendingWorks';

  try {
    // query
    const { data, error } = await supabase.rpc('get_pending_works_locked', {
      max_count: 1,
    });

    // check
    if (error) {
      logger.error(methodName, 'Error fetching pending works:', error);
      return [];
    }

    // r
    return data || [];
  } catch (error) {
    logger.error(methodName, 'Unexpected error fetching works:', error);
    return [];
  }
};

/**
 * 更新作品渲染状态
 */
exports.updateRenderStatus = async (workId, renderStatus, updates = {}) => {
  const methodName = 'updateRenderStatus';
  try {
    const { error } = await supabase
      .from('works')
      .update({
        render_status: renderStatus,
        updated_at: new Date().toISOString(),
        ...updates,
      })
      .eq('id', workId);

    if (error) {
      logger.error(methodName, `Error updating work ${workId} to ${renderStatus}:`, error);
    }
  } catch (error) {
    logger.error(methodName, 'Unexpected error updating render status:', error);
  }
};
