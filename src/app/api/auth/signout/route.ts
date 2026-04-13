/**
 * 自定义 /api/auth/signout 端点
 * 绕过 NextAuth v4 在 Next.js 15 App Router 中的兼容性问题
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    
    // 清除 session cookies
    const response = NextResponse.json({ 
      ok: true,
      url: '/' 
    }, { status: 200 });

    // 清除 NextAuth session cookies
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('__Secure-next-auth.session-token');

    return response;
  } catch (error) {
    console.error('[Auth Signout] Error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
