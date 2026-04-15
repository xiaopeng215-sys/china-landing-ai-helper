'use client';

import React from 'react';
import { useTravelerProfile } from '@/hooks/useTravelerProfile';
import { getPersonalizedRecommendations } from '@/lib/recommendations/engine';
import RecommendationCard from './RecommendationCard';

// Skeleton card for loading state
function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
      <div className="h-36 bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="flex gap-1 mt-2">
          <div className="h-5 w-14 bg-gray-200 rounded-full" />
          <div className="h-5 w-14 bg-gray-200 rounded-full" />
        </div>
        <div className="h-8 bg-gray-200 rounded-xl mt-3" />
      </div>
    </div>
  );
}

interface RecommendationGridProps {
  limit?: number;
  onAskAI?: (message: string) => void;
}

export default function RecommendationGrid({ limit = 6, onAskAI }: RecommendationGridProps) {
  const { profile } = useTravelerProfile();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const recommendations = React.useMemo(
    () => getPersonalizedRecommendations(profile, limit),
    [profile, limit]
  );

  const isPersonalized =
    profile &&
    (profile.plannedCities.length > 0 || profile.preferences.interests.length > 0);

  return (
    <section className="px-4 mt-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            {isPersonalized ? '✨ For You' : '🔥 Popular in China'}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {isPersonalized
              ? `Based on your interest in ${profile!.plannedCities.join(', ') || 'China'}`
              : 'Top picks for first-time visitors'}
          </p>
        </div>
      </div>

      {/* Grid */}
      {!mounted ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: limit }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {recommendations.map(rec => (
            <RecommendationCard key={rec.id} recommendation={rec} onAskAI={onAskAI} />
          ))}
        </div>
      )}
    </section>
  );
}
