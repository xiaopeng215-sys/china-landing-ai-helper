'use client';

import { useState, useEffect, useCallback } from 'react';
import { tripsApi } from '@/lib/api-client';
import type { Trip } from '@/lib/types';

interface UseTripDataReturn {
  data: Trip[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  createTrip: (trip: Omit<Trip, 'id'>) => Promise<void>;
}

export function useTripData(): UseTripDataReturn {
  const [data, setData] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await tripsApi.getList();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch trip data'));
    } finally {
      setLoading(false);
    }
  }, []);

  const createTrip = useCallback(async (trip: Omit<Trip, 'id'>) => {
    try {
      const newTrip = await tripsApi.create(trip);
      setData((prev) => [...prev, newTrip]);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create trip');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
    createTrip,
  };
}
