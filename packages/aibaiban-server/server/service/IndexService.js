// llm
const { chatWithStreaming } = require('../util/llm.js');

// util
const { chatFeishuMsg, errorFeishuMsg } = require('../util/feishu.js');

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
 * chat
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.chat = async (req, res) => {
  const methodName = 'chat';

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
  chatFeishuMsg(req);

  // go
  try {
    const userPrompts = [{ text: userPrompt }];
    chatWithStreaming(userPrompts, {
      beginCallback: () => {
        console.log('Stream started...');
      },
      firstContentCallback: () => {
        console.log('First chunk received!');
      },
      contentCallback: (content) => {
        process.stdout.write(content);
      },
      endCallback: () => {
        console.log('\nStream ended.');
      },
      errorCallback: (error) => {
        console.error('Error:', error);
      },
    });

    // r
    res.jsonSuccess('success');
  } catch (error) {
    const msg = 'chat error';
    errorFeishuMsg(req, msg);
    req.logger.error(methodName, msg, error);
    res.jsonFail(msg);
  }
};
