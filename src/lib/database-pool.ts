/**
 * Supabase 连接池管理
 * 
 * 功能:
 * - 连接复用 (减少连接建立开销)
 * - 超时控制 (防止慢查询阻塞)
 * - 健康检查 (自动剔除故障连接)
 * - 等待队列 (高并发时排队)
 * 
 * 注意：Next.js Edge Runtime 不支持 Node.js 定时器
 * 此模块仅适用于 Node.js Runtime
 */

import { 
  createClient, 
  SupabaseClient, 
  SupabaseClientOptions,
  PostgrestBuilder 
} from '@supabase/supabase-js';

/**
 * 连接池配置
 */
interface PoolConfig {
  min: number;          // 最小连接数
  max: number;          // 最大连接数
  idleTimeout: number;  // 空闲超时 (ms)
  acquireTimeout: number; // 获取超时 (ms)
  healthCheckInterval: number; // 健康检查间隔 (ms)
  queryTimeout: number; // 查询超时 (ms)
}

/**
 * 池化客户端
 */
interface PooledClient {
  client: SupabaseClient;
  lastUsed: number;
  inUse: boolean;
  createdAt: number;
  queryCount: number;
}

/**
 * 等待队列项
 */
interface Waiter {
  resolve: (client: SupabaseClient) => void;
  reject: (error: Error) => void;
  timeout: NodeJS.Timeout;
}

/**
 * 默认配置
 */
const DEFAULT_POOL_CONFIG: PoolConfig = {
  min: 2,
  max: 10,
  idleTimeout: 30000,      // 30 秒
  acquireTimeout: 5000,    // 5 秒
  healthCheckInterval: 60000, // 1 分钟
  queryTimeout: 10000,     // 10 秒
};

/**
 * Supabase 连接池类
 */
export class SupabasePool {
  private pool: PooledClient[] = [];
  private config: PoolConfig;
  private healthCheckTimer?: NodeJS.Timeout;
  private waitingQueue: Waiter[] = [];
  private isDestroyed: boolean = false;

  constructor(
    private supabaseUrl: string,
    private supabaseKey: string,
    config?: Partial<PoolConfig>
  ) {
    this.config = { ...DEFAULT_POOL_CONFIG, ...config };
    this.initializePool();
  }

  /**
   * 初始化连接池
   */
  private initializePool(): void {
    console.log(`[DB Pool] 初始化连接池: min=${this.config.min}, max=${this.config.max}`);
    
    // 初始化最小连接数
    for (let i = 0; i < this.config.min; i++) {
      this.createConnection();
    }
    
    // 启动健康检查
    this.startHealthCheck();
  }

  /**
   * 创建新连接
   */
  private createConnection(): PooledClient {
    const client = createClient(this.supabaseUrl, this.supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
      },
      // 自定义 fetch 实现超时控制
      fetch: (url: string, options: RequestInit = {}) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.config.queryTimeout);
        
        return fetch(url, {
          ...options,
          signal: options.signal || controller.signal,
        }).finally(() => clearTimeout(timeout));
      },
    } as SupabaseClientOptions<'public'>);

    const pooled: PooledClient = {
      client,
      lastUsed: Date.now(),
      inUse: false,
      createdAt: Date.now(),
      queryCount: 0,
    };

    console.log(`[DB Pool] 创建新连接，当前池大小：${this.pool.length + 1}`);
    return pooled;
  }

  /**
   * 获取连接
   */
  async acquire(): Promise<SupabaseClient> {
    if (this.isDestroyed) {
      throw new Error('连接池已销毁');
    }

    // 查找空闲连接
    const idleClient = this.pool.find(c => !c.inUse);
    
    if (idleClient) {
      idleClient.inUse = true;
      idleClient.lastUsed = Date.now();
      return idleClient.client;
    }
    
    // 连接池未满，创建新连接
    if (this.pool.length < this.config.max) {
      const newClient = this.createConnection();
      newClient.inUse = true;
      this.pool.push(newClient);
      return newClient.client;
    }
    
    // 连接池已满，等待
    console.log(`[DB Pool] 连接池已满，进入等待队列 (当前等待：${this.waitingQueue.length})`);
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const index = this.waitingQueue.findIndex(w => w.timeout === timeout);
        if (index !== -1) {
          this.waitingQueue.splice(index, 1);
        }
        reject(new Error('获取数据库连接超时'));
      }, this.config.acquireTimeout);
      
      this.waitingQueue.push({ resolve, reject, timeout });
    });
  }

  /**
   * 释放连接
   */
  release(client: SupabaseClient): void {
    const pooled = this.pool.find(c => c.client === client);
    if (!pooled) {
      console.warn('[DB Pool] 释放未知连接');
      return;
    }
    
    pooled.inUse = false;
    pooled.lastUsed = Date.now();
    pooled.queryCount++;
    
    // 唤醒等待的请求
    if (this.waitingQueue.length > 0) {
      const waiter = this.waitingQueue.shift()!;
      clearTimeout(waiter.timeout);
      pooled.inUse = true;
      waiter.resolve(client);
      console.log(`[DB Pool] 唤醒等待请求 (剩余等待：${this.waitingQueue.length})`);
    }
  }

  /**
   * 执行查询 (自动获取和释放连接)
   */
  async query<T>(
    fn: (client: SupabaseClient) => Promise<T>
  ): Promise<T> {
    const client = await this.acquire();
    try {
      return await fn(client);
    } finally {
      this.release(client);
    }
  }

  /**
   * 启动健康检查
   */
  private startHealthCheck(): void {
    this.healthCheckTimer = setInterval(async () => {
      if (this.isDestroyed) return;
      
      const now = Date.now();
      const stats = this.getStats();
      
      console.log(`[DB Pool] 健康检查: ${JSON.stringify(stats)}`);
      
      for (const pooled of this.pool) {
        // 检查空闲超时
        if (!pooled.inUse && now - pooled.lastUsed > this.config.idleTimeout) {
          // 保留最小连接数
          if (this.pool.length > this.config.min) {
            const index = this.pool.indexOf(pooled);
            if (index !== -1) {
              this.pool.splice(index, 1);
              console.log('[DB Pool] 移除空闲连接');
            }
          }
        }
      }
    }, this.config.healthCheckInterval);
    
    console.log(`[DB Pool] 健康检查已启动 (间隔：${this.config.healthCheckInterval}ms)`);
  }

  /**
   * 获取统计信息
   */
  getStats(): {
    total: number;
    inUse: number;
    idle: number;
    waiting: number;
    totalQueries: number;
  } {
    return {
      total: this.pool.length,
      inUse: this.pool.filter(c => c.inUse).length,
      idle: this.pool.filter(c => !c.inUse).length,
      waiting: this.waitingQueue.length,
      totalQueries: this.pool.reduce((sum, c) => sum + c.queryCount, 0),
    };
  }

  /**
   * 销毁连接池
   */
  async destroy(): Promise<void> {
    console.log('[DB Pool] 销毁连接池');
    
    this.isDestroyed = true;
    
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = undefined;
    }
    
    // 拒绝所有等待的请求
    for (const waiter of this.waitingQueue) {
      clearTimeout(waiter.timeout);
      waiter.reject(new Error('连接池已销毁'));
    }
    this.waitingQueue = [];
    
    this.pool = [];
  }
}

// ============================================================================
// 全局单例
// ============================================================================

let _pool: SupabasePool | null = null;

/**
 * 获取数据库连接池
 */
export function getDatabasePool(): SupabasePool | null {
  if (_pool) return _pool;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // 检查配置
  if (!supabaseUrl || !supabaseKey || 
      supabaseUrl.includes('your-project') ||
      supabaseKey.includes('your-anon-key')) {
    console.warn('[DB Pool] Supabase 未配置，返回 null');
    return null;
  }
  
  _pool = new SupabasePool(supabaseUrl, supabaseKey, {
    min: 2,
    max: 10,
    idleTimeout: 30000,
    acquireTimeout: 5000,
    healthCheckInterval: 60000,
  });
  
  return _pool;
}

/**
 * 执行数据库查询 (便捷函数)
 * 自动获取和释放连接
 */
export async function withDb<T>(
  fn: (client: SupabaseClient) => Promise<T>
): Promise<T> {
  const pool = getDatabasePool();
  
  if (!pool) {
    // Fallback: 直接创建客户端 (无池化)
    console.warn('[DB Pool] 连接池不可用，使用直接连接');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase 未配置');
    }
    
    const client = createClient(supabaseUrl, supabaseKey);
    return fn(client);
  }
  
  return pool.query(fn);
}

/**
 * 获取连接池统计
 */
export function getPoolStats(): any {
  const pool = getDatabasePool();
  if (!pool) return null;
  return pool.getStats();
}

// ============================================================================
// 类型导出
// ============================================================================

export type { SupabaseClient, PostgrestBuilder };

// ============================================================================
// 默认导出
// ============================================================================

export default {
  getDatabasePool,
  withDb,
  getPoolStats,
};
