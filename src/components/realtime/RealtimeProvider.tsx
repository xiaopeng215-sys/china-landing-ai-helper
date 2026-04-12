/**
 * 实时功能全局提供者
 * 初始化 WebSocket、SSE、离线同步等
 */

'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { initWebSocket, getWebSocketManager } from '@/lib/realtime/websocket';
import { initSSE, getSSEClient } from '@/lib/realtime/sse';
import { initOfflineSync, getOfflineSyncManager } from '@/lib/realtime/offline-sync';
import { RealtimeStatus } from './RealtimeStatus';

interface RealtimeProviderProps {
  children: ReactNode;
  /** 是否显示实时状态指示器 */
  showStatusIndicator?: boolean;
  /** WebSocket URL */
  wsUrl?: string;
  /** SSE URL */
  sseUrl?: string;
  /** 是否启用离线同步 */
  enableOfflineSync?: boolean;
}

interface RealtimeContextType {
  /** WebSocket 是否已连接 */
  wsConnected: boolean;
  /** SSE 是否已连接 */
  sseConnected: boolean;
  /** 是否在线 */
  isOnline: boolean;
  /** 待同步操作数量 */
  pendingSyncCount: number;
  /** 是否正在同步 */
  isSyncing: boolean;
  /** 手动触发同步 */
  triggerSync: () => Promise<void>;
  /** 重新连接 WebSocket */
  reconnectWS: () => void;
  /** 重新连接 SSE */
  reconnectSSE: () => void;
}

const RealtimeContext = React.createContext<RealtimeContextType | undefined>(undefined);

export function RealtimeProvider({
  children,
  showStatusIndicator = true,
  wsUrl,
  sseUrl,
  enableOfflineSync = true,
}: RealtimeProviderProps) {
  const [wsConnected, setWsConnected] = useState(false);
  const [sseConnected, setSseConnected] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // 初始化实时连接
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const init = async () => {
      // 初始化 WebSocket
      const wsManager = initWebSocket(wsUrl);
      const unsubscribeWs = wsManager.onStatusChange((status) => {
        setWsConnected(status === 'connected');
      });

      // 初始化 SSE
      const sseClient = initSSE(sseUrl);
      const unsubscribeSse = sseClient.onStatusChange((status) => {
        setSseConnected(status === 'connected');
      });

      // 初始化离线同步
      let unsubscribeSync: (() => void) | undefined;
      if (enableOfflineSync) {
        const syncManager = await initOfflineSync();
        unsubscribeSync = syncManager.onStatusChange((status) => {
          setIsOnline(status.isOnline);
          setPendingSyncCount(status.pendingCount);
          setIsSyncing(status.syncing);
        });
      }

      // 网络状态监听
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      setInitialized(true);

      // 清理
      return () => {
        unsubscribeWs();
        unsubscribeSse();
        unsubscribeSync?.();
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    };

    init().catch(console.error);
  }, [wsUrl, sseUrl, enableOfflineSync]);

  // 上下文值
  const contextValue: RealtimeContextType = {
    wsConnected,
    sseConnected,
    isOnline,
    pendingSyncCount,
    isSyncing,
    triggerSync: async () => {
      if (enableOfflineSync) {
        const syncManager = getOfflineSyncManager();
        await syncManager.triggerSync();
      }
    },
    reconnectWS: () => {
      const wsManager = getWebSocketManager();
      wsManager.reconnect();
    },
    reconnectSSE: () => {
      const sseClient = getSSEClient();
      sseClient.reconnect();
    },
  };

  return (
    <RealtimeContext.Provider value={contextValue}>
      {children}
      {showStatusIndicator && initialized && (
        <RealtimeStatus
          wsConnected={wsConnected}
          sseConnected={sseConnected}
          isOnline={isOnline}
          pendingSyncCount={pendingSyncCount}
          isSyncing={isSyncing}
          onTriggerSync={contextValue.triggerSync}
          onReconnectWS={contextValue.reconnectWS}
          onReconnectSSE={contextValue.reconnectSSE}
        />
      )}
    </RealtimeContext.Provider>
  );
}

/**
 * 使用实时上下文
 */
export function useRealtime(): RealtimeContextType {
  const context = React.useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
}

export default RealtimeProvider;
