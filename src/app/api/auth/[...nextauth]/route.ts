/**
 * NextAuth API Route
 * 处理所有 NextAuth 相关的请求
 * 
 * 修复说明：
 * - secret 改为在运行时读取，避免构建时环境变量问题
 * - NextAuth v4 与 Next.js 15 兼容性问题通过直接传递 secret 解决
 */

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth-options';

// 修复: 在运行时直接读取 secret，确保生产环境可用
const secret = process.env.NEXTAUTH_SECRET;

if (!secret) {
  console.error('[NextAuth] FATAL: NEXTAUTH_SECRET is not defined!');
}

const handler = NextAuth({
  ...authOptions,
  // 强制覆盖 secret，确保运行时读取
  secret: secret || authOptions.secret,
  // 生产环境开启 debug 以便排查
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, ...message) {
      console.error('[NextAuth Error]', code, ...message);
    },
    warn(code, ...message) {
      console.warn('[NextAuth Warn]', code, ...message);
    },
    debug(code, ...message) {
      console.log('[NextAuth Debug]', code, ...message);
    },
  },
});

export { handler as GET, handler as POST };
