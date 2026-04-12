/**
 * 实时聊天数据 Hook
 * 集成 WebSocket 实时更新和离线同步
 */

'use client';

import { useCallback } from 'react';
import { useRealtimeQuery } from './useRealtimeQuery';
import { messagesApi } from '@/lib/api-client';
import { getOfflineSyncManager } from '@/lib/realtime/offline-sync';
import type { Message } from '@/lib/types';

interface UseRealtimeChatOptions {
  /** 轮询间隔 (ms)，0 表示禁用 */
  pollInterval?: number;
  /** 是否启用 WebSocket 实时更新 */
  realtime?: boolean;
  /** 会话 ID */
  sessionId?: string;
}

export function useRealtimeChat(options: UseRealtimeChatOptions = {}) {
  const {
    pollInterval = 30000, // 30 秒轮询
    realtime = true,
    sessionId = 'default',
  } = options;

  // 使用实时查询 Hook
  const {
    data: messages,
    loading,
    error,
    isValidating,
    isStale,
    mutate,
    optimisticMutate,
    clearCache,
  } = useRealtimeQuery<Message[]>(
    `chat:${sessionId}`,
    async () => {
      const result = await messagesApi.getList();
      // 缓存到 IndexedDB
      const syncManager = getOfflineSyncManager();
      await syncManager.cacheData(`chat:${sessionId}`, result, 'messages');
      return result;
    },
    {
      pollInterval,
      realtime,
      channel: `chat:${sessionId}`,
      cacheTTL: 2 * 60 * 1000, // 2 分钟缓存
      optimisticUpdates: true,
    }
  );

  /**
   * 发送消息
   */
  const sendMessage = useCallback(
    async (content: string): Promise<void> => {
      const tempId = String(Date.now());
      const syncManager = getOfflineSyncManager();

      // 乐观更新 UI
      const newMessage: Message = {
        id: tempId,
        type: 'user',
        content,
        timestamp: new Date().toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      optimisticMutate((prev) => {
        if (!prev) return [newMessage];
        return [...prev, newMessage];
      });

      try {
        // 尝试发送到服务器
        await messagesApi.send(content);
        
        // 刷新获取最新数据
        await mutate();
      } catch (error) {
        console.error('[Chat] Send failed, queuing for offline sync:', error);
        
        // 离线时加入同步队列
        await syncManager.enqueueOperation('create', 'messages', {
          type: 'message',
          content,
          sessionId,
          timestamp: Date.now(),
        });
      }
    },
    [optimisticMutate, mutate, sessionId]
  );

  /**
   * 从缓存加载
   */
  const loadFromCache = useCallback(async (): Promise<Message[] | null> => {
    const syncManager = getOfflineSyncManager();
    return syncManager.getFromCache<Message[]>(`chat:${sessionId}`);
  }, [sessionId]);

  return {
    messages: messages || [],
    loading,
    error,
    isValidating,
    isStale,
    sendMessage,
    refresh: mutate,
    loadFromCache,
    clearCache,
  };
}

export default useRealtimeChat;
