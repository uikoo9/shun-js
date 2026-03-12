// llm
const { OpenAIAPI } = require('viho-llm');

/**
 * LLM 配置 - 使用 moonshot 平台的 kimi-k2.5
 */
const llmConfig = {
  apiKey: global.QZ_CONFIG.kimi.apiKey,
  baseURL: global.QZ_CONFIG.kimi.baseURL,
  modelName: global.QZ_CONFIG.kimi.modelID,
};

const llm = OpenAIAPI(llmConfig);

/**
 * 从文本中提取 JSON
 */
function extractJSON(text) {
  const cleaned = text.replace(/\{\{/g, '{').replace(/\}\}/g, '}');
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // try next
  }
  const codeBlock = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) {
    try {
      return JSON.parse(codeBlock[1].trim());
    } catch (e) {
      // try next
    }
  }
  const match = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (match) {
    try {
      return JSON.parse(match[1]);
    } catch (e) {
      // try next
    }
  }
  throw new Error(`Cannot extract JSON from: ${text.slice(0, 200)}`);
}

/**
 * 流式调用 LLM 并解析 JSON
 * 使用非流式 API，但过程流式输出给客户端
 */
exports.callLLMForJSON = async (prompt, res, step) => {
  // 非流式调用，等待完整响应
  const response = await llm.chat({
    model: llmConfig.modelName,
    messages: [{ role: 'user', content: prompt }],
  });

  const fullContent = response.content || '';
  // 流式输出给客户端
  res.streaming(`data: ${JSON.stringify({ step, delta: fullContent })}\n\n`);

  return extractJSON(fullContent);
};

/**
 * 流式调用 LLM（普通文本）
 */
exports.callLLM = async (prompt, res, step) => {
  let fullContent = '';

  await llm.chatWithStreaming(
    { model: llmConfig.modelName, messages: [{ role: 'user', content: prompt }] },
    {
      contentCallback: (chunk) => {
        fullContent += chunk;
        // 直接流式返回给客户端
        res.streaming(`data: ${JSON.stringify({ step, delta: chunk })}\n\n`);
      },
    },
  );

  // 返回完整内容（用于后续处理）
  return fullContent;
};
