/**
 * 自定义登录端点
 * POST /api/auth/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'travelerlocal-fallback-secret-2026'
);

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 }
      );
    }

    // Mock 认证逻辑 - 允许任意 6 位以上密码
    if (process.env.USE_MOCK_AUTH === 'true' || process.env.NODE_ENV === 'development') {
      if (password.length >= 6) {
        const user = {
          id: `mock-${email.replace(/[^a-zA-Z0-9]/g, '-')}`,
          email,
          name: email.split('@')[0],
          avatar: null,
        };

        // 创建 JWT token
        const token = await new SignJWT({
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setExpirationTime('30d')
          .sign(JWT_SECRET);

        // 设置 session cookie
        const cookieStore = await cookies();
        cookieStore.set('session_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 30 * 24 * 60 * 60, // 30 天
        });

        return NextResponse.json({
          ok: true,
          user,
        });
      }
      return NextResponse.json(
        { error: '密码长度至少 6 位' },
        { status: 401 }
      );
    }

    // 生产模式需要连接数据库验证
    return NextResponse.json(
      { error: '认证服务未配置' },
      { status: 503 }
    );
  } catch (error) {
    console.error('[Auth Login] Error:', error);
    return NextResponse.json(
      { error: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
}
