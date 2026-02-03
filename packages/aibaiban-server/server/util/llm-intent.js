// path
const path = require('path');
const { readFile } = require('qiao-file');

// z
const { z } = require('zod');
const { zodToJsonSchema } = require('zod-to-json-schema');

// llm
const { GeminiVertex } = require('viho-llm');
const gemini = GeminiVertex({
  projectId: global.QZ_CONFIG.gemini.projectId,
  location: global.QZ_CONFIG.gemini.location,
  modelName: global.QZ_CONFIG.gemini.modelName,
});

// const
const chatConfig = {
  responseMimeType: 'application/json',
  temperature: 0.2, // 保持较低温度，确保输出稳定
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 8192, // 足够大以支持复杂图表
  thinkingConfig: {
    thinkingBudget: 0,
    includeThoughts: false,
  },
};
const safetySettings = [
  {
    category: 'HARM_CATEGORY_HATE_SPEECH',
    threshold: 'BLOCK_ONLY_HIGH',
  },
  {
    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
    threshold: 'BLOCK_ONLY_HIGH',
  },
  {
    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    threshold: 'BLOCK_ONLY_HIGH',
  },
  {
    category: 'HARM_CATEGORY_HARASSMENT',
    threshold: 'BLOCK_ONLY_HIGH',
  },
];

/**
 * llmParseIntent
 * @param {*} userPrompts
 */
let intentSystemPrompt = null;
exports.llmParseIntent = async (userPrompts) => {
  // intent system prompt - 支持版本切换
  if (!intentSystemPrompt) {
    const promptFile = './prompt-intent.md';
    intentSystemPrompt = await readFile(path.resolve(__dirname, promptFile));
  }

  // chat config - 新增 confidence 字段支持
  chatConfig.responseJsonSchema = zodToJsonSchema(
    z.object({
      intent: z.enum(['DRAW', 'REJECT']).describe('用户意图：DRAW（绘图）或 REJECT（非绘图）'),
      reason: z.string().describe('判断理由（一句话说明）'),
      confidence: z.number().min(0).max(1).optional().describe('置信度评分（0.0-1.0），可选字段'),
    }),
  );

  // chat options
  const chatOptions = {
    contents: userPrompts,
    systemInstruction: intentSystemPrompt,
    config: chatConfig,
    safetySettings: safetySettings,
  };

  // go
  return await gemini.chat(chatOptions);
};
