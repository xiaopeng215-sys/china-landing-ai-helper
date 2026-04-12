/**
 * 实时内容更新系统导出
 * 
 * 包含：
 * - WebSocket 连接管理
 * - SSE 客户端
 * - 离线数据同步
 * - 实时查询 Hooks
 */

// WebSocket
export {
  WebSocketManager,
  getWebSocketManager,
  initWebSocket,
} from './websocket';

export type { WebSocketConfig } from './websocket';

// SSE
export {
  SSEClient,
  getSSEClient,
  initSSE,
} from './sse';

export type { SSEConfig, SSEEvent } from './sse';

// 离线同步
export {
  OfflineSyncManager,
  getOfflineSyncManager,
  initOfflineSync,
} from './offline-sync';

export type { SyncConfig, SyncOperation } from './offline-sync';
