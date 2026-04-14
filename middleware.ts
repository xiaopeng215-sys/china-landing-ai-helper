import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// 支持的语言列表
const locales = ['en-US', 'ko-KR', 'th-TH', 'vi-VN'] as const;

// 默认语言
const defaultLocale = 'en-US';

// next-intl 中间件
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: true,
});

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

// 速率限制实例
let globalRatelimit: Ratelimit | null = null;
let authRatelimit: Ratelimit | null = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    
    globalRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1 m'),
      analytics: true,
      prefix: '@upstash/ratelimit:global',
    });
    
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

// 主中间件 - 整合 i18n 和认证
export default async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;

  // 跳过静态资源
  const isStaticResource = 
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/public/') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2)$/);

  if (isStaticResource) {
    return NextResponse.next();
  }

  // 速率限制检查 - API 认证端点
  if (pathname.startsWith('/api/auth/')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    if (authRatelimit) {
      try {
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
      } catch (e) {
        // Redis unavailable, skip rate limiting
        console.warn('[Middleware] Auth rate limit check failed, skipping:', e);
      }
    }
  }
  
  // 速率限制检查 - 其他 API
  if (pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    if (globalRatelimit) {
      try {
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
      } catch (e) {
        // Redis unavailable, skip rate limiting
        console.warn('[Middleware] Global rate limit check failed, skipping:', e);
      }
    }
    
    // Chat API 认证检查
    if (pathname === '/api/chat') {
      const token = await getToken({ req: request });
      if (!token) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }
    
    // 其他 API 直接处理，不应用 i18n
    return NextResponse.next();
  }

  // 页面路由的认证检查
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    const token = await getToken({ req: request });
    if (!token) {
      const loginUrl = new URL('/auth/signin', nextUrl.origin);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 已登录用户访问认证页面，重定向到主页
  if (pathname.startsWith('/auth')) {
    const token = await getToken({ req: request });
    if (token) {
      return NextResponse.redirect(new URL('/', nextUrl.origin));
    }
  }

  // 处理语言路由
  return intlMiddleware(request);
}

// 配置需要中间件处理的路由
export const config = {
  matcher: [
    '/',
    '/(en-US|ko-KR|th-TH|vi-VN)/:path*',
    '/((?!_next/static|_next/image|favicon.ico|public/|api/).*)',
  ],
};
