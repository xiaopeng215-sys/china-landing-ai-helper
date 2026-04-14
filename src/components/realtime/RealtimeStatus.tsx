/**
 * 实时状态指示器
 * 显示网络连接状态、同步状态等
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle, Zap, Activity } from 'lucide-react';

interface RealtimeStatusProps {
  wsConnected: boolean;
  sseConnected: boolean;
  isOnline: boolean;
  pendingSyncCount: number;
  isSyncing: boolean;
  onTriggerSync: () => Promise<void>;
  onReconnectWS: () => void;
  onReconnectSSE: () => void;
}

export function RealtimeStatus({
  wsConnected,
  sseConnected,
  isOnline,
  pendingSyncCount,
  isSyncing,
  onTriggerSync,
  onReconnectWS,
  onReconnectSSE,
}: RealtimeStatusProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // 记录最后同步时间
  useEffect(() => {
    if (!isSyncing && pendingSyncCount === 0 && lastSyncTime === null) {
      setLastSyncTime(new Date());
    } else if (!isSyncing && pendingSyncCount === 0) {
      setLastSyncTime(new Date());
    }
  }, [isSyncing, pendingSyncCount, lastSyncTime]);

  const getStatusColor = () => {
    if (!isOnline) return 'bg-red-500';
    if (isSyncing) return 'bg-yellow-500';
    if (wsConnected || sseConnected) return 'bg-green-500';
    return 'bg-gray-400';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="w-3 h-3" />;
    if (isSyncing) return <RefreshCw className="w-3 h-3 animate-spin" />;
    if (wsConnected || sseConnected) return <Zap className="w-3 h-3" />;
    return <Activity className="w-3 h-3" />;
  };

  const handleSyncClick = async () => {
    await onTriggerSync();
    setLastSyncTime(new Date());
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {/* 状态指示器 */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="relative p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200"
        aria-label="Real-time status"
      >
        <div className="relative">
          {getStatusIcon()}
          <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${getStatusColor()}`} />
        </div>

        {/* 待同步数量徽章 */}
        {pendingSyncCount > 0 && (
          <span className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {pendingSyncCount > 9 ? '9+' : pendingSyncCount}
          </span>
        )}
      </button>

      {/* 详情面板 */}
      {showDetails && (
        <div className="absolute bottom-12 right-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="space-y-3">
            {/* 标题 */}
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-semibold text-gray-900">实时状态</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* 网络状态 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">网络连接</span>
                <div className="flex items-center gap-1">
                  {isOnline ? (
                    <>
                      <Wifi className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-600">在线</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3 h-3 text-red-600" />
                      <span className="text-xs text-red-600">离线</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">WebSocket</span>
                <div className="flex items-center gap-1">
                  {wsConnected ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-600">已连接</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">未连接</span>
                    </>
                  )}
                  {!wsConnected && isOnline && (
                    <button
                      onClick={onReconnectWS}
                      className="ml-1 text-xs text-orange-600 hover:underline"
                    >
                      重连
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">SSE</span>
                <div className="flex items-center gap-1">
                  {sseConnected ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-600">已连接</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">未连接</span>
                    </>
                  )}
                  {!sseConnected && isOnline && (
                    <button
                      onClick={onReconnectSSE}
                      className="ml-1 text-xs text-orange-600 hover:underline"
                    >
                      重连
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 同步状态 */}
            <div className="border-t pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">数据同步</span>
                {isSyncing ? (
                  <span className="text-xs text-yellow-600">同步中...</span>
                ) : pendingSyncCount > 0 ? (
                  <span className="text-xs text-red-600">{pendingSyncCount} 待同步</span>
                ) : (
                  <span className="text-xs text-green-600">已同步</span>
                )}
              </div>

              {lastSyncTime && (
                <div className="text-xs text-gray-500 mb-2">
                  最后同步：{lastSyncTime.toLocaleTimeString('zh-CN')}
                </div>
              )}

              <button
                onClick={handleSyncClick}
                disabled={!isOnline || isSyncing}
                className="w-full py-1 px-2 text-xs bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSyncing ? '同步中...' : '立即同步'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RealtimeStatus;
