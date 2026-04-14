/**
 * IP-based locale detection using ipapi.co free API
 * Mapping: KR → ko-KR, JP → ja-JP, CN → zh-CN, others → en-US
 */

const LOCALE_STORAGE_KEY = 'preferred-locale';
const SUPPORTED_LOCALES = ['en-US', 'zh-CN', 'ko-KR', 'ja-JP'] as const;

const COUNTRY_LOCALE_MAP: Record<string, string> = {
  KR: 'ko-KR',
  JP: 'ja-JP',
  CN: 'zh-CN',
};

export async function detectLocaleFromIP(): Promise<string> {
  try {
    const res = await fetch('https://ipapi.co/json/', {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return 'en-US';
    const data = await res.json();
    const countryCode: string = data?.country_code ?? '';
    return COUNTRY_LOCALE_MAP[countryCode] ?? 'en-US';
  } catch {
    return 'en-US';
  }
}

/**
 * Resolve the locale to use on app startup:
 * 1. localStorage preference (user manually selected)
 * 2. IP detection
 * 3. Fallback: en-US
 */
export async function resolveLocale(): Promise<string> {
  if (typeof window === 'undefined') return 'en-US';

  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored && (SUPPORTED_LOCALES as readonly string[]).includes(stored)) {
    return stored;
  }

  return detectLocaleFromIP();
}

export function saveLocalePreference(locale: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }
}

export function getStoredLocale(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LOCALE_STORAGE_KEY);
}
