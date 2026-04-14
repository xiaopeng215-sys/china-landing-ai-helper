'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { defaultLocale, type Locale, locales } from './config';
import { resolveLocale, saveLocalePreference } from './detect-locale';

import enUS from '@/messages/en-US.json';
import zhCN from '@/messages/zh-CN.json';
import koKR from '@/messages/ko-KR.json';
import jaJP from '@/messages/ja-JP.json';

type MessageTree = Record<string, unknown>;

const messagesMap: Record<Locale, MessageTree> = {
  'en-US': enUS as MessageTree,
  'zh-CN': zhCN as MessageTree,
  'ko-KR': koKR as MessageTree,
  'ja-JP': jaJP as MessageTree,
};

function getByPath(obj: MessageTree, key: string): unknown {
  return key.split('.').reduce<unknown>((acc, part) => {
    if (!acc || typeof acc !== 'object') return undefined;
    return (acc as Record<string, unknown>)[part];
  }, obj);
}

// ─── Locale Context ───────────────────────────────────────────────────────────

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  setLocale: () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  // On mount: resolve locale from localStorage or IP detection
  useEffect(() => {
    resolveLocale().then((detected) => {
      const valid = locales.includes(detected as Locale) ? (detected as Locale) : defaultLocale;
      setLocaleState(valid);
    });
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    saveLocalePreference(newLocale);
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useClientI18n() {
  const { locale, setLocale } = useContext(LocaleContext);
  const messages = messagesMap[locale] ?? messagesMap[defaultLocale];

  const t = useCallback(
    (key: string, fallback?: string) => {
      const value = getByPath(messages, key);
      return typeof value === 'string' ? value : (fallback ?? key);
    },
    [messages],
  );

  return { locale, setLocale, t };
}
