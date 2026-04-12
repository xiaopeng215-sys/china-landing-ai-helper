import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

// 支持的语言列表
export const locales = ['en-US', 'ko-KR', 'th-TH', 'vi-VN'] as const;
export type Locale = (typeof locales)[number];

// 默认语言
export const defaultLocale: Locale = 'en-US';

// 语言名称映射 (用于显示)
export const localeNames: Record<Locale, string> = {
  'en-US': 'English',
  'ko-KR': '한국어',
  'th-TH': 'ไทย',
  'vi-VN': 'Tiếng Việt'
};

// 验证语言是否有效
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

// next-intl 配置
const requestConfig = getRequestConfig(async ({locale}) => {
  // 验证语言
  if (!locale || !isValidLocale(locale)) {
    notFound();
  }

  // 加载翻译文件
  const messages = await import(`../messages/${locale}.json`).then(
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
