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
 *   - 解决：用 Proxy 拦截 cookies getter，返回普通对象（避免 Object.assign 覆盖只读属性失败）
 *
 * 问题3: 模块级 handler 初始化可能读取不到运行时环境变量
 *   - 解决：每次请求动态创建 handler，确保 getAuthOptions() 读取最新环境变量
 */

import NextAuth from 'next-auth';
import { getAuthOptions } from '@/lib/auth-options';
import { NextRequest } from 'next/server';

type RouteContext = {
  params: Promise<{ nextauth: string[] }> | { nextauth: string[] };
};

async function authHandler(req: NextRequest, context: RouteContext) {
  const params = await Promise.resolve(context.params);
  const nextauth = params?.nextauth;

  // Proxy 方案：正确覆盖 NextRequest.cookies getter
  // Object.assign 无法覆盖只读属性，Proxy 可以拦截 get 陷阱
  const cookiesPlain: Record<string, string> = {};
  req.cookies.getAll().forEach(({ name, value }) => {
    cookiesPlain[name] = value;
  });

  const patchedReq = new Proxy(req, {
    get(target, prop, receiver) {
      if (prop === 'cookies') return cookiesPlain;
      if (prop === 'query') return { nextauth };
      const val = Reflect.get(target, prop, receiver);
      return typeof val === 'function' ? val.bind(target) : val;
    },
  });

  // 每次请求动态创建，确保运行时环境变量正确读取
  const handler = NextAuth(getAuthOptions());
  return handler(patchedReq as any, { params: { nextauth } } as any);
}

export { authHandler as GET, authHandler as POST };
