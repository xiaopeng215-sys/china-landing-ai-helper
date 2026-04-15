'use client';

import { useState, useEffect, useCallback } from 'react';
import type { TravelerProfile } from '@/lib/traveler-profile';
import { createEmptyProfile } from '@/lib/traveler-profile';
import { loadProfile, saveProfile, updateProfile as storageUpdate } from '@/lib/profile-storage';

// ─── Keyword extractors ───────────────────────────────────────────────────────

const NATIONALITY_PATTERNS: [RegExp, string][] = [
  [/\b(american|from the us|from america|us citizen)\b/i, 'American'],
  [/\b(british|from the uk|from england|uk citizen)\b/i, 'British'],
  [/\b(french|from france)\b/i, 'French'],
  [/\b(german|from germany)\b/i, 'German'],
  [/\b(japanese|from japan)\b/i, 'Japanese'],
  [/\b(korean|from korea)\b/i, 'Korean'],
  [/\b(australian|from australia)\b/i, 'Australian'],
  [/\b(canadian|from canada)\b/i, 'Canadian'],
  [/\b(indian|from india)\b/i, 'Indian'],
  [/\b(singaporean|from singapore)\b/i, 'Singaporean'],
];

const CITY_PATTERNS: [RegExp, string][] = [
  [/\bbeijing\b/i, 'Beijing'],
  [/\bshanghai\b/i, 'Shanghai'],
  [/\bchengdu\b/i, 'Chengdu'],
  [/\bxi'?an\b/i, "Xi'an"],
  [/\bguilin\b/i, 'Guilin'],
  [/\bhangzhou\b/i, 'Hangzhou'],
  [/\bshenzhen\b/i, 'Shenzhen'],
  [/\bguangzhou\b/i, 'Guangzhou'],
  [/\bkunming\b/i, 'Kunming'],
  [/\bchongqing\b/i, 'Chongqing'],
  [/\byangshu?o\b/i, 'Yangshuo'],
  [/\bsuzhou\b/i, 'Suzhou'],
];

const STEP_PATTERNS: { key: keyof TravelerProfile['completedSteps']; pattern: RegExp }[] = [
  { key: 'visa', pattern: /\b(got|have|applied|approved|sorted).{0,20}visa\b/i },
  { key: 'payment', pattern: /\b(set up|have|got|linked).{0,20}(alipay|wechat pay|payment)\b/i },
  { key: 'sim', pattern: /\b(got|have|bought|purchased).{0,20}(sim|esim|data plan)\b/i },
  { key: 'vpn', pattern: /\b(have|got|installed|set up).{0,20}vpn\b/i },
  { key: 'accommodation', pattern: /\b(booked|have|reserved).{0,20}(hotel|hostel|accommodation|airbnb)\b/i },
];

const BUDGET_PATTERNS: [RegExp, TravelerProfile['preferences']['budget']][] = [
  [/\b(budget|cheap|backpack|hostel|low.?cost)\b/i, 'budget'],
  [/\b(luxury|5.?star|high.?end|premium|splurge)\b/i, 'luxury'],
];

const FOOD_RESTRICTION_PATTERNS: [RegExp, string][] = [
  [/\bvegetarian\b/i, 'vegetarian'],
  [/\bvegan\b/i, 'vegan'],
  [/\bhalal\b/i, 'halal'],
  [/\bkosher\b/i, 'kosher'],
  [/\bgluten.?free\b/i, 'gluten-free'],
  [/\bno pork\b/i, 'no pork'],
  [/\bno beef\b/i, 'no beef'],
  [/\bnut allerg/i, 'nut allergy'],
];

const INTEREST_PATTERNS: [RegExp, string][] = [
  [/\b(history|historical|ancient|heritage)\b/i, 'history'],
  [/\b(food|cuisine|eat|restaurant|street food)\b/i, 'food'],
  [/\b(nature|hiking|mountain|park|outdoor)\b/i, 'nature'],
  [/\b(art|museum|gallery|culture)\b/i, 'art & culture'],
  [/\b(shopping|market|mall)\b/i, 'shopping'],
  [/\b(nightlife|bar|club|party)\b/i, 'nightlife'],
  [/\b(temple|buddhist|taoist|spiritual)\b/i, 'spirituality'],
  [/\b(photography|photo)\b/i, 'photography'],
];

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTravelerProfile() {
  const [profile, setProfile] = useState<TravelerProfile | null>(null);

  // Load on mount
  useEffect(() => {
    const stored = loadProfile();
    if (stored) {
      setProfile(stored);
    } else {
      const fresh = createEmptyProfile();
      saveProfile(fresh);
      setProfile(fresh);
    }
  }, []);

  const updateProfile = useCallback((partial: Partial<TravelerProfile>) => {
    setProfile(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...partial, updatedAt: Date.now() };
      saveProfile(updated);
      return updated;
    });
  }, []);

  /**
   * 从对话消息中自动提取信息并更新档案
   */
  const updateFromConversation = useCallback((message: string) => {
    setProfile(prev => {
      if (!prev) return prev;
      const updates: Partial<TravelerProfile> = {};

      // Nationality
      if (!prev.nationality) {
        for (const [pattern, value] of NATIONALITY_PATTERNS) {
          if (pattern.test(message)) {
            updates.nationality = value;
            break;
          }
        }
      }

      // Cities
      const newCities = CITY_PATTERNS
        .filter(([pattern]) => pattern.test(message))
        .map(([, city]) => city)
        .filter(city => !prev.plannedCities.includes(city));
      if (newCities.length > 0) {
        updates.plannedCities = [...prev.plannedCities, ...newCities];
      }

      // Completed steps
      const stepUpdates: Partial<TravelerProfile['completedSteps']> = {};
      let hasStepUpdate = false;
      for (const { key, pattern } of STEP_PATTERNS) {
        if (!prev.completedSteps[key] && pattern.test(message)) {
          stepUpdates[key] = true;
          hasStepUpdate = true;
        }
      }
      if (hasStepUpdate) {
        updates.completedSteps = { ...prev.completedSteps, ...stepUpdates };
      }

      // Budget
      for (const [pattern, value] of BUDGET_PATTERNS) {
        if (pattern.test(message)) {
          updates.preferences = { ...prev.preferences, budget: value };
          break;
        }
      }

      // Food restrictions
      const newRestrictions = FOOD_RESTRICTION_PATTERNS
        .filter(([pattern]) => pattern.test(message))
        .map(([, value]) => value)
        .filter(r => !prev.preferences.foodRestrictions.includes(r));
      if (newRestrictions.length > 0) {
        updates.preferences = {
          ...(updates.preferences ?? prev.preferences),
          foodRestrictions: [...prev.preferences.foodRestrictions, ...newRestrictions],
        };
      }

      // Interests
      const newInterests = INTEREST_PATTERNS
        .filter(([pattern]) => pattern.test(message))
        .map(([, value]) => value)
        .filter(i => !prev.preferences.interests.includes(i));
      if (newInterests.length > 0) {
        updates.preferences = {
          ...(updates.preferences ?? prev.preferences),
          interests: [...prev.preferences.interests, ...newInterests],
        };
      }

      if (Object.keys(updates).length === 0) return prev;

      const updated = { ...prev, ...updates, updatedAt: Date.now() };
      saveProfile(updated);
      return updated;
    });
  }, []);

  /**
   * 追加对话摘要（保留最近10条）
   */
  const appendChatSummary = useCallback((role: 'user' | 'assistant', summary: string) => {
    setProfile(prev => {
      if (!prev) return prev;
      const entry = { role, summary: summary.slice(0, 200), timestamp: Date.now() };
      const history = [...prev.chatHistory, entry].slice(-10);
      const updated = { ...prev, chatHistory: history, updatedAt: Date.now() };
      saveProfile(updated);
      return updated;
    });
  }, []);

  /**
   * 生成个性化 context 字符串，注入到 AI system prompt
   */
  const getPersonalizedContext = useCallback((): string => {
    if (!profile) return '';

    const parts: string[] = ['[TRAVELER PROFILE]'];

    if (profile.nationality) parts.push(`Nationality: ${profile.nationality}`);
    if (profile.visitPurpose) parts.push(`Visit purpose: ${profile.visitPurpose}`);
    if (profile.plannedCities.length > 0) parts.push(`Planned cities: ${profile.plannedCities.join(', ')}`);
    if (profile.travelDates) parts.push(`Travel dates: ${profile.travelDates.arrival} → ${profile.travelDates.departure}`);

    parts.push(`Budget: ${profile.preferences.budget}`);

    if (profile.preferences.foodRestrictions.length > 0) {
      parts.push(`Food restrictions: ${profile.preferences.foodRestrictions.join(', ')}`);
    }
    if (profile.preferences.interests.length > 0) {
      parts.push(`Interests: ${profile.preferences.interests.join(', ')}`);
    }

    const steps = profile.completedSteps;
    const done = Object.entries(steps).filter(([, v]) => v).map(([k]) => k);
    const pending = Object.entries(steps).filter(([, v]) => !v).map(([k]) => k);
    if (done.length > 0) parts.push(`Completed prep: ${done.join(', ')}`);
    if (pending.length > 0) parts.push(`Still needs: ${pending.join(', ')}`);

    if (profile.chatHistory.length > 0) {
      parts.push('Recent conversation context:');
      profile.chatHistory.slice(-5).forEach(h => {
        parts.push(`  [${h.role}]: ${h.summary}`);
      });
    }

    parts.push('[/TRAVELER PROFILE]');
    return parts.join('\n');
  }, [profile]);

  return {
    profile,
    updateProfile,
    updateFromConversation,
    appendChatSummary,
    getPersonalizedContext,
  };
}
