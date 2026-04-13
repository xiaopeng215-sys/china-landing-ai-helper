/**
 * NextAuth API Route - 简化版，修复 Next.js 15 兼容性问题
 * 
 * 问题：NextAuth v4 的 assertConfig 在 Next.js 15 App Router 中因 context.params 是 Promise
 * 导致 req.query.nextauth 为 undefined，触发 MissingAPIRoute (500)
 * 
 * 解决：直接导出 NextAuth handler，让 NextAuth 自己处理所有情况
 */

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth-options';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
