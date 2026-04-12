'use client';

import React, { useState, useMemo } from 'react';
import { allItineraries, getFeaturedItineraries } from '@/lib/itineraries';
import type { ItineraryRoute } from '@/lib/itineraries';
import { TripCard } from './TripCard';
import { TripDetailModal } from './TripDetailModal';

function TripCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="bg-gradient-to-r from-gray-300 to-gray-400 h-32" />
      <div className="p-6 space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TripsView() {
  const [selectedTrip, setSelectedTrip] = useState<ItineraryRoute | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const featuredTrips = useMemo(() => {
    const featured = getFeaturedItineraries(6);
    setTimeout(() => setIsLoading(false), 500);
    return featured;
  }, []);

  const allTrips = useMemo(() => {
    return allItineraries.filter(t => !featuredTrips.find(f => t.id === f.id));
  }, [featuredTrips]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#484848] mb-2">探索行程</h1>
        <p className="text-[#767676]">发现完美的中国之旅</p>
      </div>

      {/* Featured Trips */}
      <section>
        <h2 className="text-xl font-bold text-[#484848] mb-4">热门行程</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading
            ? [1, 2, 3, 4].map(i => <TripCardSkeleton key={i} />)
            : featuredTrips.map(trip => (
                <TripCard key={trip.id} trip={trip} onClick={() => setSelectedTrip(trip)} />
              ))}
        </div>
      </section>

      {/* All Trips */}
      <section>
        <h2 className="text-xl font-bold text-[#484848] mb-4">全部行程</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} onClick={() => setSelectedTrip(trip)} />
          ))}
        </div>
      </section>

      {/* Detail Modal */}
      {selectedTrip && (
        <TripDetailModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
      )}
    </div>
  );
}
