/**
 * 自定义 /api/auth/providers 端点
 * NextAuth v5 兼容版本 - 直接返回 providers 配置
 */

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const providers = {
      google: {
        id: 'google',
        name: 'Google',
        type: 'oauth',
        signinUrl: '/api/auth/signin/google',
        callbackUrl: '/api/auth/callback/google',
      },
      facebook: {
        id: 'facebook',
        name: 'Facebook',
        type: 'oauth',
        signinUrl: '/api/auth/signin/facebook',
        callbackUrl: '/api/auth/callback/facebook',
      },
    };

    return NextResponse.json(providers, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[Auth Providers] Error:', error);
    return NextResponse.json(
      { error: 'Configuration error', message: String(error) },
      { status: 500 }
    );
  }
}
