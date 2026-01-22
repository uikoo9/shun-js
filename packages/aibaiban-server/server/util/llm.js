// path
const path = require('path');
const { readFile } = require('qiao-file');

// z
const { z } = require('zod');
const { zodToJsonSchema } = require('zod-to-json-schema');

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
let cachedCompiledSchema = null;

// ==================== JSON Schema 定义（只构建一次）====================

const jsonSchema = (() => {
  const DiagramNodeSchema = z.object({
    id: z.string().describe('节点唯一标识符，使用驼峰命名法，如 userService, mysqlDB'),
    label: z.string().describe('节点显示文本，支持 \\n 换行'),
    type: z
      .enum(['rectangle', 'ellipse', 'diamond', 'hexagon', 'cylinder', 'cloud'])
      .optional()
      .describe('形状类型，默认 rectangle'),
    color: z
      .enum(['blue', 'green', 'purple', 'orange', 'red', 'gray', 'yellow', 'pink', 'black'])
      .optional()
      .describe('节点颜色，默认 blue'),
    x: z.number().optional().describe('X 坐标，不指定则自动布局'),
    y: z.number().optional().describe('Y 坐标，不指定则自动布局'),
    width: z.number().optional().describe('宽度，不指定则使用默认值'),
    height: z.number().optional().describe('高度，不指定则使用默认值'),
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
    x: z.number().optional().describe('X 坐标'),
    y: z.number().optional().describe('Y 坐标'),
    width: z.number().optional().describe('宽度'),
    height: z.number().optional().describe('高度'),
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

  const FreedrawElementSchema = z.object({
    id: z.string().describe('手绘元素唯一标识符'),
    points: z.array(z.tuple([z.number(), z.number()])).describe('路径点坐标数组'),
    color: z.string().optional().describe('线条颜色'),
    strokeWidth: z.number().optional().describe('线条宽度'),
  });

  const SimplifiedDiagramSchema = z.object({
    type: z
      .enum(['architecture', 'flowchart', 'sequence', 'custom'])
      .describe('图表类型：architecture=架构图，flowchart=流程图，sequence=时序图，custom=自定义'),
    title: z.string().optional().describe('图表标题'),
    nodes: z.array(DiagramNodeSchema).describe('节点列表，至少包含一个节点'),
    connections: z.array(DiagramConnectionSchema).describe('连接关系列表'),
    annotations: z.array(TextAnnotationSchema).optional().describe('独立文本标注列表（可选）'),
    frames: z.array(FrameSchema).optional().describe('分组框架列表（可选）'),
    images: z.array(ImageElementSchema).optional().describe('图片元素列表（可选）'),
    freedraws: z.array(FreedrawElementSchema).optional().describe('手绘元素列表（可选）'),
  });

  const DiagramErrorSchema = z.object({
    type: z.literal('error').describe('固定值：error'),
    error: z.enum(['NON_DRAWING_REQUEST', 'INVALID_REQUEST', 'UNKNOWN_ERROR']).describe('错误类型'),
    message: z.string().describe('错误提示消息，必须使用固定的友好提示文本'),
  });

  return z.discriminatedUnion('type', [SimplifiedDiagramSchema, DiagramErrorSchema]);
})();

// ==================== 懒加载函数 ====================

/**
 * 获取系统提示词（懒加载+缓存）
 */
async function getSystemPrompt() {
  if (!cachedSystemPrompt) {
    const promptPath = path.resolve(__dirname, './prompt.md');
    cachedSystemPrompt = await readFile(promptPath);
  }
  return cachedSystemPrompt;
}

/**
 * 获取编译后的 JSON Schema（懒加载+缓存）
 */
function getCompiledSchema() {
  if (!cachedCompiledSchema) {
    cachedCompiledSchema = zodToJsonSchema(jsonSchema, {
      name: 'AIResponse',
      $refStrategy: 'none',
    });
  }
  return cachedCompiledSchema;
}

// ==================== 主要功能 ====================

/**
 * chatWithStreaming
 * @param {*} userPrompts
 * @param {*} callbackOptions
 */
exports.chatWithStreaming = async (userPrompts, callbackOptions) => {
  // 懒加载：第一次使用时加载并缓存
  const systemPrompt = await getSystemPrompt();
  const compiledSchema = getCompiledSchema();

  // chat options
  const chatOptions = {
    contents: userPrompts,
    systemInstruction: systemPrompt,
    config: {
      responseMimeType: 'application/json',
      responseJsonSchema: compiledSchema,
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
