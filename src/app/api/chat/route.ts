import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { sendToAI, parseAIResponse, StructuredAIResponse } from '@/lib/ai-client';
import { 
  createChatSession, 
  saveMessage, 
  getMessages,
  getChatSessions,
  updateChatSessionTitle 
} from '@/lib/database';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import * as Sentry from '@sentry/nextjs';
import DOMPurify from 'dompurify';
import { 
  logApiStart, 
  logApiEnd, 
  logApiError,
  error as logError 
} from '@/lib/logger';
import { monitorApiRequest } from '@/lib/monitoring';

/**
 * 速率限制配置
 * 每个用户每 60 秒最多 10 次请求
 */
let ratelimit: Ratelimit | null = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '60 s'), // 10 次/60 秒
      analytics: true,
      prefix: '@upstash/ratelimit',
    });
  } else {
    console.warn('⚠️ 速率限制未配置：缺少 UPSTASH_REDIS_REST_URL 或 UPSTASH_REDIS_REST_TOKEN');
  }
} catch (error) {
  console.error('❌ 速率限制初始化失败:', error);
}

/**
 * 聊天 API - 支持会话管理和消息历史
 * 安全修复:
 * - 添加速率限制
 * - 增强认证检查
 * - 输入验证
 */

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  // 记录请求开始
  logApiStart({
    method: 'POST',
    path: '/api/chat',
  });

  try {
    // 安全修复：速率限制
    if (ratelimit) {
      const identifier = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous';
      const { success, limit, reset, remaining } = await ratelimit.limit(identifier);
      
      if (!success) {
        logApiEnd({
          method: 'POST',
          path: '/api/chat',
          status: 429,
          duration: Date.now() - startTime,
        });
        
        return NextResponse.json(
          { 
            error: '请求过于频繁，请稍后再试',
            retryAfter: Math.ceil((reset - Date.now()) / 1000),
          },
          { 
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            },
          }
        );
      }
    }

    // 获取当前用户会话
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      logApiEnd({
        method: 'POST',
        path: '/api/chat',
        status: 401,
        duration: Date.now() - startTime,
      });
      
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    
    // 设置 Sentry 用户上下文
    Sentry.setUser({ id: userId });
    
    // 安全修复：输入验证
    let body;
    try {
      body = await request.json();
    } catch (error) {
      logApiEnd({
        method: 'POST',
        path: '/api/chat',
        status: 400,
        duration: Date.now() - startTime,
        error: '无效的请求格式',
      });
      
      return NextResponse.json(
        { error: '无效的请求格式' },
        { status: 400 }
      );
    }
    
    let { message, sessionId } = body;
    
    // 保存 sessionId 用于错误处理
    let currentSessionId = sessionId;

    // 安全修复：输入清理 (防 XSS)
    message = DOMPurify.sanitize(message || '').trim();

    if (!message || typeof message !== 'string' || !message.trim()) {
      logApiEnd({
        method: 'POST',
        path: '/api/chat',
        status: 400,
        duration: Date.now() - startTime,
        error: '消息不能为空',
      });
      
      return NextResponse.json(
        { error: '消息不能为空' },
        { status: 400 }
      );
    }

    // 安全修复：限制消息长度，防止 DoS
    if (message.length > 2000) {
      return NextResponse.json(
        { error: '消息过长，请限制在 2000 字以内' },
        { status: 400 }
      );
    }

    // 如果没有会话 ID，创建新会话
    let sessionTitle = null;

    if (!currentSessionId) {
      // 根据第一条消息生成会话标题
      sessionTitle = message.length > 30 ? message.substring(0, 30) + '...' : message;
      currentSessionId = await createChatSession(userId, sessionTitle);
      
      if (!currentSessionId) {
        return NextResponse.json(
          { error: '无法创建会话' },
          { status: 500 }
        );
      }
    }

    // 保存用户消息
    const savedMessageId = await saveMessage(
      currentSessionId,
      userId,
      'user',
      message
    );

    if (!savedMessageId) {
      console.warn('保存用户消息失败，但继续处理');
    }

    // 调用 AI - 请求结构化响应
    const aiResponse = await sendToAI(
      [{ role: 'user', content: message }],
      { structured: true }
    );

    // 解析结构化响应
    const structuredResponse = parseAIResponse(aiResponse.content);
    
    // 保存 AI 回复（保存原始 JSON 或纯文本）
    const savedResponseId = await saveMessage(
      currentSessionId,
      userId,
      'assistant',
      aiResponse.content,
      aiResponse.usage?.total_tokens
    );

    if (!savedResponseId) {
      console.warn('保存 AI 回复失败，但继续返回');
    }

    // 如果是第一条消息，更新会话标题
    if (sessionTitle && currentSessionId) {
      const messages = await getMessages(currentSessionId, 2);
      if (messages.length <= 2) {
        await updateChatSessionTitle(currentSessionId, sessionTitle);
      }
    }

    // 返回结构化响应
    return NextResponse.json({
      reply: structuredResponse.text,
      recommendations: structuredResponse.recommendations || [],
      actions: structuredResponse.actions || [],
      usage: aiResponse.usage,
      sessionId: currentSessionId,
      messageId: savedMessageId,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    
    // 记录错误
    if (error instanceof Error) {
      logApiError({
        method: 'POST',
        path: '/api/chat',
        error: error.message,
        duration,
      });
      
      // 重新获取 session 用于错误日志
      const errorSession = await getServerSession();
      logError('Chat API error', error, {
        userId: errorSession?.user?.id,
      });
    }
    
    logApiEnd({
      method: 'POST',
      path: '/api/chat',
      status: 500,
      duration,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    
    return NextResponse.json(
      { error: '处理消息失败，请稍后重试' },
      { status: 500 }
    );
  }
}

/**
 * 获取会话列表
 * 安全修复：添加速率限制
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  logApiStart({
    method: 'GET',
    path: '/api/chat',
  });
  
  try {
    // 速率限制
    if (ratelimit) {
      const identifier = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous';
      const { success, limit, reset, remaining } = await ratelimit.limit(identifier);
      
      if (!success) {
        logApiEnd({
          method: 'GET',
          path: '/api/chat',
          status: 429,
          duration: Date.now() - startTime,
        });
        
        return NextResponse.json(
          { 
            error: '请求过于频繁，请稍后再试',
            retryAfter: Math.ceil((reset - Date.now()) / 1000),
          },
          { 
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            },
          }
        );
      }
    }

    const session = await getServerSession();
    
    if (!session?.user?.id) {
      logApiEnd({
        method: 'GET',
        path: '/api/chat',
        status: 401,
        duration: Date.now() - startTime,
      });
      
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const sessions = await getChatSessions(userId);

    logApiEnd({
      method: 'GET',
      path: '/api/chat',
      status: 200,
      duration: Date.now() - startTime,
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    const duration = Date.now() - startTime;
    
    if (error instanceof Error) {
      logApiError({
        method: 'GET',
        path: '/api/chat',
        error,
        duration,
      });
      
      const errorSession = await getServerSession();
      logError('获取会话列表失败', error, {
        userId: errorSession?.user?.id,
      });
    }
    
    logApiEnd({
      method: 'GET',
      path: '/api/chat',
      status: 500,
      duration,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    
    return NextResponse.json(
      { error: '获取会话失败' },
      { status: 500 }
    );
  }
}
