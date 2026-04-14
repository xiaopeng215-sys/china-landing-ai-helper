'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { locales, localeNames, defaultLocale, type Locale } from '@/lib/i18n/config';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'list' | 'icon';
  className?: string;
}

/**
 * 语言切换器组件
 * 
 * 功能:
 * - 支持 4 种语言切换 (EN/KO/TH/VN)
 * - 记住用户选择 (localStorage)
 * - 自动跳转到对应语言页面
 * - 响应式设计
 */
export default function LanguageSwitcher({
  variant = 'dropdown',
  className = '',
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>(defaultLocale);

  // 从 URL 或 localStorage 获取当前语言
  useEffect(() => {
    // 优先从 URL path 获取
    const pathParts = pathname.split('/');
    const urlLocale = pathParts[1] as Locale;
    
    if (urlLocale && locales.includes(urlLocale)) {
      setCurrentLocale(urlLocale);
      localStorage.setItem('preferred-locale', urlLocale);
    } else {
      // 否则从 localStorage 获取
      const stored = localStorage.getItem('preferred-locale') as Locale;
      if (stored && locales.includes(stored)) {
        setCurrentLocale(stored);
      }
    }
  }, [pathname]);

  // 切换语言
  const handleLocaleChange = (newLocale: Locale) => {
    setCurrentLocale(newLocale);
    localStorage.setItem('preferred-locale', newLocale);
    setIsOpen(false);
    
    // 跳转到新语言的页面
    const pathParts = pathname.split('/');
    const currentLocaleInPath = pathParts[1] as Locale;
    
    if (locales.includes(currentLocaleInPath)) {
      // 替换现有语言路径
      pathParts[1] = newLocale;
    } else {
      // 插入语言路径
      pathParts.splice(1, 0, newLocale);
    }
    
    const newPath = pathParts.join('/');
    router.push(newPath);
  };

  // 关闭下拉菜单（点击外部）
  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  // 获取当前语言的显示名称（缩写）
  const getCurrentLocaleLabel = () => {
    const name = localeNames[currentLocale];
    // 提取第一个字母作为图标显示
    if (currentLocale === 'en-US') return '🇺🇸';
    if (currentLocale === 'ko-KR') return '🇰🇷';
    if (currentLocale === 'th-TH') return '🇹🇭';
    if (currentLocale === 'vi-VN') return '🇻🇳';
    return '🌐';
  };

  // 渲染下拉菜单模式
  if (variant === 'dropdown') {
    return (
      <div className={`relative inline-block ${className}`} onClick={(e) => e.stopPropagation()}>
        {/* 语言切换按钮 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="切换语言"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="text-xl" role="img" aria-label="language">
            {getCurrentLocaleLabel()}
          </span>
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">
            {currentLocale.split('-')[0].toUpperCase()}
          </span>
          <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            ▾
          </span>
        </button>

        {/* 下拉菜单 */}
        {isOpen && (
          <>
            {/* 背景遮罩 */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            {/* 语言列表 */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  选择语言 / Select Language
                </p>
              </div>
              
              <div className="py-1">
                {locales.map((locale) => (
                  <button
                    key={locale}
                    onClick={() => handleLocaleChange(locale)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                      currentLocale === locale ? 'bg-teal-50 text-teal-600' : 'text-gray-700'
                    }`}
                    role="menuitem"
                    aria-selected={currentLocale === locale}
                  >
                    <span className="text-2xl" role="img" aria-hidden="true">
                      {locale === 'en-US' && '🇺🇸'}
                      {locale === 'ko-KR' && '🇰🇷'}
                      {locale === 'th-TH' && '🇹🇭'}
                      {locale === 'vi-VN' && '🇻🇳'}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{localeNames[locale]}</p>
                      <p className="text-xs text-gray-500">{locale}</p>
                    </div>
                    {currentLocale === locale && (
                      <span className="text-teal-600" aria-label="selected">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // 渲染列表模式
  if (variant === 'list') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {locales.map((locale) => (
          <button
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              currentLocale === locale
                ? 'bg-[#ff5a5f] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label={`切换到 ${localeNames[locale]}`}
            aria-pressed={currentLocale === locale}
          >
            {locale.split('-')[0].toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  // 渲染图标模式
  return (
    <button
      onClick={() => {
        // 循环切换语言
        const currentIndex = locales.indexOf(currentLocale);
        const nextIndex = (currentIndex + 1) % locales.length;
        handleLocaleChange(locales[nextIndex]);
      }}
      className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${className}`}
      aria-label="切换语言"
      title={`当前语言：${localeNames[currentLocale]}`}
    >
      <span className="text-xl" role="img" aria-label="language">
        🌐
      </span>
    </button>
  );
}
