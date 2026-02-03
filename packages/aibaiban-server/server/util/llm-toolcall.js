/**
 * Tool Calling 流程图生成器 - 主流程
 */

// path
const path = require('path');
const { readFile } = require('qiao-file');

// 直接使用 @google/genai，绕过 viho-llm
const { GoogleGenAI } = require('@google/genai');

// gemini client（直接创建）
const geminiClient = new GoogleGenAI({
  vertexai: true,
  project: global.QZ_CONFIG.gemini.projectId,
  location: global.QZ_CONFIG.gemini.location,
});

const modelName = global.QZ_CONFIG.gemini.modelName;

// const
const chatConfig = {
  temperature: 0.3,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 8192,
};

/**
 * 使用结构化输出生成流程图
 * @param {string} userPrompt - 用户需求
 * @returns {Object} - SimplifiedDiagram
 */
exports.generateFlowchartWithTools = async (userPrompt) => {
  console.log('[ToolCall] Starting flowchart generation');
  console.log('[ToolCall] User prompt:', userPrompt);

  // 加载系统提示词
  let systemPromptText = await readFile(path.resolve(__dirname, './prompt-toolcall.md'));

  // 确保是字符串格式
  if (Buffer.isBuffer(systemPromptText)) {
    systemPromptText = systemPromptText.toString('utf-8');
  }

  console.log('[ToolCall] System prompt loaded, length:', systemPromptText.length);

  try {
    // 调用 AI 生成 JSON
    const chatOptions = {
      model: modelName,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${systemPromptText}\n\n---\n\n用户需求：${userPrompt}\n\n请只返回 JSON 对象，不要有任何其他说明文字。`,
            },
          ],
        },
      ],
      config: chatConfig,
    };

    const response = await geminiClient.models.generateContent(chatOptions);

    // 打印原始响应（调试用）
    console.log('[ToolCall] Raw response:', JSON.stringify(response, null, 2));

    // 检查响应
    if (!response || !response.candidates || response.candidates.length === 0) {
      console.error('[ToolCall] Invalid response format');
      return { type: 'flowchart', nodes: [], connections: [], error: '响应格式错误' };
    }

    const candidate = response.candidates[0];
    const content = candidate.content;

    if (!content || !content.parts || content.parts.length === 0) {
      console.error('[ToolCall] No content parts in response');
      return { type: 'flowchart', nodes: [], connections: [], error: '无响应内容' };
    }

    // 提取文本
    let responseText = '';
    for (const part of content.parts) {
      if (part.text) {
        responseText += part.text;
      }
    }

    console.log('[ToolCall] Response text length:', responseText.length);

    // 尝试提取 JSON（可能被包裹在 markdown 代码块中）
    let jsonText = responseText.trim();

    // 移除可能的 markdown 代码块标记
    const jsonMatch = jsonText.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim();
    }

    // 解析 JSON
    let diagramData;
    try {
      diagramData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('[ToolCall] JSON parse error:', parseError);
      console.error('[ToolCall] JSON text:', jsonText.substring(0, 500));
      return { type: 'flowchart', nodes: [], connections: [], error: 'JSON 解析失败' };
    }

    // 验证数据结构
    if (!diagramData.nodes || !Array.isArray(diagramData.nodes)) {
      console.error('[ToolCall] Invalid diagram data: missing nodes array');
      return { type: 'flowchart', nodes: [], connections: [], error: '缺少节点数据' };
    }

    if (!diagramData.connections || !Array.isArray(diagramData.connections)) {
      console.error('[ToolCall] Invalid diagram data: missing connections array');
      return { type: 'flowchart', nodes: [], connections: [], error: '缺少连接数据' };
    }

    console.log(
      `[ToolCall] Parsed diagram: ${diagramData.nodes.length} nodes, ${diagramData.connections.length} connections`,
    );

    // 应用布局计算
    const nodesWithLayout = calculateMainFlowLayout(diagramData.nodes);

    // 创建节点位置查找表
    const nodeMap = {};
    nodesWithLayout.forEach((node) => {
      nodeMap[node.id] = node;
    });

    // 添加连线路由（智能识别连线类型）
    const connectionsWithRouting = diagramData.connections.map((conn) => {
      const fromNode = nodeMap[conn.from];
      const toNode = nodeMap[conn.to];

      if (!fromNode || !toNode) {
        // 节点不存在，使用默认路由
        return {
          ...conn,
          routing: {
            exitSide: 'bottom',
            entrySide: 'top',
          },
        };
      }

      // 判断连线类型
      const isErrorBranch = toNode.color === 'red'; // 判断节点 -> 错误节点
      const isBackwardFlow = toNode.y < fromNode.y; // 回退连线（向上）
      const isHorizontal = Math.abs(fromNode.x - toNode.x) > 100; // 水平偏移较大

      let routing;

      if (isErrorBranch) {
        // 错误分支：从判断节点左侧或右侧出去
        routing = {
          exitSide: toNode.x < fromNode.x ? 'left' : 'right',
          exitRatio: 0.5,
          entrySide: toNode.x < fromNode.x ? 'right' : 'left',
          entryRatio: 0.5,
        };
      } else if (isBackwardFlow) {
        // 回退连线：从错误节点顶部出去，进入输入节点左侧或右侧
        routing = {
          exitSide: 'top',
          exitRatio: 0.5,
          entrySide: toNode.x < fromNode.x ? 'right' : 'left',
          entryRatio: 0.5,
        };
      } else if (isHorizontal) {
        // 水平连线
        routing = {
          exitSide: toNode.x < fromNode.x ? 'left' : 'right',
          exitRatio: 0.5,
          entrySide: toNode.x < fromNode.x ? 'right' : 'left',
          entryRatio: 0.5,
        };
      } else {
        // 默认：垂直连线（主流程）
        routing = {
          exitSide: 'bottom',
          entrySide: 'top',
        };
      }

      return {
        ...conn,
        routing,
      };
    });

    const finalDiagram = {
      type: 'flowchart',
      nodes: nodesWithLayout,
      connections: connectionsWithRouting,
    };

    console.log('[ToolCall] Diagram generation completed successfully');
    return finalDiagram;
  } catch (error) {
    console.error('[ToolCall] Error:', error);
    return { type: 'flowchart', nodes: [], connections: [], error: error.message };
  }
};

// 布局计算函数 - 智能识别分支结构
function calculateMainFlowLayout(nodes) {
  const LAYOUT = {
    MAIN_X: 500,
    ERROR_LEFT_X: 200,
    ERROR_RIGHT_X: 800,
    START_Y: 80,
    STEP_SPACING: 150,
    NODE_WIDTH: 180,
    NODE_HEIGHT: 80,
    ELLIPSE_WIDTH: 120,
    ELLIPSE_HEIGHT: 60,
    DIAMOND_WIDTH: 140,
    DIAMOND_HEIGHT: 80,
  };

  // 第1步：识别错误节点（color: red）
  const errorNodeIds = new Set();
  nodes.forEach((node) => {
    if (node.color === 'red') {
      errorNodeIds.add(node.id);
    }
  });

  console.log('[Layout] Error nodes:', Array.from(errorNodeIds));

  // 第2步：为主流程节点分配 y 坐标
  let mainFlowIndex = 0;
  const nodePositions = {};

  nodes.forEach((node) => {
    if (!errorNodeIds.has(node.id)) {
      // 主流程节点
      const y = LAYOUT.START_Y + mainFlowIndex * LAYOUT.STEP_SPACING;
      nodePositions[node.id] = {
        x: LAYOUT.MAIN_X,
        y: y,
        isMainFlow: true,
      };
      mainFlowIndex++;
    }
  });

  // 第3步：为错误节点分配位置（与判断节点同高，但在左侧或右侧）
  let errorLeftIndex = 0;
  let errorRightIndex = 0;

  nodes.forEach((node, index) => {
    if (errorNodeIds.has(node.id)) {
      // 尝试找到前面最近的判断节点
      let judgeNodeY = LAYOUT.START_Y + index * LAYOUT.STEP_SPACING;
      for (let i = index - 1; i >= 0; i--) {
        const prevNode = nodes[i];
        if (prevNode.type === 'diamond' && nodePositions[prevNode.id]) {
          judgeNodeY = nodePositions[prevNode.id].y;
          break;
        }
      }

      // 交替放置在左侧和右侧
      const isLeft = errorLeftIndex <= errorRightIndex;
      const x = isLeft ? LAYOUT.ERROR_LEFT_X : LAYOUT.ERROR_RIGHT_X;

      if (isLeft) {
        errorLeftIndex++;
      } else {
        errorRightIndex++;
      }

      nodePositions[node.id] = {
        x: x,
        y: judgeNodeY,
        isMainFlow: false,
      };
    }
  });

  // 第4步：应用位置和尺寸
  return nodes.map((node) => {
    const pos = nodePositions[node.id];

    // 宽高
    let width, height;
    if (node.type === 'ellipse') {
      width = LAYOUT.ELLIPSE_WIDTH;
      height = LAYOUT.ELLIPSE_HEIGHT;
    } else if (node.type === 'diamond') {
      width = LAYOUT.DIAMOND_WIDTH;
      height = LAYOUT.DIAMOND_HEIGHT;
    } else {
      width = LAYOUT.NODE_WIDTH;
      height = LAYOUT.NODE_HEIGHT;
    }

    return {
      ...node,
      x: pos.x,
      y: pos.y,
      width,
      height,
    };
  });
}
