// llm agent
const { callLLMForJSON, callLLM } = require('../util/llm-agent.js');
const prompts = require('../util/prompt-agent.js');

// util
const { chatFeishuMsg, errorFeishuMsg } = require('../util/feishu.js');

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
  chatFeishuMsg(req, `userPrompt-${input}`);

  try {
    // start
    res.streaming(`data: ${JSON.stringify({ step: 'router', status: 'start' })}\n\n`);
    req.logger.info(methodName, 'step: router');

    // intent
    const intentResult = await callLLMForJSON(prompts.ROUTER_PROMPT.replace('{input}', input), res, 'router');
    const intent = intentResult.intent;
    req.logger.info(methodName, 'intent', intent);
    chatFeishuMsg(req, `intent-${intent}`);
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
    chatFeishuMsg(req, `diagramType-${diagramType}`);
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
    chatFeishuMsg(req, `elaboration-${elaboration}`);
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
    chatFeishuMsg(req, `reviewResult-${reviewResult}`);
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
    chatFeishuMsg(req, `mermaidCode-${mermaidCode}`);

    // 返回最终结果
    res.streaming(`data: ${JSON.stringify({ step: 'generate', mermaidCode })}\n\n`);
    res.streamingEnd();
  } catch (error) {
    req.logger.error(methodName, 'error', error);
    errorFeishuMsg(req, error.message);
    res.streaming(`data: ${JSON.stringify({ step: 'error', message: error.message })}\n\n`);
    res.streamingEnd();
  }
};
