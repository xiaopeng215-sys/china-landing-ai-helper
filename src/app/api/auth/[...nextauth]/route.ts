/**
 * NextAuth API Route - Next.js 15 App Router 兼容版本
 *
 * NextAuth v4 在 Next.js 15 中存在兼容性问题：
 * - context.params 是 Promise，导致 req.query.nextauth 为 undefined
 * - 触发 assertConfig 的 MissingAPIRoute 错误 (500)
 *
 * 解决方案：预先解析 params，注入到 req.query 中
 */

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { NextRequest } from 'next/server';

const handler = NextAuth(authOptions);

type RouteContext = {
  params: Promise<{ nextauth: string[] }> | { nextauth: string[] };
};

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
