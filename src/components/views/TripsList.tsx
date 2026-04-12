'use client';

import React from 'react';
import { type ItineraryRoute } from '@/lib/itineraries';
import { TripCard } from '@/components/trips';

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
  const cityName = trips[0]?.city ?? 'Routes';
  
  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900 mb-3">
        {selectedCity === 'all' ? '📍 All Routes' : `📍 ${cityName}`}
      </h2>
      
      <div className="space-y-4">
        {trips.map(trip => (
          <TripCard key={trip.id} trip={trip} onViewDetails={onTripSelect} />
        ))}
      </div>
    </section>
  );
}
