/**
 * 实时行程数据 Hook
 * 支持行程更新推送和离线同步
 */

'use client';

import { useCallback } from 'react';
import { useRealtimeQuery } from './useRealtimeQuery';
import { tripsApi } from '@/lib/api-client';
import { getOfflineSyncManager } from '@/lib/realtime/offline-sync';
import type { Trip } from '@/lib/types';

interface UseRealtimeTripsOptions {
  /** 轮询间隔 (ms) */
  pollInterval?: number;
  /** 是否启用实时更新 */
  realtime?: boolean;
  /** 用户 ID */
  userId?: string;
}

export function useRealtimeTrips(options: UseRealtimeTripsOptions = {}) {
  const {
    pollInterval = 60000, // 1 分钟轮询
    realtime = true,
    userId = 'current',
  } = options;

  const {
    data: trips,
    loading,
    error,
    isValidating,
    isStale,
    mutate,
    optimisticMutate,
    clearCache,
  } = useRealtimeQuery<Trip[]>(
    `trips:${userId}`,
    async () => {
      const result = await tripsApi.getList();
      const syncManager = getOfflineSyncManager();
      await syncManager.cacheData(`trips:${userId}`, result, 'trips');
      return result;
    },
    {
      pollInterval,
      realtime,
      channel: `trips:${userId}`,
      cacheTTL: 5 * 60 * 1000, // 5 分钟缓存
      optimisticUpdates: true,
    }
  );

  /**
   * 创建行程
   */
  const createTrip = useCallback(
    async (trip: Omit<Trip, 'id'>): Promise<Trip | null> => {
      const syncManager = getOfflineSyncManager();
      
      // 乐观更新
      const newTrip: Trip = {
        ...trip,
        id: String(Date.now()),
      };

      optimisticMutate((prev) => {
        if (!prev) return [newTrip];
        return [...prev, newTrip];
      });

      try {
        const result = await tripsApi.create(trip);
        await mutate();
        return result;
      } catch (error) {
        console.error('[Trips] Create failed, queuing for offline sync:', error);
        
        await syncManager.enqueueOperation('create', 'trips', {
          ...trip,
          userId,
          timestamp: Date.now(),
        });
        
        return newTrip; // 返回乐观更新的行程
      }
    },
    [optimisticMutate, mutate, userId]
  );

  /**
   * 更新行程
   */
  const updateTrip = useCallback(
    async (tripId: string, updates: Partial<Trip>): Promise<void> => {
      const syncManager = getOfflineSyncManager();

      // 乐观更新
      optimisticMutate((prev) => {
        if (!prev) return prev;
        return prev.map((trip) =>
          trip.id === tripId ? { ...trip, ...updates } : trip
        );
      });

      try {
        await tripsApi.update(tripId, updates);
        await mutate();
      } catch (error) {
        console.error('[Trips] Update failed, queuing for offline sync:', error);
        
        await syncManager.enqueueOperation('update', 'trips', {
          tripId,
          updates,
          timestamp: Date.now(),
        });
      }
    },
    [optimisticMutate, mutate]
  );

  /**
   * 删除行程
   */
  const deleteTrip = useCallback(
    async (tripId: string): Promise<void> => {
      const syncManager = getOfflineSyncManager();

      // 乐观更新
      optimisticMutate((prev) => {
        if (!prev) return prev;
        return prev.filter((trip) => trip.id !== tripId);
      });

      try {
        await tripsApi.delete(tripId);
        await mutate();
      } catch (error) {
        console.error('[Trips] Delete failed, queuing for offline sync:', error);
        
        await syncManager.enqueueOperation('delete', 'trips', {
          tripId,
          timestamp: Date.now(),
        });
      }
    },
    [optimisticMutate, mutate]
  );

  /**
   * 从缓存加载
   */
  const loadFromCache = useCallback(async (): Promise<Trip[] | null> => {
    const syncManager = getOfflineSyncManager();
    return syncManager.getFromCache<Trip[]>(`trips:${userId}`);
  }, [userId]);

  return {
    trips: trips || [],
    loading,
    error,
    isValidating,
    isStale,
    createTrip,
    updateTrip,
    deleteTrip,
    refresh: mutate,
    loadFromCache,
    clearCache,
  };
}

export default useRealtimeTrips;
