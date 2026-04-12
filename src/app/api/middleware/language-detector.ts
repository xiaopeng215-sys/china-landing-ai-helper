/**
 * 语言检测中间件
 * 
 * 功能:
 * - 从 URL path 检测语言
 * - 从 Cookie 检测语言
 * - 从 Accept-Language header 检测语言
 * - 重定向到正确的语言路径
 */

import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, type Locale } from '@/lib/i18n/config';

/**
 * 从请求中检测语言
 * 
 * 优先级:
 * 1. URL path 中的语言
 * 2. Cookie 中的语言偏好
 * 3. Accept-Language header
 * 4. 默认语言
 */
export function detectLocale(request: NextRequest): Locale {
  const url = request.nextUrl.clone();
  const pathLocale = url.pathname.split('/')[1] as Locale;
  
  // 1. 检查 URL path
  if (pathLocale && locales.includes(pathLocale)) {
    return pathLocale;
  }
  
  // 2. 检查 Cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value as Locale;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }
  
  // 3. 检查 Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    // 解析 Accept-Language header
    const preferred = acceptLanguage.split(',')[0].split(';')[0];
    
    // 尝试匹配支持的语言
    for (const locale of locales) {
      if (preferred.startsWith(locale.split('-')[0])) {
        return locale;
      }
    }
  }
  
  // 4. 返回默认语言
  return defaultLocale;
}

/**
 * 语言中间件
 * 
 * 功能:
 * - 检查 URL 是否包含语言前缀
 * - 如果没有，重定向到带语言前缀的 URL
 * - 设置语言 Cookie
 */
export function localeMiddleware(request: NextRequest): NextResponse | null {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  
  // 跳过静态资源和 API 路由
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return null;
  }
  
  // 获取当前语言
  const pathLocale = pathname.split('/')[1] as Locale;
  
  // 如果已经有语言前缀，无需处理
  if (pathLocale && locales.includes(pathLocale)) {
    return null;
  }
  
  // 检测应该使用的语言
  const detectedLocale = detectLocale(request);
  
  // 重定向到带语言前缀的 URL
  url.pathname = `/${detectedLocale}${pathname}`;
  
  const response = NextResponse.redirect(url);
  
  // 设置语言 Cookie (30 天)
  response.cookies.set('NEXT_LOCALE', detectedLocale, {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
    sameSite: 'lax',
  });
  
  return response;
}

/**
 * 获取语言重定向 URL
 */
export function getLocaleRedirectUrl(
  request: NextRequest,
  targetLocale: Locale
): string {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  
  // 移除现有的语言前缀
  const pathParts = pathname.split('/');
  if (pathParts[1] && locales.includes(pathParts[1] as Locale)) {
    pathParts.splice(1, 1);
  }
  
  // 添加新的语言前缀
  pathParts.splice(1, 0, targetLocale);
  
  url.pathname = pathParts.join('/');
  return url.toString();
}
