import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

// 支持的语言列表（按产品要求：EN / 中文 / 한국어 / 日本語）
export const locales = ['en-US', 'zh-CN', 'zh-TW', 'ko-KR', 'ja-JP'] as const;
export type Locale = (typeof locales)[number];

// 默认语言
export const defaultLocale: Locale = 'en-US';

// 语言名称映射 (用于显示)
export const localeNames: Record<Locale, string> = {
  'en-US': 'English',
  'zh-CN': '中文',
  'zh-TW': '繁體中文',
  'ko-KR': '한국어',
  'ja-JP': '日本語'
};

// 语言切换器显示标签（按钮文案）
export const localeSwitchLabels: Record<Locale, string> = {
  'en-US': 'EN',
  'zh-CN': '中文',
  'zh-TW': '繁體',
  'ko-KR': '한국어',
  'ja-JP': '日本語',
};

// 验证语言是否有效
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

// 从 pathname 中提取 locale
export function getLocaleFromPathname(pathname: string): Locale {
  const pathLocale = pathname.split('/')[1];
  if (pathLocale && isValidLocale(pathLocale)) {
    return pathLocale;
  }
  return defaultLocale;
}

// next-intl 配置
const requestConfig = getRequestConfig(async ({locale}) => {
  // 验证语言
  if (!locale || !isValidLocale(locale)) {
    notFound();
  }

  // 加载翻译文件
  const messages = await import(`../../messages/${locale}.json`).then(
    (module) => module.default
  );

  return {
    messages,
    locale,
    // 时区配置
    timeZone: 'Asia/Shanghai',
    // 格式化配置
    now: new Date(),
  };
});

export default requestConfig;
