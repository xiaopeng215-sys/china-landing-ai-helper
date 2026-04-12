'use client';

import React, { useState, useMemo } from 'react';
import { allItineraries, getFeaturedItineraries, type ItineraryRoute } from '@/lib/itineraries';
import { 
  TripDetailModal,
  FeaturedTripsGrid,
  MoreDestinations,
} from '@/components/trips';
import TripsViewHeader from './TripsViewHeader';
import TripsHeroCard from './TripsHeroCard';
import TripsList from './TripsList';
import TripsLoadingOverlay from './TripsLoadingOverlay';

export default function TripsView() {
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedTrip, setSelectedTrip] = useState<ItineraryRoute | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredTrips = useMemo(() => {
    if (selectedCity === 'all') return allItineraries;
    return allItineraries.filter(t => t.id === selectedCity);
  }, [selectedCity]);

  const featuredTrips = getFeaturedItineraries(3);

  const handleTripSelect = (trip: ItineraryRoute) => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedTrip(trip);
      setIsLoading(false);
    }, 150);
  };

  const handleDestinationSelect = (city: string) => {
    setSelectedCity(city);
  };

  const handlePlanTrip = () => {
    // TODO: Navigate to AI trip planner
    console.log('Navigate to AI trip planner');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TripsViewHeader selectedCity={selectedCity} onCitySelect={setSelectedCity} />

      <main className="max-w-3xl mx-auto px-4 py-4 space-y-6">
        <TripsHeroCard onPlanTrip={handlePlanTrip} />

        {selectedCity === 'all' && (
          <FeaturedTripsGrid trips={featuredTrips} onTripSelect={handleTripSelect} />
        )}

        <TripsList 
          trips={filteredTrips} 
          selectedCity={selectedCity} 
          onTripSelect={handleTripSelect} 
        />

        <MoreDestinations onDestinationSelect={handleDestinationSelect} />
      </main>

      {selectedTrip && (
        <TripDetailModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
      )}

      {isLoading && <TripsLoadingOverlay />}
    </div>
  );
}
