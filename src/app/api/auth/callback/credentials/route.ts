/**
 * 自定义 /api/auth/callback/credentials 端点
 * 绕过 NextAuth v4 在 Next.js 15 App Router 中的兼容性问题
 */

import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/lib/auth';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const csrfToken = formData.get('csrfToken') as string;
    const callbackUrl = formData.get('callbackUrl') as string || '/';

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 执行登录
    const result = await signIn(email, password);

    if (!result.ok || !result.sessionId) {
      const errorUrl = new URL('/auth/error', request.url);
      errorUrl.searchParams.set('error', result.error || 'CredentialsSignin');
      return NextResponse.redirect(errorUrl, 303);
    }

    // 设置 session cookie
    const cookieStore = await cookies();
    cookieStore.set('session_token', result.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // 重定向到 callbackUrl 或首页
    return NextResponse.redirect(new URL(callbackUrl, request.url), 303);
  } catch (error) {
    console.error('[Auth Callback Credentials] Error:', error);
    const errorUrl = new URL('/auth/error', request.url);
    errorUrl.searchParams.set('error', 'Configuration');
    return NextResponse.redirect(errorUrl, 303);
  }
}
