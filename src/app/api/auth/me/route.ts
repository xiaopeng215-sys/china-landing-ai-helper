/**
 * 获取当前用户信息
 * GET /api/auth/me
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'travelerlocal-fallback-secret-2026'
);

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return NextResponse.json({
        user: {
          id: payload.id,
          email: payload.email,
          name: payload.name,
          avatar: payload.avatar,
        },
      }, { status: 200 });
    } catch {
      // token 无效或过期
      cookieStore.delete('session_token');
      return NextResponse.json({ user: null }, { status: 200 });
    }
  } catch (error) {
    console.error('[Auth Me] Error:', error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
