/**
 * 自定义 /api/auth/session 端点
 * 绕过 NextAuth v4 在 Next.js 15 App Router 中的兼容性问题
 */

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { cookies, headers } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const headersList = await headers();
    
    // 从 cookie 获取 session token
    const sessionToken = cookieStore.get('next-auth.session-token')?.value 
                      || cookieStore.get('__Secure-next-auth.session-token')?.value;
    
    if (!sessionToken) {
      return NextResponse.json({ user: null, expires: null }, { status: 200 });
    }

    // 尝试解码 token
    try {
      const secret = process.env.NEXTAUTH_SECRET || 'travelerlocal-fallback-secret-2026';
      const token = await getToken({ 
        req: { 
          cookies: Object.fromEntries(
            cookieStore.getAll().map(c => [c.name, c.value])
          ),
          headers: Object.fromEntries(headersList.entries())
        } as any, 
        secret 
      });

      if (!token) {
        return NextResponse.json({ user: null, expires: null }, { status: 200 });
      }

      return NextResponse.json({
        user: {
          name: token.name,
          email: token.email,
          image: token.picture || token.avatar,
        },
        expires: token.exp ? new Date(token.exp * 1000).toISOString() : null,
      }, { status: 200 });
    } catch (decodeError) {
      console.error('[Auth Session] Token decode error:', decodeError);
      return NextResponse.json({ user: null, expires: null }, { status: 200 });
    }
  } catch (error) {
    console.error('[Auth Session] Error:', error);
    return NextResponse.json({ user: null, expires: null }, { status: 200 });
  }
}
