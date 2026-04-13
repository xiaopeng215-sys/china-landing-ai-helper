/**
 * NextAuth API Route - Next.js 15 兼容版本
 *
 * 修复说明：
 * Next.js 15 中 context.params 是 Promise，NextAuth v4 的 NextAuthRouteHandler
 * 在某些情况下无法正确 await params，导致 nextauth 为 undefined，
 * 触发 assertConfig 里的 MissingAPIRoute 错误（500）。
 *
 * 解决方案：手动 await params，重新包装 context，确保 NextAuth 能正确读取。
 */

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth-options';

const secret =
  process.env.NEXTAUTH_SECRET ||
  process.env.AUTH_SECRET ||
  authOptions.secret;

const nextAuthOptions = {
  ...authOptions,
  secret,
  debug: process.env.NODE_ENV === 'development',
};

async function handler(
  req: Request,
  context: { params: Promise<{ nextauth: string[] }> | { nextauth: string[] } }
) {
  // 手动 await params，确保 Next.js 15 兼容
  // NextAuth 内部也会 await，但有时会失败，这里提前解析
  const resolvedParams = await Promise.resolve(context.params);

  // 重新包装 context，params 已经是解析好的对象（非 Promise）
  // NextAuth 的 NextAuthRouteHandler 里 `await context.params` 对普通对象也有效
  const resolvedContext = {
    params: Promise.resolve(resolvedParams),
  };

  // @ts-expect-error - NextAuth v4 内部类型与 Next.js 15 Request 类型有差异
  return NextAuth(req, resolvedContext, nextAuthOptions);
}

export { handler as GET, handler as POST };
