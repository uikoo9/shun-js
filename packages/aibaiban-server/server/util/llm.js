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
let cachedSystemPrompt = null;
const jsonSchema = (() => {
  return zodToJsonSchema(
    z.object({
      intent: z.enum(['DRAW', 'REJECT']).describe('用户意图：DRAW（绘图）或 REJECT（非绘图）'),
      reason: z.string().describe('判断理由（一句话说明）'),
    }),
  );
})();

/**
 * llmParseIntent
 * @param {*} userPrompts
 */
exports.llmParseIntent = async (userPrompts) => {
  // cache
  if (!cachedSystemPrompt) cachedSystemPrompt = await readFile(path.resolve(__dirname, './prompt-intent.md'));

  // chat options
  const chatOptions = {
    contents: userPrompts,
    systemInstruction: cachedSystemPrompt,
    config: {
      responseMimeType: 'application/json',
      responseJsonSchema: jsonSchema,
      temperature: 0.2,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 8192,
      thinkingConfig: {
        thinkingBudget: 0,
        includeThoughts: false,
      },
      safetySettings: [
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
      ],
    },
  };

  // go
  return await gemini.chat(chatOptions);
};
