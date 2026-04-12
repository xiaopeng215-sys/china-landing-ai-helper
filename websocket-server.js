#!/usr/bin/env node
/**
 * 独立 WebSocket 服务器
 * 
 * 使用方法:
 * 1. 安装依赖：npm install ws
 * 2. 运行：node websocket-server.js
 * 3. 环境变量:
 *    - WS_PORT: 端口 (默认 3001)
 *    - WS_HOST: 主机 (默认 0.0.0.0)
 */

const WebSocket = require('ws');
const http = require('http');

// 配置
const PORT = process.env.WS_PORT || 3001;
const HOST = process.env.WS_HOST || '0.0.0.0';
const HEARTBEAT_INTERVAL = 30000; // 30 秒
const CLEANUP_INTERVAL = 60000;   // 60 秒

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  // 健康检查端点
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      clients: clients.size,
      uptime: process.uptime(),
      timestamp: Date.now(),
    }));
    return;
  }

  // 404 for other requests
  res.writeHead(404);
  res.end('WebSocket Server');
});

// 创建 WebSocket 服务器
const wss = new WebSocket.Server({
  server,
  path: '/ws',
  maxPayload: 1024 * 1024, // 1MB max message size
});

// 连接的客户端
const clients = new Map();

// 统计信息
const stats = {
  totalConnections: 0,
  totalMessages: 0,
  totalErrors: 0,
  startTime: Date.now(),
};

/**
 * 广播消息到所有客户端或指定频道
 */
function broadcast(message, excludeClientId = null, channel = null) {
  const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
  
  clients.forEach((client, clientId) => {
    if (clientId !== excludeClientId && client.readyState === WebSocket.OPEN) {
      // 如果指定了频道，只发送给订阅该频道的客户端
      if (channel) {
        const clientChannels = client.channels || [];
        if (clientChannels.includes(channel)) {
          client.send(messageStr);
        }
      } else {
        client.send(messageStr);
      }
    }
  });
}

/**
 * 发送消息到特定客户端
 */
function sendToClient(clientId, message) {
  const client = clients.get(clientId);
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(typeof message === 'string' ? message : JSON.stringify(message));
    return true;
  }
  return false;
}

/**
 * 处理客户端连接
 */
wss.on('connection', (ws, request) => {
  const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const clientIp = request.socket.remoteAddress;
  
  console.log(`[WebSocket] Client connected: ${clientId} from ${clientIp}`);
  
  // 存储客户端信息
  const clientInfo = {
    id: clientId,
    ip: clientIp,
    channels: new Set(),
    connectedAt: Date.now(),
    lastActivity: Date.now(),
    messageCount: 0,
  };
  
  clients.set(clientId, {
    ...ws,
    channels: clientInfo.channels,
    info: clientInfo,
  });
  
  stats.totalConnections++;

  // 发送欢迎消息
  ws.send(JSON.stringify({
    type: 'welcome',
    clientId,
    timestamp: Date.now(),
    serverTime: new Date().toISOString(),
  }));

  // 设置心跳定时器
  ws.heartbeatInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'ping',
        timestamp: Date.now(),
      }));
      
      // 检测心跳超时
      if (Date.now() - clientInfo.lastActivity > HEARTBEAT_INTERVAL * 2) {
        console.log(`[WebSocket] Client ${clientId} heartbeat timeout`);
        ws.terminate();
      }
    }
  }, HEARTBEAT_INTERVAL);

  // 处理客户端消息
  ws.on('message', (message) => {
    clientInfo.lastActivity = Date.now();
    clientInfo.messageCount++;
    stats.totalMessages++;

    try {
      const data = JSON.parse(message);
      console.log(`[WebSocket] Message from ${clientId}:`, data.type || 'data');

      // 心跳响应
      if (data.type === 'ping') {
        ws.send(JSON.stringify({
          type: 'pong',
          timestamp: Date.now(),
        }));
        return;
      }

      // 订阅频道
      if (data.type === 'subscribe') {
        const { channel } = data;
        if (channel) {
          clientInfo.channels.add(channel);
          console.log(`[WebSocket] Client ${clientId} subscribed to ${channel}`);
          ws.send(JSON.stringify({
            type: 'subscribed',
            channel,
            timestamp: Date.now(),
          }));
        }
        return;
      }

      // 取消订阅
      if (data.type === 'unsubscribe') {
        const { channel } = data;
        if (channel) {
          clientInfo.channels.delete(channel);
          console.log(`[WebSocket] Client ${clientId} unsubscribed from ${channel}`);
          ws.send(JSON.stringify({
            type: 'unsubscribed',
            channel,
            timestamp: Date.now(),
          }));
        }
        return;
      }

      // 广播消息
      if (data.broadcast) {
        const { channel } = data;
        broadcast({
          type: 'broadcast',
          from: clientId,
          channel,
          data: data.data,
          timestamp: Date.now(),
        }, clientId, channel);
      }

      // 确认收到
      ws.send(JSON.stringify({
        type: 'ack',
        originalType: data.type,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error(`[WebSocket] Error processing message from ${clientId}:`, error);
      stats.totalErrors++;
      
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message',
        timestamp: Date.now(),
      }));
    }
  });

  // 处理断开连接
  ws.on('close', (code, reason) => {
    console.log(`[WebSocket] Client disconnected: ${clientId} (${code})`);
    
    if (ws.heartbeatInterval) {
      clearInterval(ws.heartbeatInterval);
    }
    
    clients.delete(clientId);
  });

  // 处理错误
  ws.on('error', (error) => {
    console.error(`[WebSocket] Error for ${clientId}:`, error);
    stats.totalErrors++;
  });

  // 处理 pong 响应
  ws.on('pong', () => {
    clientInfo.lastActivity = Date.now();
  });
});

/**
 * 定时清理不活跃的客户端
 */
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  
  clients.forEach((client, clientId) => {
    if (client.readyState !== WebSocket.OPEN) {
      clients.delete(clientId);
      cleaned++;
    } else if (now - client.info.lastActivity > HEARTBEAT_INTERVAL * 3) {
      console.log(`[WebSocket] Cleaning up inactive client: ${clientId}`);
      client.terminate();
      clients.delete(clientId);
      cleaned++;
    }
  });
  
  if (cleaned > 0) {
    console.log(`[WebSocket] Cleaned up ${cleaned} inactive clients`);
  }
}, CLEANUP_INTERVAL);

/**
 * 优雅关闭
 */
function gracefulShutdown(signal) {
  console.log(`\n[WebSocket] Received ${signal}, shutting down gracefully...`);
  
  // 关闭所有客户端连接
  clients.forEach((client, clientId) => {
    client.send(JSON.stringify({
      type: 'server_shutdown',
      reason: 'Server is shutting down',
      timestamp: Date.now(),
    }));
    client.close(1001, 'Server shutting down');
    
    if (client.heartbeatInterval) {
      clearInterval(client.heartbeatInterval);
    }
  });
  
  // 关闭服务器
  clearInterval(cleanupInterval);
  wss.close(() => {
    server.close(() => {
      console.log('[WebSocket] Server closed');
      process.exit(0);
    });
  });
  
  // 强制退出（10 秒后）
  setTimeout(() => {
    console.error('[WebSocket] Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

/**
 * 启动服务器
 */
server.listen(PORT, HOST, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║           WebSocket Server Started                     ║
╠════════════════════════════════════════════════════════╣
║  Host: ${HOST.padEnd(42)}║
║  Port: ${String(PORT).padEnd(42)}║
║  Path: /ws${' '.repeat(42)}║
║  Heartbeat: ${String(HEARTBEAT_INTERVAL / 1000).padEnd(37)}║
╚════════════════════════════════════════════════════════╝

Health check: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/health
  `);
});

// 导出统计信息（可选）
setInterval(() => {
  const uptime = Math.floor((Date.now() - stats.startTime) / 1000);
  console.log(`[WebSocket] Stats: ${clients.size} clients, ${stats.totalConnections} total, ${stats.totalMessages} messages, ${stats.totalErrors} errors, ${uptime}s uptime`);
}, 300000); // 每 5 分钟输出统计
