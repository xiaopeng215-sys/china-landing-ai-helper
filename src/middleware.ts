import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// 公开路由 (不需要认证)
const PUBLIC_ROUTES = [
  '/',
  '/auth',
  '/terms',
  '/privacy',
  '/api/auth',
];

// 需要认证的路由
const PROTECTED_ROUTES = [
  '/profile',
  '/chat',
  '/trips',
  '/settings',
];

// 速率限制实例 - 全局 API 防护
let globalRatelimit: Ratelimit | null = null;
let authRatelimit: Ratelimit | null = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    
    // 全局 API 速率限制：100 次/分钟
    globalRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1 m'),
      analytics: true,
      prefix: '@upstash/ratelimit:global',
    });
    
    // 认证接口速率限制：5 次/分钟 (防暴力破解)
    authRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 m'),
      analytics: true,
      prefix: '@upstash/ratelimit:auth',
    });
  }
} catch (error) {
  console.error('速率限制初始化失败:', error);
}

export default withAuth(
  async function middleware(req) {
    const { nextUrl } = req;
    const token = req.nextauth.token;
    const pathname = nextUrl.pathname;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    // 安全修复：速率限制检查
    // 认证接口 (登录/注册) - 严格限制防暴力破解
    if (pathname.startsWith('/api/auth/') && authRatelimit) {
      const { success, reset } = await authRatelimit.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: '请求过于频繁，请稍后再试' },
          { 
            status: 429,
            headers: {
              'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
            },
          }
        );
      }
    }
    
    // 全局 API 速率限制
    if (pathname.startsWith('/api/') && globalRatelimit) {
      const { success, limit, reset, remaining } = await globalRatelimit.limit(ip);
      if (!success) {
        const response = NextResponse.json(
          { error: '请求过于频繁，请稍后再试' },
          { status: 429 }
        );
        response.headers.set('X-RateLimit-Limit', limit.toString());
        response.headers.set('X-RateLimit-Remaining', remaining.toString());
        response.headers.set('X-RateLimit-Reset', reset.toString());
        return response;
      }
    }

    // 安全修复：添加 CSP 和其他安全头
    const response = NextResponse.next();
    
    // Content Security Policy - 严格限制资源加载
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://browser.sentry-cdn.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://api.minimaxi.com https://*.sentry.io https://*.vercel.app https://*.upstash.io",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; ')
    );
    
    // 额外的安全头
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin');
    response.headers.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(self), payment=(), usb=()'
    );

    // API 路由的认证检查
    if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
      // Chat API 需要认证
      if (pathname === '/api/chat') {
        if (!token) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          );
        }
      }
    }

    // 页面路由的认证检查
    if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
      if (!token) {
        // 重定向到登录页
        const loginUrl = new URL('/auth/signin', nextUrl.origin);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    // 已登录用户访问认证页面，重定向到主页
    if (pathname.startsWith('/auth') && token) {
      return NextResponse.redirect(new URL('/', nextUrl.origin));
    }

    return response;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// 配置需要中间件处理的路由
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了：
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico (网站图标)
     * - 公开资源 (public 目录)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
