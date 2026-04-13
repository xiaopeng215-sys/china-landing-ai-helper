/**
 * 自定义登出端点
 * GET /api/auth/logout
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    
    // 清除 session cookie
    cookieStore.delete('session_token');

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[Auth Logout] Error:', error);
    return NextResponse.json(
      { error: '登出失败' },
      { status: 500 }
    );
  }
}
