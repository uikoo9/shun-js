// http
const { createServer } = require('http');

// ws
const { Server } = require('socket.io');

// config
const { parseServerConfig } = require('@shun-js/shun-config');

// go
(async () => {
  // config
  const config = await parseServerConfig(process.argv);
  if (!config) {
    console.log('read server config fail');
    return;
  }

  // http server
  const PORT = config.port;
  const httpServer = createServer();

  // ws
  const io = new Server(httpServer, {
    cors: {
      origin: 'https://www.webcc.dev',
      methods: ['GET', 'POST'],
    },
    path: '/ws',
  });

  // Room 管理
  // rooms: Map<token, { cliSocket: Socket, browserSockets: Socket[], createdAt: number }>
  const rooms = new Map();
  console.log('[Server] Starting WebSocket server...');
  console.log(`[Server] Port: ${PORT}`);

  // 连接事件
  io.on('connection', (socket) => {
    console.log('[Server] New connection:', socket.id);

    // 注册事件
    socket.on('register', ({ type, token }) => {
      console.log(`[Server] Register request: type=${type}, token=${token}, socketId=${socket.id}`);

      if (type === 'cli') {
        // CLI 连接
        handleCliRegister(socket, token);
      } else if (type === 'browser') {
        // 浏览器连接
        handleBrowserRegister(socket, token);
      } else {
        console.log(`[Server] Invalid type: ${type}`);
        socket.emit('error', { message: 'Invalid type' });
        socket.disconnect();
      }
    });

    // Browser → CLI: 转发用户输入
    socket.on('cli-input', ({ token, data }) => {
      const room = rooms.get(token);
      if (room && room.cliSocket) {
        room.cliSocket.emit('cli-input', { data });
      } else {
        console.log(`[Server] cli-input: Room not found or CLI not connected for token=${token}`);
      }
    });

    // CLI → Browser: 广播 CLI 输出
    socket.on('cli-output', ({ token, data }) => {
      const room = rooms.get(token);
      if (room) {
        room.browserSockets.forEach((bs) => {
          bs.emit('cli-output', { data });
        });
      } else {
        console.log(`[Server] cli-output: Room not found for token=${token}`);
      }
    });
  });

  /**
   * 处理 CLI 注册
   */
  function handleCliRegister(socket, token) {
    // 检查 token 是否已被使用
    if (rooms.has(token)) {
      const room = rooms.get(token);
      if (room.cliSocket) {
        console.log(`[Server] Token already in use: ${token}`);
        socket.emit('error', { message: 'Token already in use by another CLI' });
        socket.disconnect();
        return;
      }
    } else {
      // 创建新 room
      rooms.set(token, {
        cliSocket: null,
        browserSockets: [],
        createdAt: Date.now(),
      });
      console.log(`[Server] Room created: token=${token}`);
    }

    const room = rooms.get(token);
    room.cliSocket = socket;
    socket.join(token);

    // 返回注册成功
    const publicUrl = `https://www.webcc.dev/${token}`;
    socket.emit('registered', { token, publicUrl });
    console.log(`[Server] CLI registered: token=${token}, url=${publicUrl}`);

    // CLI 断开时清理
    socket.on('disconnect', () => {
      console.log(`[Server] CLI disconnected: token=${token}`);
      if (room.cliSocket === socket) {
        room.cliSocket = null;

        // 通知所有浏览器 CLI 已断开
        room.browserSockets.forEach((bs) => {
          bs.emit('cli-disconnected');
        });

        // 如果没有浏览器连接，删除 room
        if (room.browserSockets.length === 0) {
          rooms.delete(token);
          console.log(`[Server] Room deleted: token=${token}`);
        }
      }
    });
  }

  /**
   * 处理浏览器注册
   */
  function handleBrowserRegister(socket, token) {
    const room = rooms.get(token);

    // 检查 room 是否存在且 CLI 是否在线
    if (!room) {
      console.log(`[Server] Browser register failed: Room not found for token=${token}`);
      socket.emit('error', {
        message: 'Invalid token or CLI not connected',
      });
      socket.disconnect();
      return;
    }

    if (!room.cliSocket) {
      console.log(`[Server] Browser register failed: CLI not connected for token=${token}`);
      socket.emit('error', {
        message: 'CLI not connected',
      });
      socket.disconnect();
      return;
    }

    // 将浏览器 socket 加入 room
    room.browserSockets.push(socket);
    socket.join(token);

    // 返回注册成功
    socket.emit('registered', { token });
    console.log(`[Server] Browser connected: token=${token}, total browsers=${room.browserSockets.length}`);

    // 浏览器断开时清理
    socket.on('disconnect', () => {
      console.log(`[Server] Browser disconnected: token=${token}`);
      const index = room.browserSockets.indexOf(socket);
      if (index > -1) {
        room.browserSockets.splice(index, 1);
        console.log(`[Server] Browser removed from room: token=${token}, remaining=${room.browserSockets.length}`);
      }

      // 如果没有浏览器连接且 CLI 已断开，删除 room
      if (room.browserSockets.length === 0 && !room.cliSocket) {
        rooms.delete(token);
        console.log(`[Server] Room deleted: token=${token}`);
      }
    });
  }

  // 启动服务器
  httpServer.listen(PORT, () => {
    console.log(`[Server] ✓ WebSocket server running on port ${PORT}`);
    console.log(`[Server] ✓ Path: /ws`);
    console.log('[Server] Ready to accept connections');
  });

  // 优雅退出
  process.on('SIGTERM', () => {
    console.log('[Server] SIGTERM received, closing server...');
    httpServer.close(() => {
      console.log('[Server] Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('\n[Server] SIGINT received, closing server...');
    httpServer.close(() => {
      console.log('[Server] Server closed');
      process.exit(0);
    });
  });

  // 错误处理
  process.on('uncaughtException', (error) => {
    console.error('[Server] Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('[Server] Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
})();
