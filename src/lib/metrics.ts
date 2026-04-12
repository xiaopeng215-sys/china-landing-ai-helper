/**
 * 性能指标收集
 * 
 * 功能:
 * - API 性能指标记录
 * - 数据库查询监控
 * - 缓存命中率统计
 * - 慢查询告警
 * - Sentry Breadcrumb 集成
 */

import * as Sentry from '@sentry/nextjs';

/**
 * API 性能指标
 */
export interface ApiMetrics {
  endpoint: string;
  method: string;
  duration: number;      // 毫秒
  statusCode: number;
  cacheHit?: boolean;
  dbQueries?: number;
  userId?: string;
}

/**
 * 数据库查询指标
 */
export interface DbQueryMetrics {
  table: string;
  operation: 'select' | 'insert' | 'update' | 'delete';
  duration: number;      // 毫秒
  rowCount?: number;
  query?: string;
}

/**
 * 缓存指标
 */
export interface CacheMetrics {
  operation: 'get' | 'set' | 'delete';
  hit: boolean;
  duration: number;
  key?: string;
}

/**
 * 记录 API 性能指标
 */
export function recordApiMetrics(metrics: ApiMetrics): void {
  // 添加到 Sentry Breadcrumb (用于调试)
  Sentry.addBreadcrumb({
    category: 'api_metrics',
    message: `${metrics.method} ${metrics.endpoint}`,
    level: 'info',
    data: {
      duration: metrics.duration,
      status: metrics.statusCode,
      cacheHit: metrics.cacheHit,
      dbQueries: metrics.dbQueries,
    },
  });

  // 记录性能数据到 Sentry (使用 setContext)
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    try {
      Sentry.setContext('api_metrics', {
        endpoint: metrics.endpoint,
        method: metrics.method,
        duration: `${metrics.duration}ms`,
        status: metrics.statusCode,
        cacheHit: metrics.cacheHit,
        dbQueries: metrics.dbQueries,
      });
    } catch (error) {
      console.warn('[Metrics] 记录指标失败:', error);
    }
  }

  // 慢 API 告警
  if (metrics.duration > 1000) {
    Sentry.captureMessage('慢 API 响应', {
      level: 'warning',
      extra: {
        ...metrics,
        threshold: 1000,
      },
      tags: {
        alert_type: 'slow_api',
      },
    });

    console.warn(`⚠️ [Metrics] 慢 API: ${metrics.method} ${metrics.endpoint} - ${metrics.duration}ms`);
  }

  // 错误响应告警
  if (metrics.statusCode >= 500) {
    Sentry.captureMessage('服务器错误响应', {
      level: 'error',
      extra: {
        endpoint: metrics.endpoint,
        method: metrics.method,
        duration: metrics.duration,
        statusCode: metrics.statusCode,
        cacheHit: metrics.cacheHit,
        dbQueries: metrics.dbQueries,
      },
      tags: {
        alert_type: 'server_error',
      },
    });
  }
}

/**
 * 记录数据库查询指标
 */
export function recordDbQuery(metrics: DbQueryMetrics): void {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    try {
      Sentry.setContext('db_query', {
        table: metrics.table,
        operation: metrics.operation,
        duration: `${metrics.duration}ms`,
        rowCount: metrics.rowCount,
      });
    } catch (error) {
      console.warn('[Metrics] 记录 DB 指标失败:', error);
    }
  }

  // 慢查询告警
  if (metrics.duration > 500) {
    Sentry.captureMessage('慢数据库查询', {
      level: 'warning',
      extra: {
        ...metrics,
        threshold: 500,
      },
      tags: {
        alert_type: 'slow_query',
      },
    });

    console.warn(`⚠️ [Metrics] 慢查询：${metrics.operation} ${metrics.table} - ${metrics.duration}ms (${metrics.rowCount} rows)`);
  }
}

/**
 * 记录缓存指标
 */
export function recordCacheMetrics(metrics: CacheMetrics): void {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    try {
      Sentry.setContext('cache_op', {
        operation: metrics.operation,
        hit: metrics.hit,
        duration: `${metrics.duration}ms`,
        key: metrics.key,
      });
    } catch (error) {
      console.warn('[Metrics] 记录缓存指标失败:', error);
    }
  }
}

/**
 * 性能计时器
 * 用于方便地测量代码块执行时间
 */
export class PerformanceTimer {
  private startTime: number;
  private labels: Map<string, number>;

  constructor() {
    this.startTime = Date.now();
    this.labels = new Map();
  }

  /**
   * 开始计时
   */
  start(label?: string): void {
    if (label) {
      this.labels.set(label, Date.now());
    }
  }

  /**
   * 结束计时并返回毫秒数
   */
  end(label?: string): number {
    const endTime = Date.now();
    if (label) {
      const startTime = this.labels.get(label);
      if (startTime !== undefined) {
        return endTime - startTime;
      }
    }
    return endTime - this.startTime;
  }

  /**
   * 记录并重置
   */
  lap(label?: string): number {
    const duration = this.end(label);
    this.start(label);
    return duration;
  }
}

/**
 * 获取性能指标摘要
 */
export async function getMetricsSummary(): Promise<{
  api: {
    avgDuration: number;
    totalRequests: number;
    errorRate: string;
  };
  db: {
    avgQueryTime: number;
    totalQueries: number;
    slowQueries: number;
  };
  cache: {
    hitRate: string;
    totalOperations: number;
  };
} | null> {
  // 注意：这需要 Sentry 的 Metrics API 支持
  // 当前实现返回 null，实际使用时需要配置 Sentry Metrics
  
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return null;
  }

  // TODO: 实现从 Sentry Metrics 获取聚合数据
  // 目前返回示例数据结构
  return {
    api: {
      avgDuration: 0,
      totalRequests: 0,
      errorRate: '0%',
    },
    db: {
      avgQueryTime: 0,
      totalQueries: 0,
      slowQueries: 0,
    },
    cache: {
      hitRate: '0%',
      totalOperations: 0,
    },
  };
}

/**
 * 健康检查指标
 */
export async function getHealthMetrics(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  api: { status: string; avgLatency: number };
  db: { status: string; poolSize: number };
  cache: { status: string; hitRate: string };
}> {
  const poolStats = (await import('./database-pool')).getPoolStats();
  const cacheStats = (await import('./cache')).getCache().getStats();
  
  const totalCacheOps = cacheStats.hits + cacheStats.misses;
  const cacheHitRate = totalCacheOps > 0 
    ? ((cacheStats.hits / totalCacheOps) * 100).toFixed(2) 
    : '0';

  // 健康状态判断
  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
  
  if (poolStats && poolStats.waiting > 10) {
    status = 'degraded';
  }
  
  if (poolStats && poolStats.waiting > 50) {
    status = 'unhealthy';
  }

  return {
    status,
    api: {
      status: 'ok',
      avgLatency: 0, // TODO: 从 Sentry 获取
    },
    db: {
      status: poolStats ? 'ok' : 'unavailable',
      poolSize: poolStats?.total || 0,
    },
    cache: {
      status: cacheStats ? 'ok' : 'unavailable',
      hitRate: `${cacheHitRate}%`,
    },
  };
}

// ============================================================================
// 便捷导出
// ============================================================================

export const metrics = {
  recordApi: recordApiMetrics,
  recordDb: recordDbQuery,
  recordCache: recordCacheMetrics,
  getSummary: getMetricsSummary,
  getHealth: getHealthMetrics,
  Timer: PerformanceTimer,
};

export default metrics;
