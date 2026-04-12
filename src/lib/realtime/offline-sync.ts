/**
 * 离线数据同步管理
 * 特性：IndexedDB 存储、操作队列、自动同步、冲突解决
 */

export interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: string;
  data: unknown;
  timestamp: number;
  retryCount: number;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
}

export interface SyncConfig {
  dbName: string;
  version: number;
  syncInterval: number;
  maxRetries: number;
}

export type ConflictResolutionStrategy = 'server' | 'client' | 'manual' | 'last-write-wins';

export interface SyncStatus {
  isOnline: boolean;
  pendingCount: number;
  syncing: boolean;
  lastSyncTime: number | null;
}

export class OfflineSyncManager {
  private db: IDBDatabase | null = null;
  private config: SyncConfig;
  private operationQueue: SyncOperation[] = [];
  private isOnline = true;
  private syncInProgress = false;
  private syncTimer: NodeJS.Timeout | null = null;
  private lastSyncTime: number | null = null;
  private listeners: Set<(status: SyncStatus) => void> = new Set();

  constructor(config: Partial<SyncConfig> = {}) {
    this.config = {
      dbName: 'offline-sync-db',
      version: 1,
      syncInterval: 5000, // 5 秒
      maxRetries: 3,
      ...config,
    };

    this.init();
    this.setupNetworkListeners();
  }

  /**
   * 初始化数据库
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.config.dbName, this.config.version);

      request.onerror = () => {
        console.error('[OfflineSync] Failed to open database');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('[OfflineSync] Database initialized');
        this.loadPendingOperations();
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 操作队列表
        if (!db.objectStoreNames.contains('operations')) {
          const operationsStore = db.createObjectStore('operations', { keyPath: 'id' });
          operationsStore.createIndex('status', 'status', { unique: false });
          operationsStore.createIndex('timestamp', 'timestamp', { unique: false });
          operationsStore.createIndex('entity', 'entity', { unique: false });
        }

        // 数据缓存表
        if (!db.objectStoreNames.contains('cache')) {
          const cacheStore = db.createObjectStore('cache', { keyPath: 'key' });
          cacheStore.createIndex('timestamp', 'timestamp', { unique: false });
          cacheStore.createIndex('entity', 'entity', { unique: false });
        }
      };
    });
  }

  /**
   * 添加操作到队列
   */
  async enqueueOperation(
    type: 'create' | 'update' | 'delete',
    entity: string,
    data: unknown
  ): Promise<string> {
    const operation: SyncOperation = {
      id: `${entity}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      entity,
      data,
      timestamp: Date.now(),
      retryCount: 0,
      status: 'pending',
    };

    this.operationQueue.push(operation);
    await this.saveOperation(operation);

    console.log(`[OfflineSync] Enqueued ${type} operation for ${entity}`);
    
    // 如果在线，立即尝试同步
    if (this.isOnline) {
      this.triggerSync();
    }

    return operation.id;
  }

  /**
   * 从缓存获取数据
   */
  async getFromCache<T>(key: string): Promise<T | null> {
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      const request = store.get(key);

      request.onsuccess = () => {
        const entry = request.result;
        if (!entry) {
          resolve(null);
          return;
        }

        // 检查是否过期 (可选)
        resolve(entry.data as T);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 缓存数据
   */
  async cacheData<T>(key: string, data: T, entity?: string): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const request = store.put({
        key,
        data,
        entity: entity || key.split('/')[0],
        timestamp: Date.now(),
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 清除缓存
   */
  async clearCache(entity?: string): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');

      let request: IDBRequest;
      if (entity) {
        const index = store.index('entity');
        request = index.openCursor(IDBKeyRange.only(entity));
        request.onsuccess = () => {
          const cursor = (request as IDBRequest<IDBCursorWithValue>).result;
          if (cursor) {
            store.delete(cursor.primaryKey);
            cursor.continue();
          }
        };
      } else {
        request = store.clear();
      }

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 设置同步处理器
   */
  setSyncHandler(
    entity: string,
    handler: (operation: SyncOperation) => Promise<void>
  ): void {
    // 存储在内存中，同步时使用
    (this as unknown as Record<string, unknown>)[`handler_${entity}`] = handler;
  }

  /**
   * 手动触发同步
   */
  async triggerSync(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) return;

    this.syncInProgress = true;
    this.emitStatus({ syncing: true, pendingCount: this.operationQueue.length });

    try {
      const pendingOperations = this.operationQueue.filter(op => op.status === 'pending');
      
      for (const operation of pendingOperations) {
        if (!this.isOnline) break;

        operation.status = 'syncing';
        await this.updateOperation(operation);

        try {
          await this.executeOperation(operation);
          operation.status = 'completed';
        } catch (error) {
          console.error(`[OfflineSync] Failed to sync operation ${operation.id}:`, error);
          
          operation.retryCount++;
          if (operation.retryCount >= this.config.maxRetries) {
            operation.status = 'failed';
          } else {
            operation.status = 'pending';
          }
        }

        await this.updateOperation(operation);
      }

      // 清理已完成的操作
      this.operationQueue = this.operationQueue.filter(op => op.status === 'pending');
      
      this.lastSyncTime = Date.now();
      this.emitStatus({ syncing: false, pendingCount: this.operationQueue.length });
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * 执行单个操作
   */
  private async executeOperation(operation: SyncOperation): Promise<void> {
    const handler = (this as unknown as Record<string, unknown>)[`handler_${operation.entity}`];
    
    if (!handler || typeof handler !== 'function') {
      throw new Error(`No handler for entity: ${operation.entity}`);
    }

    await handler(operation);
  }

  /**
   * 保存操作到数据库
   */
  private async saveOperation(operation: SyncOperation): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['operations'], 'readwrite');
      const store = transaction.objectStore('operations');
      const request = store.put(operation);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 更新操作状态
   */
  private async updateOperation(operation: SyncOperation): Promise<void> {
    await this.saveOperation(operation);
    
    // 更新内存队列
    const index = this.operationQueue.findIndex(op => op.id === operation.id);
    if (index !== -1) {
      this.operationQueue[index] = operation;
    }
  }

  /**
   * 加载待处理的操作
   */
  private async loadPendingOperations(): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['operations'], 'readonly');
      const store = transaction.objectStore('operations');
      const index = store.index('status');
      const request = index.openCursor(IDBKeyRange.only('pending'));

      const operations: SyncOperation[] = [];

      request.onsuccess = () => {
        const cursor = (request as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          operations.push(cursor.value);
          cursor.continue();
        } else {
          this.operationQueue = operations;
          console.log(`[OfflineSync] Loaded ${operations.length} pending operations`);
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 设置网络状态监听
   */
  private setupNetworkListeners(): void {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      console.log('[OfflineSync] Network online');
      this.isOnline = true;
      this.triggerSync();
    };

    const handleOffline = () => {
      console.log('[OfflineSync] Network offline');
      this.isOnline = false;
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 初始状态
    this.isOnline = navigator.onLine;
  }

  /**
   * 启动定时同步
   */
  startPeriodicSync(): void {
    this.stopPeriodicSync();
    
    this.syncTimer = setInterval(() => {
      if (this.isOnline && this.operationQueue.length > 0) {
        this.triggerSync();
      }
    }, this.config.syncInterval);

    console.log(`[OfflineSync] Periodic sync started (interval: ${this.config.syncInterval}ms)`);
  }

  /**
   * 停止定时同步
   */
  stopPeriodicSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  /**
   * 获取同步状态
   */
  getStatus(): {
    isOnline: boolean;
    pendingCount: number;
    syncing: boolean;
  } {
    return {
      isOnline: this.isOnline,
      pendingCount: this.operationQueue.length,
      syncing: this.syncInProgress,
    };
  }

  /**
   * 订阅状态变化
   */
  onStatusChange(callback: (status: { isOnline: boolean; pendingCount: number; syncing: boolean }) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private emitStatus(status: { syncing: boolean; pendingCount: number }): void {
    const fullStatus: SyncStatus = {
      isOnline: this.isOnline,
      lastSyncTime: this.lastSyncTime,
      ...status,
    };

    this.listeners.forEach((listener) => {
      try {
        listener(fullStatus);
      } catch (error) {
        console.error('[OfflineSync] Listener error:', error);
      }
    });
  }

  /**
   * 解决冲突
   */
  resolveConflict<T>(
    local: T,
    server: T,
    strategy: ConflictResolutionStrategy,
    localTimestamp: number,
    serverTimestamp: number
  ): T {
    switch (strategy) {
      case 'server':
        return server;
      case 'client':
        return local;
      case 'last-write-wins':
        return serverTimestamp > localTimestamp ? server : local;
      case 'manual':
        // 需要用户手动解决，抛出异常
        throw new Error('Manual conflict resolution required');
      default:
        return server;
    }
  }
}

// 单例实例
let globalOfflineSyncManager: OfflineSyncManager | null = null;

/**
 * 获取全局离线同步管理器
 */
export function getOfflineSyncManager(): OfflineSyncManager {
  if (!globalOfflineSyncManager) {
    globalOfflineSyncManager = new OfflineSyncManager();
  }
  return globalOfflineSyncManager;
}

/**
 * 初始化离线同步
 */
export async function initOfflineSync(): Promise<OfflineSyncManager> {
  const manager = getOfflineSyncManager();
  await manager.init();
  manager.startPeriodicSync();
  return manager;
}
