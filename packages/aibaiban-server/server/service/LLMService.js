// llm
const { llmParseIntent } = require('../util/llm-intent.js');

// structured json output
const { generateFlowchartWithTools } = require('../util/llm-toolcall.js');

// util
const { chatFeishuMsg, chatResFeishuMsg, errorFeishuMsg } = require('../util/feishu.js');

// llm agent
const { callLLMForJSON, callLLM } = require('../util/llm-agent.js');
const prompts = require('../util/prompt-agent.js');

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

/**
 * drawAgent - 流式 Agent 接口
 * 流程：router -> classify -> elaborate -> review -> generate
 */
exports.drawAgent = async (req, res) => {
  const methodName = 'drawAgent';

  // check
  if (!req.body.userPrompt) {
    const msg = 'need userPrompt';
    req.logger.error(methodName, msg);
    res.jsonFail(msg);
    return;
  }

  // 启动 SSE
  res.streamingStart();

  const input = decodeURIComponent(req.body.userPrompt);
  req.logger.info(methodName, 'userPrompt', input);

  try {
    // 1. router - 判断意图
    res.streaming(`data: ${JSON.stringify({ step: 'router', status: 'start' })}\n\n`);
    req.logger.info(methodName, 'step: router');
    const intentResult = await callLLMForJSON(prompts.ROUTER_PROMPT.replace('{input}', input), res, 'router');
    const intent = intentResult.intent;
    req.logger.info(methodName, 'intent', intent);
    // 发送结果
    res.streaming(`data: ${JSON.stringify({ step: 'router', intent })}\n\n`);

    // 非白板请求
    if (intent === 'irrelevant') {
      res.streaming(
        `data: ${JSON.stringify({ step: 'router', result: 'irrelevant', response: prompts.FIXED_REPLY })}\n\n`,
      );
      res.streamingEnd();
      return;
    }

    // 2. classify - 分类图表类型
    res.streaming(`data: ${JSON.stringify({ step: 'classify', status: 'start' })}\n\n`);
    req.logger.info(methodName, 'step: classify');
    const classifyResult = await callLLMForJSON(prompts.CLASSIFY_PROMPT.replace('{input}', input), res, 'classify');
    const diagramType = classifyResult.diagramType;
    req.logger.info(methodName, 'diagramType', diagramType);
    // 发送结果
    res.streaming(`data: ${JSON.stringify({ step: 'classify', diagramType })}\n\n`);

    // 3. elaborate - 细化内容
    res.streaming(`data: ${JSON.stringify({ step: 'elaborate', status: 'start' })}\n\n`);
    req.logger.info(methodName, 'step: elaborate');
    const elaboration = await callLLM(
      prompts.ELABORATE_PROMPT.replace('{input}', input).replace('{diagramType}', diagramType),
      res,
      'elaborate',
    );
    req.logger.info(methodName, 'elaboration', elaboration.slice(0, 100) + '...');
    // 发送结果（不显示内容，只标记完成）
    res.streaming(`data: ${JSON.stringify({ step: 'elaborate', done: true })}\n\n`);

    // 4. review - 质量检查
    res.streaming(`data: ${JSON.stringify({ step: 'review', status: 'start' })}\n\n`);
    req.logger.info(methodName, 'step: review');
    const reviewResult = await callLLMForJSON(
      prompts.REVIEW_PROMPT.replace('{input}', input)
        .replace('{diagramType}', diagramType)
        .replace('{elaboration}', elaboration),
      res,
      'review',
    );
    req.logger.info(methodName, 'reviewResult', reviewResult);
    // 发送结果
    res.streaming(`data: ${JSON.stringify({ step: 'review', result: reviewResult.result })}\n\n`);

    // 信息不足，追问用户
    if (reviewResult.result === 'need_more_info') {
      res.streaming(
        `data: ${JSON.stringify({
          step: 'review',
          result: 'need_more_info',
          questions: reviewResult.questions,
        })}\n\n`,
      );
      res.streamingEnd();
      return;
    }

    // 5. generate - 生成 Mermaid
    res.streaming(`data: ${JSON.stringify({ step: 'generate', status: 'start' })}\n\n`);
    req.logger.info(methodName, 'step: generate');
    const mermaidCode = await callLLM(
      prompts.GENERATE_PROMPT.replace('{diagramType}', diagramType).replace('{elaboration}', elaboration),
      res,
      'generate',
    );

    req.logger.info(methodName, 'mermaidCode', mermaidCode.slice(0, 100) + '...');

    // 返回最终结果
    res.streaming(`data: ${JSON.stringify({ step: 'generate', mermaidCode })}\n\n`);
    res.streamingEnd();
  } catch (error) {
    req.logger.error(methodName, 'error', error);
    res.streaming(`data: ${JSON.stringify({ step: 'error', message: error.message })}\n\n`);
    res.streamingEnd();
  }
};
