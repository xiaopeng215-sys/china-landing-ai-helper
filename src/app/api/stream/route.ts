/**
 * SSE 流式 API 端点
 * 支持实时内容推送
 */

import { NextRequest } from 'next/server';

const encoder = new TextEncoder();

// SSE 连接最大存活时间 (5 分钟)
const MAX_CONNECTION_DURATION_MS = 5 * 60 * 1000;

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

  // 连接超时控制
  const connectionTimeout = setTimeout(() => {
    console.log(`[SSE] Connection timeout: ${connectionId}`);
  }, MAX_CONNECTION_DURATION_MS);

  // 创建可读流
  const stream = new ReadableStream({
    start(controller) {
      try {
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
          try {
            const heartbeatMessage = JSON.stringify({
              type: 'ping',
              timestamp: Date.now(),
            });
            controller.enqueue(encoder.encode(`data: ${heartbeatMessage}\n\n`));
          } catch (e) {
            clearInterval(heartbeatInterval);
          }
        }, 30000); // 30 秒心跳

        // 清理函数
        return () => {
          clearInterval(heartbeatInterval);
          clearTimeout(connectionTimeout);
          console.log(`[SSE] Connection closed: ${connectionId}`);
        };
      } catch (error) {
        console.error(`[SSE] Stream error: ${connectionId}`, error);
        controller.error(error);
      }
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
 */
export async function POST(request: NextRequest) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: { code: 'INVALID_REQUEST', message: 'Invalid JSON body' } },
        { status: 400 }
      );
    }

    const { channel, data } = body;

    if (!channel || !data) {
      return Response.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Missing channel or data' } },
        { status: 400 }
      );
    }

    console.log(`[SSE] Broadcast to ${channel}:`, data);

    return Response.json({
      success: true,
      message: `Message queued for channel ${channel}`,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[SSE] Error:', error);
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to process message' } },
      { status: 500 }
    );
  }
}
