/**
 * NextAuth API Route
 * 处理所有 NextAuth 相关的请求
 */

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth-options';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
