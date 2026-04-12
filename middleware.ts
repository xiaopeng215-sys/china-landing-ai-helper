import createMiddleware from 'next-intl/middleware';
import {NextRequest} from 'next/server';

// 支持的语言列表
const locales = ['en-US', 'ko-KR', 'th-TH', 'vi-VN'] as const;

// 默认语言
const defaultLocale = 'en-US';

// next-intl 中间件
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  // 语言检测策略
  localePrefix: 'as-needed', // 按需添加语言前缀
  localeDetection: true,     // 启用自动检测
});

// 与现有认证中间件集成
export default function middleware(request: NextRequest) {
  // 先处理语言路由
  const response = intlMiddleware(request);
  
  // 这里可以添加其他中间件逻辑
  // 如：认证检查、安全头等
  
  return response;
}

// 配置需要中间件处理的路由
export const config = {
  // 匹配所有路由，除了静态资源
  matcher: [
    '/',
    '/(en-US|ko-KR|th-TH|vi-VN)/:path*',
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
