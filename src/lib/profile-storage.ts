'use client';

/**
 * 旅行者档案本地存储
 * - localStorage: 客户端持久化
 * - cookie: 传递给服务端（轻量摘要）
 */

import type { TravelerProfile } from './traveler-profile';

const STORAGE_KEY = 'traveler_profile';
const COOKIE_KEY = 'tp_context';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

// ─── localStorage CRUD ────────────────────────────────────────────────────────

export function loadProfile(): TravelerProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TravelerProfile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: TravelerProfile): void {
  if (typeof window === 'undefined') return;
  try {
    profile.updatedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    syncProfileToCookie(profile);
  } catch {
    // storage quota exceeded — silently ignore
  }
}

export function deleteProfile(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  document.cookie = `${COOKIE_KEY}=; max-age=0; path=/`;
}

export function updateProfile(partial: Partial<TravelerProfile>): TravelerProfile | null {
  const existing = loadProfile();
  if (!existing) return null;
  const updated = { ...existing, ...partial, updatedAt: Date.now() };
  saveProfile(updated);
  return updated;
}

// ─── Cookie sync (server-readable summary) ───────────────────────────────────

/**
 * 将档案的关键字段写入 cookie，供服务端 API 读取注入 system prompt。
 * 只存轻量摘要，不存完整档案。
 */
function syncProfileToCookie(profile: TravelerProfile): void {
  if (typeof document === 'undefined') return;
  const summary = {
    nationality: profile.nationality,
    languages: profile.languages,
    visitPurpose: profile.visitPurpose,
    plannedCities: profile.plannedCities,
    budget: profile.preferences.budget,
    foodRestrictions: profile.preferences.foodRestrictions,
    interests: profile.preferences.interests,
    completedSteps: profile.completedSteps,
    travelDates: profile.travelDates,
  };
  const encoded = encodeURIComponent(JSON.stringify(summary));
  document.cookie = `${COOKIE_KEY}=${encoded}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
}

/**
 * 从 cookie 读取档案摘要（服务端可用）
 */
export function readProfileFromCookie(cookieHeader?: string): Partial<TravelerProfile> | null {
  const source = cookieHeader ?? (typeof document !== 'undefined' ? document.cookie : '');
  const match = source.match(new RegExp(`(?:^|;\\s*)${COOKIE_KEY}=([^;]*)`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}
