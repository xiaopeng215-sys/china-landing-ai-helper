/**
 * NextAuth API Route - Next.js 15 App Router 兼容版本
 *
 * NextAuth v4 在 Next.js 15 中存在两个兼容性问题：
 *
 * 问题1: context.params 是 Promise
 *   - 导致 req.query.nextauth 为 undefined
 *   - 触发 assertConfig 的 MissingAPIRoute 错误 (500)
 *   - 解决：预先 await params，注入到 req.query
 *
 * 问题2 (根因 error=google): NextRequest.cookies 不兼容
 *   - NextAuth v4 用 req.cookies["next-auth.csrf-token"] 读取 CSRF token
 *   - NextRequest.cookies 是 RequestCookies 对象，bracket 访问返回 undefined
 *   - 必须用 .get() 方法，但 NextAuth 内部不知道这一点
 *   - 导致 CSRF token 始终为 undefined => state 验证失败 => error=google
 *   - 解决：将 cookies 展开为普通对象注入到 patchedReq
 */

import NextAuth from 'next-auth';
import { getAuthOptions } from '@/lib/auth-options';
import { NextRequest } from 'next/server';

type RouteContext = {
  params: Promise<{ nextauth: string[] }> | { nextauth: string[] };
};

// 在模块级别初始化 handler（固定实例，避免 Google OAuth state 不一致）
const handler = NextAuth(getAuthOptions());

async function authHandler(req: NextRequest, context: RouteContext) {
  // 解析 params（Next.js 15 中 params 是 Promise）
  const params = await Promise.resolve(context.params);
  const nextauth = params?.nextauth;

  // 将 RequestCookies 对象展开为普通 { key: value } 对象
  // NextAuth v4 用 req.cookies["key"] 读取，但 NextRequest.cookies 是
  // RequestCookies 实例，bracket 访问返回 undefined，必须用 .get()
  const cookiesPlain: Record<string, string> = {};
  req.cookies.getAll().forEach(({ name, value }) => {
    cookiesPlain[name] = value;
  });

  // 注入 nextauth query 参数 + 兼容的 cookies 对象
  const patchedReq = Object.assign(req, {
    query: { nextauth },
    cookies: cookiesPlain,
  });

  return handler(patchedReq as any, { params: { nextauth } } as any);
}

export { authHandler as GET, authHandler as POST };
