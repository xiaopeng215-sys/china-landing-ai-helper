/**
 * WebSocket API 端点
 * 注意：Next.js App Router 不直接支持 WebSocket
 * 这个文件作为文档和示例，实际 WebSocket 服务器需要独立部署
 * 
 * 部署选项：
 * 1. 使用独立的 WebSocket 服务器 (推荐)
 * 2. 使用 Vercel Edge Functions + WebSocket
 * 3. 使用第三方服务 (Pusher, Ably, etc.)
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * WebSocket 服务器示例代码 (Node.js)
 * 
 * 保存为 separate-websocket-server.js 并独立运行：
 * 
 * ```bash
 * npm install ws
 * node separate-websocket-server.js
 * ```
 */

const websocketServerCode = `
const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server, path: '/ws' });

// 连接的客户端
const clients = new Map();

wss.on('connection', (ws, request) => {
  const clientId = \`client_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`;
  
  console.log(\`[WebSocket] Client connected: \${clientId}\`);
  clients.set(clientId, ws);

  // 发送欢迎消息
  ws.send(JSON.stringify({
    type: 'welcome',
    clientId,
    timestamp: Date.now(),
  }));

  // 处理客户端消息
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log(\`[WebSocket] Message from \${clientId}:\`, data);

      // 心跳响应
      if (data.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        return;
      }

      // 广播到其他客户端 (可选)
      if (data.broadcast) {
        broadcast(clientId, data);
      }

      // 确认收到
      ws.send(JSON.stringify({
        type: 'ack',
        originalMessage: data,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('[WebSocket] Error processing message:', error);
    }
  });

  // 处理断开连接
  ws.on('close', () => {
    console.log(\`[WebSocket] Client disconnected: \${clientId}\`);
    clients.delete(clientId);
  });

  // 处理错误
  ws.on('error', (error) => {
    console.error(\`[WebSocket] Error for \${clientId}:\`, error);
  });
});

// 广播消息
function broadcast(excludeClientId, message) {
  const messageStr = JSON.stringify(message);
  clients.forEach((client, clientId) => {
    if (clientId !== excludeClientId && client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
}

// 定时清理不活跃的客户端
setInterval(() => {
  clients.forEach((client, clientId) => {
    if (client.readyState !== WebSocket.OPEN) {
      clients.delete(clientId);
    }
  });
}, 60000);

// 启动服务器
const PORT = process.env.WS_PORT || 3001;
server.listen(PORT, () => {
  console.log(\`[WebSocket] Server listening on port \${PORT}\`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('[WebSocket] Shutting down...');
  clients.forEach((client) => {
    client.close(1001, 'Server shutting down');
  });
  server.close();
});
`;

/**
 * GET 端点 - 返回 WebSocket 服务器信息和示例代码
 */
export async function GET() {
  return NextResponse.json({
    message: 'WebSocket endpoint documentation',
    note: 'Next.js App Router does not natively support WebSocket connections',
    solutions: [
      {
        name: 'Standalone WebSocket Server',
        description: 'Run a separate Node.js server with ws library',
        port: 3001,
        code: websocketServerCode,
      },
      {
        name: 'Vercel Edge Functions',
        description: 'Use Vercel Edge Middleware with WebSocket support',
        url: 'https://vercel.com/docs/functions/edge-functions',
      },
      {
        name: 'Third-party Services',
        description: 'Use Pusher, Ably, or similar services',
        providers: ['Pusher', 'Ably', 'PubNub', 'Supabase Realtime'],
      },
    ],
    environment: {
      NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws',
    },
  });
}

/**
 * POST 端点 - 示例：推送消息到 WebSocket 频道
 * 实际使用时需要连接到独立的 WebSocket 服务器
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { channel, data, action } = body;

    if (!channel || !data) {
      return NextResponse.json(
        { error: 'Missing channel or data' },
        { status: 400 }
      );
    }

    // 在实际实现中，这里应该：
    // 1. 连接到独立的 WebSocket 服务器
    // 2. 或者使用 Redis Pub/Sub 广播消息
    // 3. 或者调用第三方服务的 API

    console.log(`[WebSocket API] Message to ${channel}:`, { action, data });

    // 示例：如果使用 Redis Pub/Sub
    // const redis = new Redis();
    // await redis.publish(channel, JSON.stringify(data));

    return NextResponse.json({
      success: true,
      message: 'Message queued for broadcast',
      channel,
      data,
      timestamp: Date.now(),
      note: 'Implement actual WebSocket broadcast in your server',
    });
  } catch (error) {
    console.error('[WebSocket API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
