// llm
const { llmParseIntent } = require('../util/llm');

// util
const { chatFeishuMsg, chatResFeishuMsg, errorFeishuMsg } = require('../util/feishu.js');

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
    const llmParseIntentRes = await llmParseIntent(userPrompt);
    const llmParseIntentObj = JSON.parse(llmParseIntentRes);
    req.logger.info(methodName, 'llmParseIntentObj', llmParseIntentObj);

    // r
    chatResFeishuMsg(req, JSON.stringify(llmParseIntentObj));
    res.jsonSuccess('success', llmParseIntentObj);
  } catch (error) {
    const msg = 'chat error';
    errorFeishuMsg(req, msg);
    req.logger.error(methodName, msg, error);
    res.jsonFail(msg);
  }
};

/**
 * chatWithStreaming
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.chatWithStreaming = async () => {
  // const methodName = 'chatWithStreaming';
  // // check
  // if (!req.body.userPrompt) {
  //   const msg = 'need userPrompt';
  //   req.logger.error(methodName, msg);
  //   res.jsonFail(msg);
  //   return;
  // }
  // // const
  // const userPrompt = decodeURIComponent(req.body.userPrompt);
  // req.logger.info(methodName, 'userPrompt', userPrompt);
  // chatFeishuMsg(req);
  // // go
  // const userPrompts = [{ text: userPrompt }];
  // chatWithStreaming(userPrompts, {
  //   beginCallback: () => {
  //     req.logger.info(methodName, 'beginCallback');
  //     res.streamingStart();
  //   },
  //   firstContentCallback: () => {
  //     req.logger.info(methodName, 'firstContentCallback');
  //     // res.streaming('First chunk received!');
  //   },
  //   contentCallback: (content) => {
  //     req.logger.info(methodName, 'contentCallback', content);
  //     res.streaming(content);
  //   },
  //   endCallback: () => {
  //     req.logger.info(methodName, 'endCallback');
  //     res.streamingEnd();
  //   },
  //   errorCallback: (error) => {
  //     errorFeishuMsg(req, 'errorCallback');
  //     req.logger.info(methodName, 'errorCallback', error);
  //     res.streamingEnd();
  //   },
  // });
};
