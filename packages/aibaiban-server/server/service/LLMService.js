// llm
const { llmParseIntent, llmGetDrawJson } = require('../util/llm.js');

// util
const { chatFeishuMsg, chatResFeishuMsg, errorFeishuMsg } = require('../util/feishu.js');

/**
 * intent
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.intent = async (req, res) => {
  const methodName = 'intent';

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
    const msg = 'parse intent error';
    errorFeishuMsg(req, msg);
    req.logger.error(methodName, msg, error);
    res.jsonFail(msg);
  }
};

/**
 * draw
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.draw = async (req, res) => {
  const methodName = 'draw';

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
    const llmGetDrawJsonRes = await llmGetDrawJson(userPrompt);
    const llmGetDrawJsonObj = JSON.parse(llmGetDrawJsonRes);
    req.logger.info(methodName, 'llmGetDrawJsonObj', llmGetDrawJsonObj);

    // r
    chatResFeishuMsg(req, JSON.stringify(llmGetDrawJsonObj));
    res.jsonSuccess('success', llmGetDrawJsonObj);
  } catch (error) {
    const msg = 'draw json error';
    errorFeishuMsg(req, msg);
    req.logger.error(methodName, msg, error);
    res.jsonFail(msg);
  }
};
