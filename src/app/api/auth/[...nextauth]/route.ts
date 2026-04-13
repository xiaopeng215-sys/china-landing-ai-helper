/**
 * NextAuth API Route
 * 处理所有 NextAuth 相关的请求
 */

import { NextRequest, NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth-options';

const handler = NextAuth({
  ...authOptions,
  // 生产环境开启 debug 以便排查
  debug: true,
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
