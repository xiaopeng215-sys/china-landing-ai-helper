'use client';

import { useState, useEffect, useCallback } from 'react';
import { foodApi } from '@/lib/api-client';
import type { Restaurant } from '@/lib/types';

interface UseFoodDataReturn {
  data: Restaurant[];
  loading: boolean;
  error: Error | null;
  category: string | undefined;
  setCategory: (category: string | undefined) => void;
  refresh: () => Promise<void>;
}

export function useFoodData(initialCategory?: string): UseFoodDataReturn {
  const [data, setData] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [category, setCategory] = useState<string | undefined>(initialCategory);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await foodApi.getList(category);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch food data'));
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
