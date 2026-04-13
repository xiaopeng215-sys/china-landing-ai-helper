/**
 * 自定义 /api/auth/signin 端点
 * 绕过 NextAuth v4 在 Next.js 15 App Router 中的兼容性问题
 * 
 * 支持 credentials 登录方式的 POST 请求
 */

import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const callbackUrl = formData.get('callbackUrl') as string || '/';
    const redirect = formData.get('redirect') as string;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 调用 signIn 函数
    const result = await signIn(email, password);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    // 如果 redirect=false，返回 JSON
    if (redirect === 'false') {
      return NextResponse.json({
        ok: true,
        user: result.user,
        sessionId: result.sessionId,
      });
    }

    // 重定向到 callbackUrl 或首页
    return NextResponse.redirect(new URL(callbackUrl, request.url), 303);
  } catch (error) {
    console.error('[Auth Signin] Error:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
