/**
 * SSE 流式 API 端点
 * 支持实时内容推送
 */

import { NextRequest } from 'next/server';

const encoder = new TextEncoder();

/**
 * 生成唯一连接 ID
 */
function generateConnectionId(): string {
  return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 处理 GET 请求 - 建立 SSE 连接
 */
export async function GET(request: NextRequest) {
  const connectionId = generateConnectionId();
  const searchParams = request.nextUrl.searchParams;
  const channels = searchParams.get('channels')?.split(',') || ['default'];

  console.log(`[SSE] New connection: ${connectionId}, channels: ${channels.join(', ')}`);

  // 创建可读流
  const stream = new ReadableStream({
    start(controller) {
      // 发送初始连接确认
      const connectMessage = JSON.stringify({
        type: 'connected',
        connectionId,
        timestamp: Date.now(),
        channels,
      });
      controller.enqueue(encoder.encode(`data: ${connectMessage}\n\n`));

      // 心跳定时器
      const heartbeatInterval = setInterval(() => {
        const heartbeatMessage = JSON.stringify({
          type: 'ping',
          timestamp: Date.now(),
        });
        controller.enqueue(encoder.encode(`data: ${heartbeatMessage}\n\n`));
      }, 30000); // 30 秒心跳

      // 模拟数据更新 (实际应该从消息队列/事件总线获取)
      const updateInterval = setInterval(() => {
        // 这里应该从实际的数据源获取更新
        // 示例：模拟内容更新
        const updateMessage = JSON.stringify({
          type: 'update',
          channel: 'content',
          data: {
            action: 'refresh',
            timestamp: Date.now(),
            message: 'Content updated',
          },
        });
        controller.enqueue(encoder.encode(`data: ${updateMessage}\n\n`));
      }, 60000); // 60 秒检查更新

      // 清理函数
      return () => {
        clearInterval(heartbeatInterval);
        clearInterval(updateInterval);
        console.log(`[SSE] Connection closed: ${connectionId}`);
      };
    },
  });

  // 创建响应
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // 禁用 Nginx 缓冲
    },
  });
}

/**
 * 处理 POST 请求 - 推送消息到 SSE 频道
 * 实际使用时需要配合 Redis Pub/Sub 或消息队列
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { channel, data, targetConnections } = body;

    if (!channel || !data) {
      return Response.json(
        { error: 'Missing channel or data' },
        { status: 400 }
      );
    }

    // 在实际实现中，这里应该：
    // 1. 将消息发布到 Redis Pub/Sub
    // 2. 或者推送到消息队列
    // 3. 或者直接广播到所有连接的客户端

    console.log(`[SSE] Broadcast to ${channel}:`, data);

    // 示例响应
    return Response.json({
      success: true,
      message: `Message queued for channel ${channel}`,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[SSE] Error:', error);
    return Response.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
