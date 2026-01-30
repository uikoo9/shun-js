// supabase
const { createClient } = require('@supabase/supabase-js');

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
    // supabase
    const supabase = createClient(global.QZ_CONFIG.SUPABASE_URL, global.QZ_CONFIG.SUPABASE_SERVICE_KEY);

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
