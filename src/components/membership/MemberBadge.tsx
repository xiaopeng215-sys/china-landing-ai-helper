'use client';

import type { SubscriptionTier } from '@/hooks/useSubscription';

interface MemberBadgeProps {
  tier: SubscriptionTier;
  className?: string;
}

export function MemberBadge({ tier, className = '' }: MemberBadgeProps) {
  if (tier === 'free') return null;

  if (tier === 'explorer') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200 ${className}`}
      >
        🌟 Explorer
      </span>
    );
  }

  // pro
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-300 ${className}`}
    >
      💎 Pro
    </span>
  );
}
