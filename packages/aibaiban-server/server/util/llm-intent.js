// path
const path = require('path');
const { readFile } = require('qiao-file');

// z
// const { z } = require('zod');
// const { zodToJsonSchema } = require('zod-to-json-schema');

// llm
const { GeminiVertex } = require('viho-llm');

// gemini
const gemini = GeminiVertex({
  projectId: global.QZ_CONFIG.gemini.projectId,
  location: global.QZ_CONFIG.gemini.location,
  modelName: global.QZ_CONFIG.gemini.modelName,
});

// ==================== 缓存（懒加载） ====================

let cachedSystemPrompt = null;

// ==================== 懒加载函数 ====================

/**
 * 获取系统提示词（懒加载+缓存）
 */
async function getSystemPrompt(promptPath) {
  if (!cachedSystemPrompt) cachedSystemPrompt = await readFile(path.resolve(__dirname, promptPath));
  return cachedSystemPrompt;
}

// ==================== 主要功能 ====================

/**
 * chatWithStreaming
 * @param {*} userPrompts
 * @param {*} callbackOptions
 */
exports.chatWithStreaming = async (userPrompts, callbackOptions) => {
  // 懒加载：第一次使用时加载并缓存
  const systemPrompt = await getSystemPrompt('./prompt-intent.md');

  // chat options
  const chatOptions = {
    contents: userPrompts,
    systemInstruction: systemPrompt,
    config: {
      // responseMimeType: 'application/json',
      // responseJsonSchema: compiledSchema,
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

  // Send a chat message with streaming
  await gemini.chatWithStreaming(chatOptions, callbackOptions);
};
