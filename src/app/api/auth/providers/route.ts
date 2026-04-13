/**
 * 自定义 /api/auth/providers 端点
 * 绕过 NextAuth v4 的 assertConfig 问题 (Next.js 15 App Router 兼容性问题)
 * 
 * NextAuth v4 的 assertConfig 会在 req.query.nextauth 无法正确获取时返回 MissingAPIRoute
 * 这是因为 App Router 中路由参数的处理方式与 Pages Router 不同
 * 
 * 此端点直接返回 providers 配置，绕过 NextAuth 内部处理
 */

import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth-options';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 直接从 authOptions 获取 providers 配置
    const providers = authOptions.providers.map(p => ({
      id: p.id,
      name: p.name,
      type: p.type,
      signinUrl: p.signinUrl,
      callbackUrl: p.callbackUrl,
    }));

    return NextResponse.json(
      Object.fromEntries(providers.map(p => [p.id, p])),
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('[Auth Providers] Error:', error);
    return NextResponse.json(
      { error: 'Configuration error', message: String(error) },
      { status: 500 }
    );
  }
}
