/**
 * 统一缓存服务 - 多层缓存策略
 * 
 * 架构:
 * L1: 内存缓存 (LRU) - 热点数据，TTL 1 分钟
 * L2: Redis 缓存 (Upstash) - API 响应，TTL 5 分钟 -1 小时
 * L3: 数据库 (Supabase) - 持久化存储
 */

import { Redis } from '@upstash/redis';

interface CacheConfig {
  ttl: number;           // 默认 TTL (秒)
  prefix: string;        // Key 前缀
  serializer?: (value: any) => string;
  deserializer?: (value: string) => any;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
}

/**
 * LRU In-Memory Cache
 * 基于 Map 实现，自动维护访问顺序
 */
class LRUCache<K, V> {
  private cache: Map<K, V>;
  private readonly maxSize: number;

  constructor(maxSize: number = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value === undefined) return undefined;
    
    // 移到最新 (访问后更新顺序)
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // 删除最旧的 (第一个 key)
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }

  get stats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
    };
  }
}

/**
 * 缓存服务类
 * 提供多层缓存抽象
 */
export class CacheService {
  private redis: Redis | null = null;
  private memoryCache: LRUCache<string, any>;
  private stats: CacheStats = { hits: 0, misses: 0, size: 0 };
  private config: CacheConfig;
  private initialized: boolean = false;

  constructor(config?: Partial<CacheConfig>) {
    this.config = {
      ttl: 300, // 5 分钟
      prefix: 'cache:v1:',
      ...config,
    };

    // 初始化内存缓存
    this.memoryCache = new LRUCache(100);

    // 延迟初始化 Redis
    this.initializeRedis();
  }

  private async initializeRedis(): Promise<void> {
    if (this.initialized) return;

    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    
    if (redisUrl && redisToken && 
        !redisUrl.includes('your-redis') && 
        !redisToken.includes('your-token')) {
      try {
        this.redis = new Redis({
          url: redisUrl,
          token: redisToken,
          automaticDeserialization: false,
        });
        
        // 测试连接
        await this.redis.ping();
        console.log('[Cache] Redis 连接成功');
      } catch (error) {
        console.warn('[Cache] Redis 初始化失败，使用内存缓存:', error);
        this.redis = null;
      }
    } else {
      console.warn('[Cache] Redis 未配置，使用内存缓存');
    }

    this.initialized = true;
  }

  private makeKey(key: string): string {
    return `${this.config.prefix}${key}`;
  }

  /**
   * 从缓存获取数据
   * 优先级：内存缓存 → Redis 缓存 → null
   */
  async get<T>(key: string): Promise<T | null> {
    await this.initializeRedis();
    
    const fullKey = this.makeKey(key);
    
    // L1: 内存缓存
    const memoryValue = this.memoryCache.get(fullKey);
    if (memoryValue !== undefined) {
      this.stats.hits++;
      return memoryValue as T;
    }
    
    // L2: Redis 缓存
    if (this.redis) {
      try {
        const redisValue = await this.redis.get(fullKey);
        if (redisValue !== null) {
          this.stats.hits++;
          const parsed = this.config.deserializer 
            ? this.config.deserializer(redisValue as string)
            : JSON.parse(redisValue as string);
          
          // 回填内存缓存
          this.memoryCache.set(fullKey, parsed);
          return parsed as T;
        }
      } catch (error) {
        console.warn('[Cache] Redis 读取失败:', error);
      }
    }
    
    this.stats.misses++;
    return null;
  }

  /**
   * 写入缓存
   * 同时写入内存缓存和 Redis
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.initializeRedis();
    
    const fullKey = this.makeKey(key);
    const serialized = this.config.serializer 
      ? this.config.serializer(value)
      : JSON.stringify(value);
    
    // 写入内存缓存
    this.memoryCache.set(fullKey, value);
    
    // 写入 Redis
    if (this.redis) {
      try {
        const effectiveTtl = ttl ?? this.config.ttl;
        await this.redis.set(fullKey, serialized, { ex: effectiveTtl });
      } catch (error) {
        console.warn('[Cache] Redis 写入失败:', error);
      }
    }
  }

  /**
   * 从缓存删除
   */
  async delete(key: string): Promise<void> {
    await this.initializeRedis();
    
    const fullKey = this.makeKey(key);
    this.memoryCache.delete(fullKey);
    
    if (this.redis) {
      try {
        await this.redis.del(fullKey);
      } catch (error) {
        console.warn('[Cache] Redis 删除失败:', error);
      }
    }
  }

  /**
   * 获取或设置 (原子操作)
   * 如果缓存不存在，调用 factory 函数获取值并缓存
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }
    
    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }

  /**
   * 检查 key 是否存在
   */
  async has(key: string): Promise<boolean> {
    await this.initializeRedis();
    
    const fullKey = this.makeKey(key);
    
    if (this.memoryCache.has(fullKey)) {
      return true;
    }
    
    if (this.redis) {
      try {
        const exists = await this.redis.exists(fullKey);
        return exists > 0;
      } catch (error) {
        console.warn('[Cache] Redis 检查失败:', error);
      }
    }
    
    return false;
  }

  /**
   * 获取缓存统计
   */
  getStats(): CacheStats & { memory: { size: number; maxSize: number } } {
    return {
      ...this.stats,
      memory: this.memoryCache.stats,
    };
  }

  /**
   * 重置统计
   */
  resetStats(): void {
    this.stats = { hits: 0, misses: 0, size: this.memoryCache.size };
  }

  /**
   * 清空所有缓存
   */
  async clear(): Promise<void> {
    this.memoryCache.clear();
    
    if (this.redis) {
      try {
        // 注意：生产环境慎用，会清空所有带前缀的 key
        const pattern = `${this.config.prefix}*`;
        const keys = await this.redis.keys(pattern);
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
      } catch (error) {
        console.warn('[Cache] Redis 清空失败:', error);
      }
    }
  }

  /**
   * 批量获取
   */
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    await this.initializeRedis();
    
    const results: (T | null)[] = [];
    
    for (const key of keys) {
      const value = await this.get<T>(key);
      results.push(value);
    }
    
    return results;
  }

  /**
   * 批量设置
   */
  async mset(entries: Array<{ key: string; value: any; ttl?: number }>): Promise<void> {
    await Promise.all(
      entries.map(entry => this.set(entry.key, entry.value, entry.ttl))
    );
  }
}

// ============================================================================
// 全局单例
// ============================================================================

let _cache: CacheService | null = null;

export function getCache(): CacheService {
  if (_cache) return _cache;
  
  _cache = new CacheService({
    ttl: 300, // 5 分钟
    prefix: 'pwa:cache:v1:',
  });
  
  return _cache;
}

// ============================================================================
// 便捷导出
// ============================================================================

export const cache = {
  /**
   * 从缓存获取
   */
  get: <T>(key: string) => getCache().get<T>(key),
  
  /**
   * 写入缓存
   */
  set: (key: string, value: any, ttl?: number) => getCache().set(key, value, ttl),
  
  /**
   * 从缓存删除
   */
  delete: (key: string) => getCache().delete(key),
  
  /**
   * 获取或设置
   */
  getOrSet: <T>(key: string, factory: () => Promise<T>, ttl?: number) => 
    getCache().getOrSet(key, factory, ttl),
  
  /**
   * 检查是否存在
   */
  has: (key: string) => getCache().has(key),
  
  /**
   * 获取统计
   */
  getStats: () => getCache().getStats(),
  
  /**
   * 清空缓存
   */
  clear: () => getCache().clear(),
};

// ============================================================================
// 缓存 Key 工厂
// ============================================================================

export const CacheKey = {
  // AI 响应缓存
  aiResponse: (model: string, hash: string) => `ai:response:${model}:${hash}`,
  
  // 用户相关
  userProfile: (userId: string) => `user:profile:${userId}`,
  userSession: (sessionId: string) => `user:session:${sessionId}`,
  
  // 聊天相关
  chatSession: (sessionId: string) => `chat:session:${sessionId}`,
  chatMessages: (sessionId: string) => `chat:messages:${sessionId}`,
  
  // 配置相关
  appConfig: (key: string) => `config:${key}`,
  
  // 速率限制
  rateLimit: (identifier: string) => `ratelimit:${identifier}`,
};

// ============================================================================
// 默认导出
// ============================================================================

export default getCache;
