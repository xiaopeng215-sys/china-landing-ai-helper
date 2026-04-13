import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import * as Sentry from '@sentry/nextjs';

/**
 * 用户注册 API
 * 支持邮箱密码注册，自动创建 Supabase 用户
 */

// 速率限制实例
let ratelimit: Ratelimit | null = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, '5 m'),
      analytics: true,
      prefix: '@upstash/ratelimit:register',
    });
  }
} catch (error) {
  console.error('速率限制初始化失败:', error);
}

/**
 * 简单的服务端输入清理（替代 DOMPurify，DOMPurify 是浏览器库）
 */
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // 移除 HTML 标签字符
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    // 解析 body（只读一次）
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: '请求格式错误' }, { status: 400 });
    }

    // 速率限制
    if (ratelimit) {
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
      const { success, limit, reset, remaining } = await ratelimit.limit(ip);
      if (!success) {
        return NextResponse.json(
          {
            error: '注册请求过于频繁，请稍后再试',
            retryAfter: Math.ceil((reset - Date.now()) / 1000),
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
              'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
            },
          }
        );
      }
    }

    let { email, password, name } = body;

    // 输入清理
    email = sanitizeInput(email || '');
    name = name ? sanitizeInput(name) : '';

    // 验证输入
    if (!email || !password) {
      return NextResponse.json({ error: '邮箱和密码不能为空' }, { status: 400 });
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: '请输入有效的邮箱地址' }, { status: 400 });
    }

    // 密码强度验证：至少 8 位，包含字母和数字
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: '密码必须至少 8 位，包含字母和数字，可使用特殊字符 @$!%*?&' },
        { status: 400 }
      );
    }

    // 防止常见弱密码
    const weakPasswords = ['password', '123456', '12345678', 'qwerty', 'admin', 'letmein'];
    if (weakPasswords.includes(password.toLowerCase())) {
      return NextResponse.json({ error: '密码过于简单，请使用更复杂的密码' }, { status: 400 });
    }

    // 检查 Supabase 配置
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey ||
        supabaseUrl.includes('your-project') ||
        supabaseKey === 'your-anon-key') {
      // Mock 模式：直接返回成功（用于演示/开发）
      if (process.env.USE_MOCK_AUTH === 'true' || process.env.NODE_ENV === 'development') {
        return NextResponse.json({
          success: true,
          user: {
            id: `mock-${email.replace(/[^a-zA-Z0-9]/g, '-')}`,
            email,
            name: name || email.split('@')[0],
          },
        });
      }
      return NextResponse.json({ error: '数据库未配置' }, { status: 500 });
    }

    // 创建 Supabase 客户端
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 检查用户是否已存在
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: '该邮箱已被注册' }, { status: 409 });
    }

    // 密码加密
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 创建用户记录
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: hashedPassword,
        name: name || email.split('@')[0],
        language: 'zh-CN',
        budget_range: 'medium',
        interests: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('id, email, name')
      .single();

    if (insertError) {
      console.error('创建用户失败:', insertError);
      Sentry.captureException(insertError, {
        tags: { feature: 'user-registration' },
        extra: { email },
      });
      return NextResponse.json({ error: '注册失败，请稍后重试' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    console.error('注册 API 错误:', error);
    Sentry.captureException(error, { tags: { feature: 'user-registration' } });
    return NextResponse.json({ error: '服务器错误，请稍后重试' }, { status: 500 });
  }
}
