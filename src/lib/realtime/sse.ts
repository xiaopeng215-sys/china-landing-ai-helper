/**
 * Server-Sent Events (SSE) 客户端
 * 适用于单向服务器推送场景
 * 特性：自动重连、连接状态管理、事件流解析
 */

type SSEStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

export interface SSEConfig {
  url: string;
  withCredentials?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  headers?: Record<string, string>;
}

export interface SSEEvent {
  type: string;
  data: unknown;
  id?: string;
  timestamp: number;
}

export class SSEClient {
  private eventSource: EventSource | null = null;
  private config: SSEConfig;
  private status: SSEStatus = 'disconnected';
  private reconnectAttempts = 0;
  private listeners: Map<string, Set<(event: SSEEvent) => void>> = new Map();
  private statusListeners: Set<(status: SSEStatus) => void> = new Set();
  private lastEventTime: number = 0;
  private connectionTimer: NodeJS.Timeout | null = null;

  constructor(config: SSEConfig) {
    this.config = {
      withCredentials: false,
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      ...config,
    };
  }

  /**
   * 连接 SSE 服务器
   */
  connect(): void {
    if (this.eventSource) {
      return;
    }

    this.setStatus('connecting');

    try {
      // EventSource 不支持自定义 headers，需要通过 URL 参数传递 token
      const url = this.buildUrl();
      this.eventSource = new EventSource(url, {
        withCredentials: this.config.withCredentials,
      });

      this.eventSource.onopen = () => {
        console.log('[SSE] Connected');
        this.setStatus('connected');
        this.reconnectAttempts = 0;
        this.lastEventTime = Date.now();
      };

      this.eventSource.onmessage = (event) => {
        this.handleEvent('message', event.data, event.lastEventId);
      };

      this.eventSource.onerror = (error) => {
        console.error('[SSE] Error:', error);
        this.setStatus('disconnected');
        this.eventSource?.close();
        this.eventSource = null;
        this.scheduleReconnect();
      };
    } catch (error) {
      console.error('[SSE] Connection failed:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.connectionTimer) {
      clearTimeout(this.connectionTimer);
      this.connectionTimer = null;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    this.setStatus('disconnected');
  }

  /**
   * 订阅事件
   */
  subscribe(eventType: string, callback: (event: SSEEvent) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }

    // 如果是自定义事件类型，注册到 EventSource
    if (eventType !== 'message' && this.eventSource) {
      this.eventSource.addEventListener(eventType, (event) => {
        this.handleEvent(eventType, event.data, event.lastEventId);
      });
    }

    this.listeners.get(eventType)!.add(callback);

    return () => {
      this.listeners.get(eventType)?.delete(callback);
    };
  }

  /**
   * 订阅状态变化
   */
  onStatusChange(callback: (status: SSEStatus) => void): () => void {
    this.statusListeners.add(callback);
    return () => {
      this.statusListeners.delete(callback);
    };
  }

  /**
   * 获取当前状态
   */
  getStatus(): SSEStatus {
    return this.status;
  }

  /**
   * 手动重连
   */
  reconnect(): void {
    this.disconnect();
    setTimeout(() => this.connect(), 100);
  }

  private buildUrl(): string {
    const url = new URL(this.config.url, window.location.origin);
    
    // 添加时间戳防止缓存
    url.searchParams.set('t', Date.now().toString());
    
    return url.toString();
  }

  private handleEvent(type: string, rawData: string, id?: string): void {
    this.lastEventTime = Date.now();

    try {
      // 尝试解析 JSON
      const data = JSON.parse(rawData);
      const event: SSEEvent = {
        type,
        data,
        id,
        timestamp: Date.now(),
      };

      this.emit(type, event);
    } catch (error) {
      // 非 JSON 数据，直接传递原始字符串
      const event: SSEEvent = {
        type,
        data: rawData,
        id,
        timestamp: Date.now(),
      };

      this.emit(type, event);
    }
  }

  private emit(type: string, event: SSEEvent): void {
    // 特定类型监听器
    this.listeners.get(type)?.forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        console.error(`[SSE] Listener error on ${type}:`, error);
      }
    });

    // 通用消息监听器
    if (type !== 'message') {
      this.listeners.get('message')?.forEach((callback) => {
        try {
          callback(event);
        } catch (error) {
          console.error('[SSE] Generic listener error:', error);
        }
      });
    }
  }

  private setStatus(newStatus: SSEStatus): void {
    this.status = newStatus;
    this.statusListeners.forEach((listener) => listener(newStatus));
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts!) {
      console.error('[SSE] Max reconnect attempts reached');
      this.emit('maxReconnectAttemptsReached', {
        type: 'error',
        data: { message: 'Max reconnect attempts reached' },
        timestamp: Date.now(),
      });
      return;
    }

    this.reconnectAttempts++;
    const delay = this.config.reconnectInterval! * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`[SSE] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`);
    this.setStatus('reconnecting');

    this.connectionTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * 获取最后接收消息的时间
   */
  getLastEventTime(): number {
    return this.lastEventTime;
  }

  /**
   * 检查连接是否健康 (超过指定时间未收到消息视为不健康)
   */
  isHealthy(timeout = 60000): boolean {
    return Date.now() - this.lastEventTime < timeout;
  }
}

// 单例实例
let globalSSEClient: SSEClient | null = null;

/**
 * 获取全局 SSE 客户端
 */
export function getSSEClient(url?: string): SSEClient {
  if (!globalSSEClient) {
    const sseUrl = url || process.env.NEXT_PUBLIC_SSE_URL || '/api/stream';
    globalSSEClient = new SSEClient({ url: sseUrl });
  }
  return globalSSEClient;
}

/**
 * 初始化 SSE 连接
 */
export function initSSE(url?: string): SSEClient {
  const client = getSSEClient(url);
  if (typeof window !== 'undefined') {
    client.connect();
  }
  return client;
}
