'use client';

import { useState, useCallback } from 'react';
import { transportApi } from '@/lib/api-client';
import type { TransportOption } from '@/lib/types';

interface UseTransportDataReturn {
  routes: TransportOption[];
  loading: boolean;
  error: Error | null;
  from: string;
  to: string;
  setFrom: (from: string) => void;
  setTo: (to: string) => void;
  searchRoutes: () => Promise<void>;
}

export function useTransportData(): UseTransportDataReturn {
  const [routes, setRoutes] = useState<TransportOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const searchRoutes = useCallback(async () => {
    if (!from.trim() || !to.trim()) {
      setError(new Error('请输入起点和终点'));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await transportApi.getRoutes(from, to);
      setRoutes(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('查询失败，请稍后重试'));
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  return {
    routes,
    loading,
    error,
    from,
    to,
    setFrom,
    setTo,
    searchRoutes,
  };
}
