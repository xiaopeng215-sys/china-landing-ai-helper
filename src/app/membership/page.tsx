'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSubscription } from '@/hooks/useSubscription';
import { UpgradePrompt } from '@/components/paywall/UpgradePrompt';
import type { PlanKey } from '@/lib/stripe/client';

interface PlanFeature {
  label: string;
  free: boolean;
  explorer: boolean;
  pro: boolean;
}

const FEATURES: PlanFeature[] = [
  { label: 'AI Chat',                  free: true,  explorer: true,  pro: true  },
  { label: 'Trip Planning',            free: true,  explorer: true,  pro: true  },
  { label: 'Daily AI queries',         free: false, explorer: false, pro: false }, // rendered separately
  { label: 'Export itinerary (PDF)',   free: false, explorer: true,  pro: true  },
  { label: 'Priority support',         free: false, explorer: true,  pro: true  },
  { label: 'Custom recommendations',  free: false, explorer: false, pro: true  },
  { label: 'Unlimited AI queries',     free: false, explorer: false, pro: true  },
];

const DAILY_LIMITS: Record<string, string> = {
  free: '5 / day',
  explorer: '30 / day',
  pro: 'Unlimited',
};

const PRICES: Record<string, string> = {
  free: 'Free',
  explorer: '$9.9/mo',
  pro: '$19.9/mo',
};

const TIER_ICONS: Record<string, string> = {
  free: '🆓',
  explorer: '🌟',
  pro: '💎',
};

type Tier = 'free' | 'explorer' | 'pro';
const TIERS: Tier[] = ['free', 'explorer', 'pro'];

function Check() {
  return <span className="text-green-500 font-bold">✅</span>;
}
function Cross() {
  return <span className="text-gray-300">❌</span>;
}

export default function MembershipPage() {
  const { data: session } = useSession();
  const { tier, loading } = useSubscription(session?.user?.id);
  const [upgradeTarget, setUpgradeTarget] = useState<PlanKey | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-4 pt-10 pb-8 text-center">
        <h1 className="text-2xl font-bold mb-1">Choose Your Plan</h1>
        <p className="text-teal-100 text-sm">Unlock the full China travel experience</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-4 space-y-4">
        {TIERS.map((t) => {
          const isCurrent = tier === t;
          const isUpgradeable = t !== 'free' && tier !== t && (
            t === 'pro' || tier === 'free'
          );

          return (
            <div
              key={t}
              className={`bg-white rounded-2xl shadow-sm border-2 p-5 transition-all ${
                isCurrent
                  ? 'border-teal-500 ring-2 ring-teal-200'
                  : 'border-gray-100'
              }`}
            >
              {/* Plan header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{TIER_ICONS[t]}</span>
                  <div>
                    <h2 className="font-bold text-gray-800 capitalize">{t}</h2>
                    {isCurrent && (
                      <span className="text-xs text-teal-600 font-semibold">Current Plan</span>
                    )}
                  </div>
                </div>
                <span className="text-lg font-bold text-teal-600">{PRICES[t]}</span>
              </div>

              {/* Daily limit highlight */}
              <div className="bg-gray-50 rounded-xl px-3 py-2 mb-4 flex items-center justify-between">
                <span className="text-sm text-gray-600">Daily AI queries</span>
                <span className="text-sm font-semibold text-gray-800">{DAILY_LIMITS[t]}</span>
              </div>

              {/* Feature list */}
              <ul className="space-y-2 mb-5">
                {FEATURES.filter(f => f.label !== 'Daily AI queries').map((feature) => {
                  const enabled = feature[t as keyof PlanFeature] as boolean;
                  return (
                    <li key={feature.label} className="flex items-center gap-2 text-sm">
                      {enabled ? <Check /> : <Cross />}
                      <span className={enabled ? 'text-gray-700' : 'text-gray-400'}>
                        {feature.label}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* CTA */}
              {isCurrent ? (
                <button
                  disabled
                  className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-400 font-semibold text-sm cursor-default"
                >
                  Current Plan
                </button>
              ) : isUpgradeable ? (
                <button
                  onClick={() => setUpgradeTarget(t as PlanKey)}
                  className="w-full py-2.5 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 transition-colors"
                >
                  Upgrade to {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* UpgradePrompt modal */}
      {upgradeTarget && session?.user?.id && (
        <UpgradePrompt
          currentTier={tier}
          targetPlan={upgradeTarget}
          userId={session.user.id}
          onClose={() => setUpgradeTarget(null)}
        />
      )}
    </div>
  );
}
