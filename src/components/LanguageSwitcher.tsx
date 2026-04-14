'use client';

import { useState } from 'react';
import { useClientI18n } from '@/lib/i18n/client';
import { locales, type Locale } from '@/lib/i18n/config';

const LOCALE_FLAGS: Record<Locale, string> = {
  'en-US': '🇺🇸',
  'zh-CN': '🇨🇳',
  'zh-TW': '🇹🇼',
  'ko-KR': '🇰🇷',
  'ja-JP': '🇯🇵',
  'es-ES': '🇪🇸',
  'pt-BR': '🇧🇷',
  'ar-SA': '🇸🇦',
};

const LOCALE_LABELS: Record<Locale, string> = {
  'en-US': 'English',
  'zh-CN': '中文',
  'zh-TW': '繁體中文',
  'ko-KR': '한국어',
  'ja-JP': '日本語',
  'es-ES': 'Español',
  'pt-BR': 'Português',
  'ar-SA': 'العربية',
};

interface LanguageSwitcherProps {
  /** compact: shows only flag + short label; full: shows flag + full label */
  variant?: 'compact' | 'full';
  className?: string;
}

export default function LanguageSwitcher({ variant = 'full', className = '' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useClientI18n();
  const [open, setOpen] = useState(false);

  const handleSelect = (loc: Locale) => {
    setLocale(loc);
    setOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
        aria-label="Select language"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span>{LOCALE_FLAGS[locale]}</span>
        <span>{variant === 'compact' ? locale.split('-')[0].toUpperCase() : LOCALE_LABELS[locale]}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <ul
            role="listbox"
            className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden py-1"
          >
            {locales.map((loc) => (
              <li key={loc} role="option" aria-selected={locale === loc}>
                <button
                  onClick={() => handleSelect(loc)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                    locale === loc
                      ? 'bg-teal-50 text-teal-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{LOCALE_FLAGS[loc]}</span>
                  <span>{LOCALE_LABELS[loc]}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
