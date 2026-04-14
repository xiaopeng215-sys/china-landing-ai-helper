/**
 * NextAuth API Route - Next.js 15 App Router 兼容版本
 *
 * NextAuth v4 在 Next.js 15 中存在兼容性问题：
 * - context.params 是 Promise，导致 req.query.nextauth 为 undefined
 * - 触发 assertConfig 的 MissingAPIRoute 错误 (500)
 *
 * 解决方案：预先解析 params，注入到 req.query 中
 *
 * 注意：每次请求时调用 getAuthOptions() 动态构建配置，
 * 确保运行时环境变量（如 GOOGLE_CLIENT_ID）生效，而非构建时快照。
 */

import NextAuth from 'next-auth';
import { getAuthOptions } from '@/lib/auth-options';
import { NextRequest } from 'next/server';

type RouteContext = {
  params: Promise<{ nextauth: string[] }> | { nextauth: string[] };
};

// 在模块级别初始化 handler，避免每次请求重新创建导致 Google OAuth 失败
const handler = NextAuth(getAuthOptions());

async function authHandler(req: NextRequest, context: RouteContext) {
  // 解析 params（Next.js 15 中 params 是 Promise）
  const params = await Promise.resolve(context.params);
  const nextauth = params?.nextauth;

  // 将解析后的 nextauth 注入到请求对象
  const patchedReq = Object.assign(req, {
    query: { nextauth },
  });

  return handler(patchedReq as any, { params: { nextauth } } as any);
}

export { authHandler as GET, authHandler as POST };
