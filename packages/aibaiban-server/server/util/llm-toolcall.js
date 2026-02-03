/**
 * Tool Calling 流程图生成器 - 主流程
 */

// path
const path = require('path');
const { readFile } = require('qiao-file');

// llm
const { GeminiVertex } = require('viho-llm');

// tools
const { TOOLS, TOOL_FUNCTIONS } = require('./diagram-tools.js');

// gemini client
const gemini = GeminiVertex({
  projectId: global.QZ_CONFIG.gemini.projectId,
  location: global.QZ_CONFIG.gemini.location,
  modelName: global.QZ_CONFIG.gemini.modelName,
});

// const
const chatConfig = {
  temperature: 0.3, // 稍微提高一点，允许更灵活的思考
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 8192,
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
 * 使用 Tool Calling 生成流程图
 * @param {string} userPrompt - 用户需求
 * @returns {Object} - SimplifiedDiagram
 */
exports.generateFlowchartWithTools = async (userPrompt) => {
  console.log('[ToolCall] Starting flowchart generation with tools');
  console.log('[ToolCall] User prompt:', userPrompt);

  // 加载系统提示词
  let systemPrompt = await readFile(path.resolve(__dirname, './prompt-toolcall.md'));

  // 初始化对话历史
  const conversationHistory = [];
  let currentDiagram = null;
  let maxTurns = 10; // 最多 10 轮对话
  let turnCount = 0;

  try {
    // 第1步：用户输入
    conversationHistory.push({
      role: 'user',
      parts: [{ text: userPrompt }],
    });

    // 对话循环
    while (turnCount < maxTurns) {
      turnCount++;
      console.log(`\n[ToolCall] Turn ${turnCount}/${maxTurns}`);

      // 调用 AI（带 tools）
      const chatOptions = {
        contents: conversationHistory,
        systemInstruction: systemPrompt,
        config: chatConfig,
        safetySettings: safetySettings,
        tools: [{ functionDeclarations: TOOLS }], // ⭐ 关键：传入工具定义
      };

      const responseText = await gemini.chat(chatOptions);

      // 解析响应（可能包含 function call）
      const response = JSON.parse(responseText);
      console.log('[ToolCall] AI response:', JSON.stringify(response, null, 2));

      // 添加 AI 响应到历史
      conversationHistory.push({
        role: 'model',
        parts: [{ text: responseText }],
      });

      // 检查是否有 function call
      if (response.functionCall) {
        const functionCall = response.functionCall;
        const functionName = functionCall.name;
        const functionArgs = functionCall.args;

        console.log(`[ToolCall] AI called function: ${functionName}`);
        console.log(`[ToolCall] Function args:`, JSON.stringify(functionArgs, null, 2));

        // 执行工具函数
        const toolFunction = TOOL_FUNCTIONS[functionName];

        if (!toolFunction) {
          console.error(`[ToolCall] Unknown function: ${functionName}`);
          break;
        }

        const toolResult = await toolFunction(functionArgs, currentDiagram);
        console.log(`[ToolCall] Tool result:`, JSON.stringify(toolResult, null, 2));

        // 更新当前图表
        if (toolResult.diagram) {
          currentDiagram = toolResult.diagram;
        }

        // 将工具执行结果返回给 AI
        conversationHistory.push({
          role: 'function',
          parts: [
            {
              functionResponse: {
                name: functionName,
                response: toolResult,
              },
            },
          ],
        });

        // 如果是 finalize_diagram，表示完成
        if (functionName === 'finalize_diagram' && toolResult.success) {
          console.log('[ToolCall] Diagram generation completed');
          return currentDiagram;
        }
      } else if (response.text) {
        // AI 返回普通文本（可能是思考过程或完成提示）
        console.log('[ToolCall] AI text response:', response.text);

        // 如果没有 function call 且已有图表，认为完成
        if (currentDiagram) {
          console.log('[ToolCall] No more function calls, returning current diagram');
          return currentDiagram;
        }
      } else {
        console.warn('[ToolCall] Unexpected response format:', response);
        break;
      }
    }

    // 达到最大轮数
    if (turnCount >= maxTurns) {
      console.warn('[ToolCall] Reached max turns, returning current diagram');
      return currentDiagram || { type: 'flowchart', nodes: [], connections: [], error: '达到最大对话轮数' };
    }

    return currentDiagram || { type: 'flowchart', nodes: [], connections: [], error: '生成失败' };
  } catch (error) {
    console.error('[ToolCall] Error:', error);
    throw error;
  }
};
