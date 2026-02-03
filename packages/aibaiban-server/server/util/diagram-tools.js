/**
 * Tool Calling 流程图生成器
 * 使用多步推理生成高质量的流程图
 */

// 布局常量
const LAYOUT = {
  MAIN_X: 500,
  START_Y: 80,
  STEP_SPACING: 150,
  ERROR_LEFT_X: 200,
  ERROR_RIGHT_X: 800,
  NODE_WIDTH: 180,
  NODE_HEIGHT: 80,
  ELLIPSE_WIDTH: 120,
  ELLIPSE_HEIGHT: 60,
  DIAMOND_WIDTH: 140,
  DIAMOND_HEIGHT: 80,
};

/**
 * 工具定义（给 AI 使用）
 */
const TOOLS = [
  {
    name: 'generate_flowchart_skeleton',
    description: '生成流程图骨架（节点列表，不包含坐标）。识别主流程步骤和判断节点，不要生成错误分支。返回节点数组。',
    parameters: {
      type: 'object',
      properties: {
        nodes: {
          type: 'array',
          description: '节点列表',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: '节点唯一标识符（驼峰命名），如 start, step1, judge1',
              },
              label: {
                type: 'string',
                description: '节点显示文本，支持 \\n 换行',
              },
              type: {
                type: 'string',
                enum: ['ellipse', 'rectangle', 'diamond'],
                description: 'ellipse=开始/结束, rectangle=处理步骤, diamond=判断节点',
              },
              color: {
                type: 'string',
                enum: ['blue', 'green', 'purple', 'orange', 'red', 'gray'],
                description: '节点颜色',
              },
            },
            required: ['id', 'label', 'type'],
          },
        },
        connections: {
          type: 'array',
          description: '主流程连接关系（不包含错误分支）',
          items: {
            type: 'object',
            properties: {
              from: { type: 'string', description: '起始节点 id' },
              to: { type: 'string', description: '目标节点 id' },
              label: { type: 'string', description: '连线标签' },
            },
            required: ['from', 'to'],
          },
        },
      },
      required: ['nodes', 'connections'],
    },
  },
  {
    name: 'add_error_branches',
    description: '为判断节点添加错误分支。输入已布局的图表，输出添加错误节点和回退连线后的图表。',
    parameters: {
      type: 'object',
      properties: {
        errorNodes: {
          type: 'array',
          description: '错误节点列表',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: '错误节点 id' },
              label: { type: 'string', description: '错误节点文本' },
              relatedJudgeId: { type: 'string', description: '对应的判断节点 id' },
              backToNodeId: { type: 'string', description: '回退到哪个输入节点的 id' },
            },
            required: ['id', 'label', 'relatedJudgeId', 'backToNodeId'],
          },
        },
      },
      required: ['errorNodes'],
    },
  },
  {
    name: 'finalize_diagram',
    description: '完成图表生成，返回最终的图表 JSON。调用此工具表示图表已生成完毕。',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: '图表标题',
        },
      },
    },
  },
];

/**
 * 工具执行函数
 */
const TOOL_FUNCTIONS = {
  /**
   * 生成流程图骨架
   */
  generate_flowchart_skeleton: async (args) => {
    console.log('[Tool] generate_flowchart_skeleton called');

    // 验证节点
    if (!args.nodes || !Array.isArray(args.nodes) || args.nodes.length === 0) {
      return { error: '需要至少一个节点' };
    }

    // 计算坐标（自动布局）
    const nodesWithCoords = calculateMainFlowLayout(args.nodes);

    // 添加主流程连线的 routing
    const connectionsWithRouting = args.connections.map((conn) => ({
      ...conn,
      routing: {
        exitSide: 'bottom',
        entrySide: 'top',
      },
    }));

    return {
      success: true,
      diagram: {
        type: 'flowchart',
        nodes: nodesWithCoords,
        connections: connectionsWithRouting,
      },
      message: `已生成 ${nodesWithCoords.length} 个节点的主流程骨架，所有节点已按垂直布局排列（x: ${LAYOUT.MAIN_X}）`,
    };
  },

  /**
   * 添加错误分支
   */
  add_error_branches: async (args, currentDiagram) => {
    console.log('[Tool] add_error_branches called');

    if (!args.errorNodes || !Array.isArray(args.errorNodes)) {
      return { error: '需要 errorNodes 数组' };
    }

    if (!currentDiagram || !currentDiagram.nodes) {
      return { error: '需要当前图表数据' };
    }

    // 创建节点查找表
    const nodeMap = {};
    currentDiagram.nodes.forEach((node) => {
      nodeMap[node.id] = node;
    });

    // 添加错误节点
    const newErrorNodes = [];
    const newConnections = [];

    args.errorNodes.forEach((errorSpec, index) => {
      const judgeNode = nodeMap[errorSpec.relatedJudgeId];
      const backToNode = nodeMap[errorSpec.backToNodeId];

      if (!judgeNode) {
        console.warn(`[Tool] 判断节点未找到: ${errorSpec.relatedJudgeId}`);
        return;
      }
      if (!backToNode) {
        console.warn(`[Tool] 回退目标节点未找到: ${errorSpec.backToNodeId}`);
        return;
      }

      // 创建错误节点（与判断节点同高度，在左侧）
      const errorNode = {
        id: errorSpec.id,
        label: errorSpec.label,
        type: 'rectangle',
        color: 'red',
        x: index % 2 === 0 ? LAYOUT.ERROR_LEFT_X : LAYOUT.ERROR_RIGHT_X, // 交替左右
        y: judgeNode.y,
        width: LAYOUT.DIAMOND_WIDTH,
        height: LAYOUT.NODE_HEIGHT,
      };

      newErrorNodes.push(errorNode);

      // 添加判断节点 → 错误节点的连线
      const errorBranchConnection = {
        from: errorSpec.relatedJudgeId,
        to: errorSpec.id,
        label: '失败',
        routing: {
          exitSide: errorNode.x < judgeNode.x ? 'left' : 'right',
          exitRatio: 0.5,
          entrySide: errorNode.x < judgeNode.x ? 'right' : 'left',
        },
      };

      newConnections.push(errorBranchConnection);

      // 添加错误节点 → 输入节点的回退连线
      const backConnection = {
        from: errorSpec.id,
        to: errorSpec.backToNodeId,
        label: '重新输入',
        routing: {
          exitSide: 'top', // 从错误节点顶部出
          exitRatio: 0.5,
          entrySide: errorNode.x < backToNode.x ? 'left' : 'right', // 进入输入节点左侧或右侧
          entryRatio: 0.5,
        },
      };

      newConnections.push(backConnection);
    });

    // 合并到当前图表
    const updatedDiagram = {
      ...currentDiagram,
      nodes: [...currentDiagram.nodes, ...newErrorNodes],
      connections: [...currentDiagram.connections, ...newConnections],
    };

    return {
      success: true,
      diagram: updatedDiagram,
      message: `已添加 ${newErrorNodes.length} 个错误分支，包含回退连线`,
    };
  },

  /**
   * 完成图表生成
   */
  finalize_diagram: async (args, currentDiagram) => {
    console.log('[Tool] finalize_diagram called');

    if (!currentDiagram) {
      return { error: '图表数据为空' };
    }

    // 最终验证
    const validation = validateDiagram(currentDiagram);

    if (!validation.valid) {
      return {
        success: false,
        errors: validation.errors,
        message: '图表验证失败',
      };
    }

    return {
      success: true,
      diagram: {
        ...currentDiagram,
        title: args.title || '流程图',
      },
      message: '图表生成完成',
    };
  },
};

/**
 * 计算主流程节点布局
 */
function calculateMainFlowLayout(nodes) {
  return nodes.map((node, index) => {
    // 强制 x 坐标
    const x = LAYOUT.MAIN_X;

    // 强制 y 坐标（等间距）
    const y = LAYOUT.START_Y + index * LAYOUT.STEP_SPACING;

    // 强制宽高
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
      x,
      y,
      width,
      height,
    };
  });
}

/**
 * 验证图表
 */
function validateDiagram(diagram) {
  const errors = [];

  // 检查节点坐标范围
  diagram.nodes.forEach((node) => {
    if (node.x < 40 || node.x > 1160) {
      errors.push(`节点 ${node.id} 的 x 坐标超出范围: ${node.x}`);
    }
    if (node.y < 40 || node.y > 1500) {
      errors.push(`节点 ${node.id} 的 y 坐标超出范围: ${node.y}`);
    }
  });

  // 检查连线引用
  const nodeIds = new Set(diagram.nodes.map((n) => n.id));
  diagram.connections.forEach((conn, index) => {
    if (!nodeIds.has(conn.from)) {
      errors.push(`连线 ${index} 的起始节点不存在: ${conn.from}`);
    }
    if (!nodeIds.has(conn.to)) {
      errors.push(`连线 ${index} 的目标节点不存在: ${conn.to}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  TOOLS,
  TOOL_FUNCTIONS,
};
