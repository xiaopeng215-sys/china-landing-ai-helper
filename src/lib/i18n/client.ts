'use client';

import {useMemo} from 'react';
import {usePathname} from 'next/navigation';
import {defaultLocale, getLocaleFromPathname, type Locale} from './config';

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

export function useClientI18n() {
  const pathname = usePathname();

  return useMemo(() => {
    const locale = getLocaleFromPathname(pathname);
    const messages = messagesMap[locale] ?? messagesMap[defaultLocale];

    const t = (key: string, fallback?: string) => {
      const value = getByPath(messages, key);
      return typeof value === 'string' ? value : (fallback ?? key);
    };

    return {locale, t};
  }, [pathname]);
}
