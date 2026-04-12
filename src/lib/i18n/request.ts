import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {locales, isValidLocale, defaultLocale} from './config';

// next-intl 请求配置
export default getRequestConfig(async ({locale}) => {
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
    timeZone: 'Asia/Shanghai',
    now: new Date(),
  };
});
