'use client';

import React from 'react';
import { type ItineraryRoute } from '@/lib/itineraries';
import { TripCard } from '@/components/trips';
import { useClientI18n } from '@/lib/i18n/client';

interface TripsListProps {
  trips: ItineraryRoute[];
  selectedCity: string;
  onTripSelect: (trip: ItineraryRoute) => void;
}

/**
 * TripsView 行程列表组件
 * 显示所有行程或筛选后的行程
 */
export default function TripsList({ trips, selectedCity, onTripSelect }: TripsListProps) {
  const { t } = useClientI18n();
  const cityName = trips[0]?.city ?? t('TripsPage.allRoutes');
  
  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900 mb-3">
        {selectedCity === 'all' ? t('TripsPage.allRoutes') : `📍 ${cityName}`}
      </h2>
      
      {trips.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-gray-100">
          <div className="text-5xl mb-3">🗺️</div>
          <p className="font-semibold text-[#484848]">{t('TripsPage.emptyTitle')}</p>
          <p className="text-sm text-[#767676] mt-1 mb-4">{t('TripsPage.emptyDesc')}</p>
          <button
            onClick={() => window.location.href = '/?tab=chat'}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all"
          >
            {t('TripsPage.emptyAction')} →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {trips.map(trip => (
            <TripCard key={trip.id} trip={trip} onViewDetails={onTripSelect} />
          ))}
        </div>
      )}
    </section>
  );
}
