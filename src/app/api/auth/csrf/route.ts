/**
 * 自定义 /api/auth/csrf 端点
 * 绕过 NextAuth v4 在 Next.js 15 App Router 中的兼容性问题
 */

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const csrfToken = `csrf-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    
    const response = NextResponse.json({
      csrfToken,
    }, { status: 200 });

    // 设置 CSRF cookie
    response.cookies.set('csrfToken', csrfToken, {
      httpOnly: false, // 必须可读，因为 NextAuth 需要客户端读取
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1小时
    });

    return response;
  } catch (error) {
    console.error('[Auth CSRF] Error:', error);
    return NextResponse.json(
      { error: 'CSRF generation failed' },
      { status: 500 }
    );
  }
}
