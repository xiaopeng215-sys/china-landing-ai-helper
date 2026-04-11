'use client';

import React from 'react';
import TripCard from '@/components/TripCard';
import Header from '@/components/layout/Header';
import { ListSkeleton } from '@/components/ui/Skeleton';
import type { Trip } from '@/lib/types';

interface TripsViewProps {
  trips: Trip[];
  loading: boolean;
  onCreateTrip: () => void;
}

export default function TripsView({ trips, loading, onCreateTrip }: TripsViewProps) {
  return (
    <div className="p-4 pb-24">
      <Header
        title="我的行程"
        rightAction={
          <button
            onClick={onCreateTrip}
            className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors"
          >
            + 新建
          </button>
        }
      />
      <div className="space-y-4 mt-4">
        {loading ? (
          <ListSkeleton count={3} />
        ) : (
          trips.map((trip) => <TripCard key={trip.id} {...trip} />)
        )}
      </div>
    </div>
  );
}
