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
  const userPrompts = [{ text: userPrompt }];
  chatWithStreaming(userPrompts, {
    beginCallback: () => {
      req.logger.info(methodName, 'beginCallback');
      res.streamingStart();
    },
    firstContentCallback: () => {
      req.logger.info(methodName, 'firstContentCallback');
      // res.streaming('First chunk received!');
    },
    contentCallback: (content) => {
      req.logger.info(methodName, 'contentCallback', content);
      res.streaming(content);
    },
    endCallback: () => {
      req.logger.info(methodName, 'endCallback');
      res.streamingEnd();
    },
    errorCallback: (error) => {
      errorFeishuMsg(req, 'errorCallback');
      req.logger.info(methodName, 'errorCallback', error);
      res.streamingEnd();
    },
  });
};
