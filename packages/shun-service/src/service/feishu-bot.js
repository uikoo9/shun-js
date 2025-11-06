// util
import { fetch } from '../util/fetch.js';

/**
 * feishuBot
 * @param {*} options
 * @returns
 */
export const feishuBot = async (options) => {
  // content
  const content = JSON.stringify({
    post: {
      zh_cn: {
        content: [
          [
            {
              tag: 'text',
              text: options.feishuMsg,
            },
          ],
        ],
      },
    },
  });

  return await fetch(options.url, {
    url: options.feishuUrl,
    content: content,
  });
};
