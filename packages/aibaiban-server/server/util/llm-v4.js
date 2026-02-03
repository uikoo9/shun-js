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

// 提示词版本配置（方便 A/B 测试）
const PROMPT_VERSION = global.QZ_CONFIG.gemini.PROMPT_VERSION || 'v5';
console.log(`[LLM] Using prompt version: ${PROMPT_VERSION}`);

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
    const promptFile = './prompt-intent-v2.md'; // 固定使用 v2 版本
    intentSystemPrompt = await readFile(path.resolve(__dirname, promptFile));
    console.log(`[LLM Intent] Loaded prompt: ${promptFile}`);
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

// draw json schema - 扩展支持 routing 字段
const drawJsonSchema = (() => {
  const DiagramNodeSchema = z.object({
    id: z.string().describe('节点唯一标识符，使用驼峰命名法，如 userService, mysqlDB'),
    label: z.string().describe('节点显示文本，支持 \\n 换行'),
    type: z
      .enum(['rectangle', 'ellipse', 'diamond'])
      .optional()
      .describe(
        '形状类型：rectangle=矩形（组件/服务）, ellipse=椭圆（数据库/云）, diamond=菱形（判断/中间件），默认 rectangle',
      ),
    color: z
      .enum(['blue', 'green', 'purple', 'orange', 'red', 'gray', 'yellow', 'pink', 'black'])
      .optional()
      .describe('节点颜色，默认 blue'),
    x: z.number().optional().describe('X 坐标（建议范围 40-1160），不指定则自动布局'),
    y: z.number().optional().describe('Y 坐标（建议范围 40-760），不指定则自动布局'),
    width: z.number().optional().describe('宽度（默认 140px），不指定则使用默认值'),
    height: z.number().optional().describe('高度（默认 80px），不指定则使用默认值'),
  });

  // ⭐ 新增：路由配置 Schema
  const RoutingSchema = z.object({
    exitSide: z.enum(['top', 'right', 'bottom', 'left']).optional().describe('连线从起始节点的哪个边出发'),
    exitRatio: z
      .number()
      .min(0)
      .max(1)
      .optional()
      .describe('出口在该边的位置比例（0.0-1.0），如 0.3 表示该边的 30% 位置'),
    entrySide: z.enum(['top', 'right', 'bottom', 'left']).optional().describe('连线进入目标节点的哪个边'),
    entryRatio: z
      .number()
      .min(0)
      .max(1)
      .optional()
      .describe('入口在该边的位置比例（0.0-1.0），如 0.7 表示该边的 70% 位置'),
    waypoints: z
      .array(
        z.object({
          x: z.number().describe('路径点 X 坐标'),
          y: z.number().describe('路径点 Y 坐标'),
        }),
      )
      .optional()
      .describe('中间路径点数组，用于复杂路由（绕过其他节点）'),
  });

  const DiagramConnectionSchema = z.object({
    from: z.string().describe('起始节点 id'),
    to: z.string().describe('目标节点 id'),
    label: z.string().optional().describe('连接线上的文字标签'),
    type: z.enum(['arrow', 'line']).optional().describe('连接类型：arrow=箭头线，line=直线，默认 arrow'),
    style: z
      .enum(['solid', 'dashed', 'dotted'])
      .optional()
      .describe('线条样式：solid=实线，dashed=虚线，dotted=点线，默认 solid'),
    // ⭐ 新增：routing 字段（防止连线重叠的关键）
    routing: RoutingSchema.optional().describe(
      '路由配置（可选但强烈推荐）：指定连线的出入边和位置，避免多条线重叠。' +
        '当多条线连接同一节点对时必须使用不同的 exitRatio/entryRatio。' +
        '双向连线必须使用相反的 exitSide/entrySide（如 A→B 用 right→left，B→A 用 left→right）',
    ),
  });

  const TextAnnotationSchema = z.object({
    id: z.string().describe('标注唯一标识符'),
    text: z.string().describe('标注文本内容'),
    x: z.number().optional().describe('X 坐标'),
    y: z.number().optional().describe('Y 坐标'),
    fontSize: z.number().optional().describe('字体大小'),
    color: z.string().optional().describe('文字颜色'),
  });

  const FrameSchema = z.object({
    id: z.string().describe('框架唯一标识符'),
    label: z.string().optional().describe('框架标题'),
    children: z.array(z.string()).describe('包含的节点 id 列表'),
    color: z.string().optional().describe('框架颜色'),
    x: z.number().optional().describe('Frame 左上角 X 坐标（必须完全包含所有子节点）'),
    y: z.number().optional().describe('Frame 左上角 Y 坐标'),
    width: z.number().optional().describe('Frame 宽度（建议：子节点宽度总和 + 内边距 80px）'),
    height: z.number().optional().describe('Frame 高度（建议：子节点高度总和 + 内边距 80px）'),
  });

  const ImageElementSchema = z.object({
    id: z.string().describe('图片唯一标识符'),
    imageUrl: z.string().url().describe('图片 URL'),
    alt: z.string().optional().describe('图片描述'),
    x: z.number().optional().describe('X 坐标'),
    y: z.number().optional().describe('Y 坐标'),
    width: z.number().optional().describe('宽度'),
    height: z.number().optional().describe('高度'),
  });

  // 注意：freedraws 使用简化格式，避免 tuple 导致的兼容性问题
  const FreedrawElementSchema = z.object({
    id: z.string().describe('手绘元素唯一标识符'),
    points: z.array(z.number()).describe('路径点坐标数组，格式：[x1,y1,x2,y2,...]'),
    color: z.string().optional().describe('线条颜色'),
    strokeWidth: z.number().optional().describe('线条宽度'),
  });

  // 图表响应 Schema（专注于绘图功能）
  // type 字段用于区分图表类型：architecture | flowchart | sequence | custom
  return z.object({
    // 图表类型
    type: z
      .enum(['architecture', 'flowchart', 'sequence', 'custom'])
      .describe('图表类型：architecture=架构图, flowchart=流程图, sequence=时序图, custom=自定义'),

    // 图表相关字段
    title: z.string().optional().describe('图表标题'),
    nodes: z.array(DiagramNodeSchema).describe('节点列表（必需）'),
    connections: z.array(DiagramConnectionSchema).describe('连接关系列表（必需）'),
    annotations: z.array(TextAnnotationSchema).optional().describe('独立文本标注列表（可选）'),
    frames: z.array(FrameSchema).optional().describe('分组框架列表（可选）'),
    images: z.array(ImageElementSchema).optional().describe('图片元素列表（可选）'),
    freedraws: z.array(FreedrawElementSchema).optional().describe('手绘元素列表（可选）'),
  });
})();

/**
 * llmGetDrawJson
 * @param {*} userPrompts
 */
let drawJsonPrompt = null;
exports.llmGetDrawJson = async (userPrompts) => {
  // draw json system prompt - 支持版本切换
  if (!drawJsonPrompt) {
    const promptFile =
      PROMPT_VERSION === 'v5'
        ? './prompt-draw-v5.md'
        : PROMPT_VERSION === 'v4'
          ? './prompt-draw-v4.md'
          : './prompt-draw.md';
    drawJsonPrompt = await readFile(path.resolve(__dirname, promptFile));
    console.log(`[LLM Draw] Loaded prompt: ${promptFile}`);
  }

  // chat config
  chatConfig.responseJsonSchema = zodToJsonSchema(drawJsonSchema);

  // chat options
  const chatOptions = {
    contents: userPrompts,
    systemInstruction: drawJsonPrompt,
    config: chatConfig,
    safetySettings: safetySettings,
  };

  // go
  return await gemini.chat(chatOptions);
};
