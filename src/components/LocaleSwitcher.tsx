'use client';

import {useLocale} from 'next-intl';
import {useRouter} from 'next/navigation';
import {locales, localeNames} from '@/lib/i18n/config';
import {useState} from 'react';

/**
 * 语言切换器组件
 * 
 * 用法:
 * ```tsx
 * <LocaleSwitcher />
 * ```
 */
export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLocaleChange = (newLocale: string) => {
    // 切换到新语言
    const newPathname = window.location.pathname.replace(
      new RegExp(`^/(en-US|ko-KR|th-TH|vi-VN)`),
      `/${newLocale}`
    );
    
    // 如果当前路径没有语言前缀，添加一个
    const finalPathname = newPathname.startsWith('/') && !newPathname.match(/^\/(en-US|ko-KR|th-TH|vi-VN)/)
      ? `/${newLocale}${newPathname}`
      : newPathname;
    
    router.push(finalPathname);
    setIsOpen(false);
    
    // 保存用户偏好
    localStorage.setItem('preferred-locale', newLocale);
  };

  return (
    <div className="relative">
      {/* 语言切换按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium">{localeNames[locale as keyof typeof localeNames]}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 语言选择下拉菜单 */}
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* 下拉菜单 */}
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLocaleChange(loc)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  locale === loc
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {localeNames[loc]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * 获取当前语言的显示名称
 */
export function getCurrentLocaleName(locale: string): string {
  return localeNames[locale as keyof typeof localeNames] || 'English';
}
