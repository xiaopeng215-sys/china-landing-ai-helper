/**
 * 聊天 API - 直接在网页调用 AI
 * 支持 MiniMax 和 Qwen 双模型
 * 支持游客试用模式
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { sendToAI } from '@/lib/ai-client';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import * as Sentry from '@sentry/nextjs';

/**
 * 速率限制配置
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
      limiter: Ratelimit.slidingWindow(10, '60 s'),
      analytics: true,
      prefix: '@upstash/ratelimit',
    });
  }
} catch (error) {
  console.error('速率限制初始化失败:', error);
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 速率限制检查
    if (ratelimit) {
      const identifier = request.headers.get('x-forwarded-for') || 'anonymous';
      const { success } = await ratelimit.limit(identifier);
      
      if (!success) {
        return NextResponse.json(
          { error: '请求过于频繁，请稍后再试' },
          { status: 429 }
        );
      }
    }

    // 获取用户会话 (支持游客模式)
    const session = await getServerSession();
    const userId = session?.user?.id || 'guest-' + Date.now();
    const isGuest = !session?.user?.id;

    // 游客限制：每 60 秒最多 3 次对话
    if (isGuest && ratelimit) {
      const { success } = await ratelimit.limit(userId + ':guest');
      if (!success) {
        return NextResponse.json(
          { error: '游客试用次数已达上限，请登录继续使用' },
          { status: 429 }
        );
      }
    }

    // 设置 Sentry 用户上下文
    Sentry.setUser({ id: userId });

    // 解析请求体
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: '无效的请求格式' },
        { status: 400 }
      );
    }

    const { message, model } = body;

    // 验证消息
    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: '消息不能为空' },
        { status: 400 }
      );
    }

    // 限制消息长度
    if (message.length > 2000) {
      return NextResponse.json(
        { error: '消息过长，请限制在 2000 字以内' },
        { status: 400 }
      );
    }

    // 简化的会话管理 (不需要数据库)
    const sessionId = 'session-' + Date.now();

    // 模型选择
    const selectedModel = model === 'minimax' ? 'minimax' : 'qwen';

    console.log(`🤖 使用模型：${selectedModel}, 消息：${message.substring(0, 50)}...`);

    try {
      // 准备消息历史
      const messages: { role: 'user' | 'assistant' | 'system'; content: string }[] = [
        { role: 'user' as const, content: message }
      ];

      // 调用 AI API
      const aiResponse = await sendToAI(messages, {
        model: selectedModel as any,
        structured: true,
      });

      console.log('✅ AI 响应成功');

      // 尝试解析结构化响应
      let structuredData: any = {};
      try {
        const parsed = JSON.parse(aiResponse.content);
        if (parsed.text) {
          structuredData = {
            reply: parsed.text,
            recommendations: parsed.recommendations || [],
            actions: parsed.actions || [],
            images: parsed.images || [],
          };
        } else {
          structuredData = { reply: aiResponse.content };
        }
      } catch (e) {
        // JSON 解析失败，返回纯文本
        structuredData = { reply: aiResponse.content };
      }

      // 返回结构化响应
      return NextResponse.json({
        ...structuredData,
        sessionId,
        model: selectedModel,
      });
    } catch (error) {
      console.error('❌ AI 请求失败:', error);

      return NextResponse.json(
        { error: 'AI 服务暂时不可用，请稍后重试' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Chat API 错误:', error);

    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
