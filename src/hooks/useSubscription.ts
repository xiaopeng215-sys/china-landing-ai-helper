'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export type SubscriptionTier = 'free' | 'explorer' | 'pro';

interface SubscriptionState {
  tier: SubscriptionTier;
  isProUser: boolean;
  canExport: boolean;
  dailyLimit: number;
  loading: boolean;
}

const TIER_CONFIG: Record<SubscriptionTier, { canExport: boolean; dailyLimit: number }> = {
  free:     { canExport: false, dailyLimit: 5 },
  explorer: { canExport: true,  dailyLimit: 30 },
  pro:      { canExport: true,  dailyLimit: 999 },
};

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('your-project')) return null;
  return createClient(url, key);
}

export function useSubscription(userId?: string): SubscriptionState {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }

    const supabase = getSupabase();
    if (!supabase) { setLoading(false); return; }

    supabase
      .from('user_profiles')
      .select('subscription_tier')
      .eq('user_id', userId)
      .single()
      .then(({ data }) => {
        const raw = data?.subscription_tier as string | undefined;
        if (raw === 'explorer' || raw === 'pro') setTier(raw);
        else setTier('free');
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const config = TIER_CONFIG[tier];
  return {
    tier,
    isProUser: tier === 'pro',
    canExport: config.canExport,
    dailyLimit: config.dailyLimit,
    loading,
  };
}
