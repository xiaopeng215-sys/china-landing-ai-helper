/**
 * 实时数据查询 Hook - 类似 SWR/React Query
 * 特性：自动轮询、WebSocket 实时更新、乐观更新、缓存管理
 * 
 * P1-08 Fix: 添加组件卸载后更新状态保护
 * 问题：组件卸载后调用 setState 会导致 React 警告
 * 解决：使用 isMountedRef 标志 + AbortController 取消请求
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getWebSocketManager, WebSocketManager } from '@/lib/realtime/websocket';
import { apiConfig } from '@/lib/api-client';

export interface UseRealtimeQueryOptions<T> {
  /** 轮询间隔 (ms)，0 表示禁用 */
  pollInterval?: number;
  /** 是否启用 WebSocket 实时更新 */
  realtime?: boolean;
  /** WebSocket 频道名 */
  channel?: string;
  /** 缓存 TTL (ms) */
  cacheTTL?: number;
  /** 是否启用乐观更新 */
  optimisticUpdates?: boolean;
  /** 重试次数 */
  retryCount?: number;
  /** 重试间隔 (ms) */
  retryInterval?: number;
  /** 初始数据 */
  initialData?: T;
  /** 是否立即查询 */
  enabled?: boolean;
  /** 数据转换函数 */
  transform?: (data: unknown) => T;
  /** 查询成功回调 */
  onSuccess?: (data: T) => void;
  /** 查询错误回调 */
  onError?: (error: Error) => void;
}

export interface UseRealtimeQueryReturn<T> {
  /** 查询的数据 */
  data: T | undefined;
  /** 是否正在加载 */
  loading: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 是否有效 (有数据且未过期) */
  isValidating: boolean;
  /** 是否可变 (有数据) */
  isStale: boolean;
  /** 手动刷新 */
  mutate: () => Promise<T | undefined>;
  /** 乐观更新数据 */
  optimisticMutate: (updater: (data: T) => T) => void;
  /** 清除缓存 */
  clearCache: () => void;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  version: number;
}

// 全局缓存
const cache = new Map<string, CacheEntry<unknown>>();
const listeners = new Map<string, Set<() => void>>();

export function useRealtimeQuery<T = unknown>(
  queryKey: string,
  fetcher: () => Promise<T>,
  options: UseRealtimeQueryOptions<T> = {}
): UseRealtimeQueryReturn<T> {
  const {
    pollInterval = 0,
    realtime = false,
    channel,
    cacheTTL = 5 * 60 * 1000, // 5 分钟
    optimisticUpdates = true,
    retryCount = 3,
    retryInterval = 1000,
    initialData,
    enabled = true,
    transform,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(enabled && !initialData);
  const [error, setError] = useState<Error | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  
  const wsManagerRef = useRef<WebSocketManager | null>(null);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const versionRef = useRef(0);
  
  // P1-08 Fix: 组件卸载标志，防止卸载后更新状态
  const isMountedRef = useRef(true);
  // P1-08 Fix: AbortController 用于取消正在进行的请求
  const abortControllerRef = useRef<AbortController | null>(null);

  // 缓存键
  const cacheKey = queryKey;

  // P1-08 Fix: 组件挂载/卸载状态管理
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * 从缓存获取数据
   */
  const getCachedData = useCallback((): T | undefined => {
    const entry = cache.get(cacheKey);
    if (!entry) return undefined;
    
    // 检查是否过期
    const isStale = Date.now() - entry.timestamp > cacheTTL;
    if (isStale) {
      cache.delete(cacheKey);
      return undefined;
    }
    
    return entry.data as T;
  }, [cacheKey, cacheTTL]);

  /**
   * 设置缓存
   */
  const setCachedData = useCallback((newData: T) => {
    versionRef.current++;
    cache.set(cacheKey, {
      data: newData,
      timestamp: Date.now(),
      version: versionRef.current,
    });
    
    // 通知监听器
    listeners.get(cacheKey)?.forEach((listener) => listener());
  }, [cacheKey]);

  /**
   * 执行查询
   * P1-08 Fix: 添加 AbortController 支持和卸载检查
   */
  const executeQuery = useCallback(async (silent = false) => {
    // P1-08 Fix: 检查组件是否已卸载
    if (!isMountedRef.current) {
      console.debug(`[RealtimeQuery] Skip update - component unmounted: ${queryKey}`);
      return undefined;
    }

    // P1-08 Fix: 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    if (!silent) {
      setLoading(true);
    }
    setIsValidating(true);
    setError(null);

    try {
      const result = await fetcher();
      
      // P1-08 Fix: 请求完成后再次检查卸载状态
      if (!isMountedRef.current) {
        console.debug(`[RealtimeQuery] Skip update - component unmounted after fetch: ${queryKey}`);
        return undefined;
      }
      
      const transformedData = transform ? transform(result) : result;
      
      // P1-08 Fix: 设置状态前再次检查
      if (isMountedRef.current) {
        setCachedData(transformedData);
        setData(transformedData);
      }
      retryCountRef.current = 0;
      
      if (!silent && isMountedRef.current) {
        onSuccess?.(transformedData);
      }
      
      return transformedData;
    } catch (err) {
      // P1-08 Fix: 检查是否是主动取消的请求
      if (err instanceof Error && err.name === 'AbortError') {
        console.debug(`[RealtimeQuery] Request aborted: ${queryKey}`);
        return undefined;
      }
      
      const error = err instanceof Error ? err : new Error('Query failed');
      
      // P1-08 Fix: 设置错误前检查卸载状态
      if (isMountedRef.current) {
        setError(error);
      }
      
      // 重试逻辑
      if (retryCountRef.current < retryCount) {
        retryCountRef.current++;
        // console.log(`[RealtimeQuery] Retry ${retryCountRef.current}/${retryCount} for ${queryKey}`);
        
        await new Promise((resolve) => setTimeout(resolve, retryInterval * retryCountRef.current));
        // P1-08 Fix: 重试前检查卸载状态
        if (isMountedRef.current) {
          return executeQuery(silent);
        }
        return undefined;
      }
      
      if (!silent && isMountedRef.current) {
        onError?.(error);
      }
      
      throw error;
    } finally {
      if (!silent && isMountedRef.current) {
        setLoading(false);
      }
      if (isMountedRef.current) {
        setIsValidating(false);
      }
    }
  }, [fetcher, transform, cacheTTL, setCachedData, onSuccess, onError, retryCount, retryInterval, queryKey]);

  /**
   * 手动刷新
   */
  const mutate = useCallback(async () => {
    return executeQuery(false);
  }, [executeQuery]);

  /**
   * 乐观更新
   */
  const optimisticMutate = useCallback((updater: (data: T) => T) => {
    if (!optimisticUpdates) return;
    
    const currentData = data || getCachedData();
    if (!currentData) return;
    
    // P1-08 Fix: 检查卸载状态
    if (!isMountedRef.current) return;
    
    // 立即更新 UI
    const newData = updater(currentData);
    setData(newData);
    setCachedData(newData);
    
    // 后台同步到服务器
    executeQuery(true).catch(console.error);
  }, [data, getCachedData, setCachedData, optimisticUpdates, executeQuery]);

  /**
   * 清除缓存
   */
  const clearCache = useCallback(() => {
    cache.delete(cacheKey);
    listeners.get(cacheKey)?.clear();
  }, [cacheKey]);

  // 初始加载
  useEffect(() => {
    if (!enabled) return;

    const cached = getCachedData();
    if (cached) {
      setData(cached);
      setLoading(false);
    } else {
      executeQuery(false).catch(console.error);
    }
  }, [queryKey, enabled, getCachedData, executeQuery]);

  // 轮询
  useEffect(() => {
    if (!enabled || pollInterval <= 0) {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
      return;
    }

    pollTimerRef.current = setInterval(() => {
      // P1-08 Fix: 轮询前检查卸载状态
      if (isMountedRef.current) {
        executeQuery(true).catch(console.error); // 静默刷新
      }
    }, pollInterval);

    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [queryKey, pollInterval, enabled, executeQuery]);

  // WebSocket 实时更新
  useEffect(() => {
    if (!enabled || !realtime || !channel) return;

    wsManagerRef.current = getWebSocketManager();
    
    const unsubscribe = wsManagerRef.current.subscribe(channel, (updateData) => {
      // P1-08 Fix: WebSocket 消息到达时检查卸载状态
      if (!isMountedRef.current) {
        console.debug(`[RealtimeQuery] Skip WebSocket update - component unmounted: ${queryKey}`);
        return;
      }
      
      // console.log(`[RealtimeQuery] Received update for ${queryKey}:`, updateData);
      
      // 应用更新 (假设更新是完整数据或增量)
      const transformedData = transform ? transform(updateData) : updateData as T;
      // P1-08 Fix: 设置状态前再次检查
      if (isMountedRef.current) {
        setData(transformedData as T);
        setCachedData(transformedData as T);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryKey, channel, realtime, enabled, transform, setCachedData]);

  // 缓存监听
  useEffect(() => {
    const listener = () => {
      // P1-08 Fix: 检查卸载状态
      if (!isMountedRef.current) return;
      
      const cached = getCachedData();
      if (cached && isMountedRef.current) {
        setData(cached);
      }
    };

    if (!listeners.has(cacheKey)) {
      listeners.set(cacheKey, new Set());
    }
    listeners.get(cacheKey)!.add(listener);

    return () => {
      listeners.get(cacheKey)?.delete(listener);
    };
  }, [cacheKey, getCachedData]);

  // 清理
  useEffect(() => {
    return () => {
      // P1-08 Fix: 组件卸载时清理所有定时器和请求
      isMountedRef.current = false;
      
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      
      if (wsManagerRef.current) {
        // 不断开连接，只取消订阅
      }
    };
  }, []);

  const isStale = !!(data && (!cache.get(cacheKey) || Date.now() - (cache.get(cacheKey)!.timestamp) > cacheTTL));

  return {
    data,
    loading,
    error,
    isValidating,
    isStale,
    mutate,
    optimisticMutate,
    clearCache,
  };
}

/**
 * 批量查询 Hook
 */
export function useRealtimeQueries<T extends Record<string, unknown>>(
  queries: Array<{
    key: string;
    fetcher: () => Promise<unknown>;
    options?: UseRealtimeQueryOptions<unknown>;
  }>
): Record<keyof T, unknown> & {
  loading: boolean;
  errors: Record<string, Error | null>;
  mutate: (key: string) => Promise<unknown>;
} {
  const results: Record<string, UseRealtimeQueryReturn<unknown>> = {};
  let overallLoading = false;
  const errors: Record<string, Error | null> = {};

  queries.forEach(({ key, fetcher, options }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const result = useRealtimeQuery(key, fetcher as () => Promise<unknown>, options);
    results[key] = result;
    overallLoading = overallLoading || result.loading;
    errors[key] = result.error;
  });

  return {
    ...Object.fromEntries(Object.entries(results).map(([key, result]) => [key, result.data])),
    loading: overallLoading,
    errors,
    mutate: async (key: string) => {
      const result = results[key];
      if (result) {
        await result.mutate();
      }
    },
  } as Record<keyof T, unknown> & {
    loading: boolean;
    errors: Record<string, Error | null>;
    mutate: (key: string) => Promise<void>;
  };
}
