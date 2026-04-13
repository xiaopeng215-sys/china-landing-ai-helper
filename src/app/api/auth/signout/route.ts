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

    // 清除所有 session cookies
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('__Secure-next-auth.session-token');
    response.cookies.delete('session_token');

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
