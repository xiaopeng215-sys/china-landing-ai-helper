'use client';

import { useState } from 'react';
import { useClientI18n } from '@/lib/i18n/client';
import { locales, localeNames, type Locale } from '@/lib/i18n/config';
import { loadProfile, saveProfile } from '@/lib/profile-storage';

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

interface LanguageSwitcherProps {
  variant?: 'compact' | 'full';
  className?: string;
}

/**
 * Language switcher for the UI component library.
 * Saves selection to localStorage (via useClientI18n) and TravelerProfile.
 */
export default function LanguageSwitcher({ variant = 'full', className = '' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useClientI18n();
  const [open, setOpen] = useState(false);

  const handleSelect = (loc: Locale) => {
    // 1. Update i18n context + localStorage
    setLocale(loc);

    // 2. Persist to TravelerProfile
    try {
      const profile = loadProfile();
      if (profile) {
        const updated = {
          ...profile,
          languages: [loc],
          updatedAt: Date.now(),
        };
        saveProfile(updated);
      }
    } catch {
      // non-critical — ignore storage errors
    }

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
        <span aria-hidden="true">{LOCALE_FLAGS[locale]}</span>
        <span>
          {variant === 'compact'
            ? locale.split('-')[0].toUpperCase()
            : localeNames[locale]}
        </span>
        <svg
          className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden="true" />
          <ul
            role="listbox"
            aria-label="Language options"
            className="absolute right-0 rtl:right-auto rtl:left-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden py-1"
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
                  <span aria-hidden="true">{LOCALE_FLAGS[loc]}</span>
                  <span>{localeNames[loc]}</span>
                  {locale === loc && (
                    <span className="ml-auto text-teal-600" aria-label="selected">✓</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
