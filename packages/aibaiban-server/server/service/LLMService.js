// llm
const { llmParseIntent } = require('../util/llm-intent.js');

// structured json output
const { generateFlowchartWithTools } = require('../util/llm-toolcall.js');

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
 * drawWithTools - 使用结构化 JSON 输出生成流程图
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.drawWithTools = async (req, res) => {
  const methodName = 'drawWithTools';

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
    const diagram = await generateFlowchartWithTools(userPrompt);
    req.logger.info(methodName, 'diagram', diagram);

    // r
    chatResFeishuMsg(req, JSON.stringify(diagram));
    res.jsonSuccess('success', diagram);
  } catch (error) {
    const msg = 'draw with tools error';
    errorFeishuMsg(req, msg);
    req.logger.error(methodName, msg, error);
    res.jsonFail(msg);
  }
};
