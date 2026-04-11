'use client';

import { useState, useEffect, useCallback } from 'react';
import { attractionApi } from '@/lib/api-client';
import type { Attraction } from '@/lib/types';

interface UseAttractionDataReturn {
  data: Attraction[];
  loading: boolean;
  error: Error | null;
  category: string | undefined;
  setCategory: (category: string | undefined) => void;
  refresh: () => Promise<void>;
}

export function useAttractionData(initialCategory?: string): UseAttractionDataReturn {
  const [data, setData] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [category, setCategory] = useState<string | undefined>(initialCategory);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await attractionApi.getList(category);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch attraction data'));
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    category,
    setCategory,
    refresh: fetchData,
  };
}
