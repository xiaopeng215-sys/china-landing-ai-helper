'use client';

import React from 'react';
import type { ItineraryRoute } from '@/lib/itineraries';
import { useClientI18n } from '@/lib/i18n/client';

interface FeaturedTripsGridProps {
  trips: ItineraryRoute[];
  onTripSelect: (trip: ItineraryRoute) => void;
}

const cityEmojis: Record<string, string> = {
  Shanghai: '🗼',
  Beijing: '🏯',
  "Xi'an": '🏛️',
  Chengdu: '🐼',
  Guilin: '🏞️',
  Hangzhou: '🌸',
};

export default function FeaturedTripsGrid({ trips, onTripSelect }: FeaturedTripsGridProps) {
  const { t } = useClientI18n();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleTripClick = (trip: ItineraryRoute) => {
    setIsLoading(true);
    setTimeout(() => {
      onTripSelect(trip);
      setIsLoading(false);
    }, 150);
  };

  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900 mb-3">{t('TripsPage.featuredRoutes')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {trips.map(trip => (
          <button
            key={trip.id}
            onClick={() => handleTripClick(trip)}
            className="bg-white rounded-2xl p-4 text-left shadow-md hover:shadow-lg transition-all active:scale-[0.98] border border-gray-100 touch-manipulation"
          >
            <div className="text-3xl mb-2">
              {cityEmojis[trip.cityEn] ?? '📍'}
            </div>
            <h3 className="font-bold text-gray-900">{trip.cityEn}</h3>
            <p className="text-xs text-gray-500">{trip.days} days · {trip.budget}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {(trip.themeEn ?? trip.theme).slice(0, 2).map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 bg-teal-50 text-teal-600 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">{t('TripsPage.loading')}</p>
          </div>
        </div>
      )}
    </section>
  );
}
