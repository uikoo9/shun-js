// fetch
import { postWithToken } from '@util/fetch.js';

/**
 * genChart
 * @returns
 */
export const genChart = async (userPrompt) => {
  return await postWithToken('/chart', {
    userPrompt: userPrompt,
  });
};
