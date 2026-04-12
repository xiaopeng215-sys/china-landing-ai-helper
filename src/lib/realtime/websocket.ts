/**
 * WebSocket 实时连接管理
 * 特性：自动重连、心跳检测、消息队列、离线缓存
 */

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

export interface WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  messageQueueSize?: number;
}

interface QueuedMessage {
  data: string;
  timestamp: number;
  retryCount: number;
}

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private status: WebSocketStatus = 'disconnected';
  private reconnectAttempts = 0;
  private messageQueue: QueuedMessage[] = [];
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private listeners: Map<string, Set<(data: unknown) => void>> = new Map();
  private statusListeners: Set<(status: WebSocketStatus) => void> = new Set();
  private lastPongTime: number = 0;

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 30000,
      messageQueueSize: 100,
      ...config,
    };
  }

  /**
   * 连接 WebSocket 服务器
   */
  connect(): void {
    if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.setStatus('connecting');

    try {
      this.ws = new WebSocket(this.config.url);

      this.ws.onopen = () => {
        console.log('[WebSocket] Connected');
        this.setStatus('connected');
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.flushMessageQueue();
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.ws.onclose = (event) => {
        console.log(`[WebSocket] Closed: ${event.code} ${event.reason}`);
        this.setStatus('disconnected');
        this.stopHeartbeat();
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
        this.emit('error', { error });
      };
    } catch (error) {
      console.error('[WebSocket] Connection failed:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    this.stopHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }

    this.setStatus('disconnected');
  }

  /**
   * 发送消息
   */
  send(data: unknown, channel = 'default'): boolean {
    const message = JSON.stringify({ channel, data, timestamp: Date.now() });

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
      return true;
    } else {
      // 加入消息队列
      this.queueMessage(message);
      return false;
    }
  }

  /**
   * 订阅频道消息
   */
  subscribe(channel: string, callback: (data: unknown) => void): () => void {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, new Set());
    }

    this.listeners.get(channel)!.add(callback);

    // 返回取消订阅函数
    return () => {
      this.listeners.get(channel)?.delete(callback);
    };
  }

  /**
   * 订阅状态变化
   */
  onStatusChange(callback: (status: WebSocketStatus) => void): () => void {
    this.statusListeners.add(callback);
    return () => {
      this.statusListeners.delete(callback);
    };
  }

  /**
   * 获取当前状态
   */
  getStatus(): WebSocketStatus {
    return this.status;
  }

  /**
   * 手动重连
   */
  reconnect(): void {
    this.stopHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    this.connect();
  }

  private setStatus(newStatus: WebSocketStatus): void {
    this.status = newStatus;
    this.statusListeners.forEach((listener) => listener(newStatus));
  }

  private handleMessage(rawData: string): void {
    try {
      const message = JSON.parse(rawData);
      const { channel, data, type } = message;

      // 心跳响应
      if (type === 'pong') {
        this.lastPongTime = Date.now();
        return;
      }

      // 广播到对应频道
      this.emit(channel || 'default', data);
      
      // 同时广播到通用监听器
      this.emit('message', message);
    } catch (error) {
      console.error('[WebSocket] Failed to parse message:', error);
    }
  }

  private emit(channel: string, data: unknown): void {
    this.listeners.get(channel)?.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`[WebSocket] Listener error on ${channel}:`, error);
      }
    });
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.lastPongTime = Date.now();

    const heartbeat = () => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
        
        // 检测心跳超时
        setTimeout(() => {
          if (Date.now() - this.lastPongTime > this.config.heartbeatInterval! * 1.5) {
            console.warn('[WebSocket] Heartbeat timeout, reconnecting...');
            this.reconnect();
          }
        }, this.config.heartbeatInterval);
      }
    };

    this.heartbeatTimer = setInterval(heartbeat, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts!) {
      console.error('[WebSocket] Max reconnect attempts reached');
      this.emit('maxReconnectAttemptsReached', {});
      return;
    }

    this.reconnectAttempts++;
    const delay = this.config.reconnectInterval! * Math.pow(2, this.reconnectAttempts - 1); // 指数退避

    console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`);
    this.setStatus('reconnecting');

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private queueMessage(message: string): void {
    if (this.messageQueue.length >= this.config.messageQueueSize!) {
      this.messageQueue.shift(); // 移除最旧的消息
    }

    this.messageQueue.push({
      data: message,
      timestamp: Date.now(),
      retryCount: 0,
    });
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = this.messageQueue[0];
      
      try {
        this.ws.send(message.data);
        this.messageQueue.shift();
      } catch (error) {
        console.error('[WebSocket] Failed to send queued message:', error);
        message.retryCount++;
        
        if (message.retryCount >= 3) {
          this.messageQueue.shift(); // 丢弃失败的消息
        }
        break;
      }
    }
  }

  /**
   * 获取队列中的消息数量
   */
  getQueuedMessageCount(): number {
    return this.messageQueue.length;
  }
}

// 单例实例
let globalWebSocketManager: WebSocketManager | null = null;

/**
 * 获取全局 WebSocket 管理器
 */
export function getWebSocketManager(url?: string): WebSocketManager {
  if (!globalWebSocketManager) {
    const wsUrl = url || process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws';
    globalWebSocketManager = new WebSocketManager({ url: wsUrl });
  }
  return globalWebSocketManager;
}

/**
 * 初始化 WebSocket 连接
 */
export function initWebSocket(url?: string): WebSocketManager {
  const manager = getWebSocketManager(url);
  if (typeof window !== 'undefined') {
    manager.connect();
  }
  return manager;
}
