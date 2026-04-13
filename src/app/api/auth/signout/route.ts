/**
 * 自定义 /api/auth/signout 端点
 * 支持 GET 和 POST（NextAuth 客户端 signOut() 使用 POST）
 */

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function handleSignout() {
  try {
    const response = NextResponse.json({ 
      ok: true,
      url: '/' 
    }, { status: 200 });

    // 清除所有 session cookies（必须设置相同的 Path/Secure 属性才能真正清除）
    const cookieOptions = {
      path: '/',
      expires: new Date(0),
      httpOnly: true,
      secure: true,
      sameSite: 'lax' as const,
    };

    response.cookies.set('next-auth.session-token', '', cookieOptions);
    response.cookies.set('__Secure-next-auth.session-token', '', cookieOptions);
    response.cookies.set('__Host-next-auth.csrf-token', '', { ...cookieOptions, path: '/' });
    response.cookies.set('__Secure-next-auth.callback-url', '', cookieOptions);
    response.cookies.set('session_token', '', cookieOptions);

    return response;
  } catch (error) {
    console.error('[Auth Signout] Error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  return handleSignout();
}

export async function POST() {
  return handleSignout();
}
