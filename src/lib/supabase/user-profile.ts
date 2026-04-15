/**
 * Supabase 用户档案 CRUD
 * 操作 user_profiles 表，与 localStorage 双写保持同步
 */

import { createClient } from '@supabase/supabase-js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TravelerProfile {
  userId: string;
  nationality: string;
  languages: string[];
  plannedCities: string[];
  budget: 'budget' | 'mid' | 'luxury';
  interests: string[];
  foodRestrictions: string[];
  visitPurpose: 'tourism' | 'business' | 'study' | 'other';
  completedSteps: {
    visa: boolean;
    payment: boolean;
    sim: boolean;
    vpn: boolean;
    accommodation: boolean;
  };
  onboardingDone: boolean;
  createdAt: string;
  updatedAt: string;
}

// DB row → app type
function rowToProfile(row: Record<string, unknown>): TravelerProfile {
  return {
    userId: row.user_id as string,
    nationality: (row.nationality as string) ?? '',
    languages: (row.languages as string[]) ?? ['en-US'],
    plannedCities: (row.planned_cities as string[]) ?? [],
    budget: (row.budget as TravelerProfile['budget']) ?? 'mid',
    interests: (row.interests as string[]) ?? [],
    foodRestrictions: (row.food_restrictions as string[]) ?? [],
    visitPurpose: (row.visit_purpose as TravelerProfile['visitPurpose']) ?? 'tourism',
    completedSteps: (row.completed_steps as TravelerProfile['completedSteps']) ?? {
      visa: false, payment: false, sim: false, vpn: false, accommodation: false,
    },
    onboardingDone: (row.onboarding_done as boolean) ?? false,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// ─── Supabase client (lazy) ───────────────────────────────────────────────────

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('your-project')) return null;
  return createClient(url, key);
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * 读取用户档案，不存在返回 null
 */
export async function getUserProfile(userId: string): Promise<TravelerProfile | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;
  return rowToProfile(data);
}

/**
 * 创建或更新用户档案（upsert）
 */
export async function upsertUserProfile(
  userId: string,
  profile: Partial<Omit<TravelerProfile, 'userId' | 'createdAt' | 'updatedAt'>>,
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  const row: Record<string, unknown> = { user_id: userId };
  if (profile.nationality !== undefined) row.nationality = profile.nationality;
  if (profile.languages !== undefined) row.languages = profile.languages;
  if (profile.plannedCities !== undefined) row.planned_cities = profile.plannedCities;
  if (profile.budget !== undefined) row.budget = profile.budget;
  if (profile.interests !== undefined) row.interests = profile.interests;
  if (profile.foodRestrictions !== undefined) row.food_restrictions = profile.foodRestrictions;
  if (profile.visitPurpose !== undefined) row.visit_purpose = profile.visitPurpose;
  if (profile.completedSteps !== undefined) row.completed_steps = profile.completedSteps;
  if (profile.onboardingDone !== undefined) row.onboarding_done = profile.onboardingDone;

  await supabase.from('user_profiles').upsert(row, { onConflict: 'user_id' });
}

/**
 * 检查用户是否已完成 onboarding
 */
export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);
  return profile?.onboardingDone ?? false;
}
