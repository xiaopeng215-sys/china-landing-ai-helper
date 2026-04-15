'use client';

import { useState } from 'react';
import type { SubscriptionTier } from '@/hooks/useSubscription';
import type { PlanKey } from '@/lib/stripe/client';

interface Plan {
  key: PlanKey;
  name: string;
  price: string;
  features: string[];
}

const PLANS: Plan[] = [
  {
    key: 'explorer',
    name: 'Explorer',
    price: '$9.9/mo',
    features: ['30 AI queries/day', 'Export itineraries', 'Priority support'],
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '$19.9/mo',
    features: ['Unlimited AI queries', 'Export itineraries', 'Priority support', 'Custom recommendations'],
  },
];

interface UpgradePromptProps {
  currentTier: SubscriptionTier;
  targetPlan?: PlanKey;
  userId: string;
  onClose: () => void;
}

export function UpgradePrompt({ currentTier, targetPlan, userId, onClose }: UpgradePromptProps) {
  const [loading, setLoading] = useState<PlanKey | null>(null);

  const handleUpgrade = async (plan: PlanKey) => {
    setLoading(plan);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, userId }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) window.location.href = data.url;
    } catch {
      // silent — user stays on page
    } finally {
      setLoading(null);
    }
  };

  const displayPlans = targetPlan ? PLANS.filter(p => p.key === targetPlan) : PLANS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Upgrade Your Plan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        {/* Current tier badge */}
        <p className="mb-5 text-sm text-gray-500">
          Current plan: <span className="font-semibold capitalize text-gray-700">{currentTier}</span>
        </p>

        {/* Plan cards */}
        <div className="space-y-3">
          {displayPlans.map(plan => (
            <div key={plan.key} className="rounded-xl border border-gray-200 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-gray-900">{plan.name}</span>
                <span className="text-lg font-bold text-indigo-600">{plan.price}</span>
              </div>
              <ul className="mb-3 space-y-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleUpgrade(plan.key)}
                disabled={loading === plan.key || currentTier === plan.key}
                className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading === plan.key ? 'Redirecting…' : currentTier === plan.key ? 'Current Plan' : 'Upgrade Now'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
