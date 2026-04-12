/**
 * API 中间件 - 速率限制
 * 
 * 功能:
 * - 基于 Upstash Redis 的滑动窗口限流
 * - 支持用户级和 IP 级限流
 * - 自动降级 (Redis 不可用时跳过)
 */

import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * 限流配置
 */
interface RateLimitConfig {
  anonymousLimit: number;   // 匿名用户限制 (次/小时)
  authenticatedLimit: number; // 认证用户限制 (次/小时)
  windowSize: `${number} ${'ms' | 's' | 'm' | 'h' | 'd'}`;       // 时间窗口
}

const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  anonymousLimit: 100,      // 100 次/小时
  authenticatedLimit: 1000, // 1000 次/小时
  windowSize: '60 s' as const,
};

/**
 * 全局限流器实例
 */
let ratelimit: Ratelimit | null = null;
let redis: Redis | null = null;

/**
 * 初始化 Redis 和限流器
 */
function initializeRatelimit(): Ratelimit | null {
  if (ratelimit) return ratelimit;
  
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (!redisUrl || !redisToken ||
      redisUrl.includes('your-redis') ||
      redisToken.includes('your-token')) {
    console.warn('[RateLimit] Redis 未配置，跳过限流');
    return null;
  }
  
  try {
    redis = new Redis({
      url: redisUrl,
      token: redisToken,
      automaticDeserialization: true,
      signal: AbortSignal.timeout(5000),
    });
    
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(
        DEFAULT_RATE_LIMIT_CONFIG.anonymousLimit,
        DEFAULT_RATE_LIMIT_CONFIG.windowSize
      ),
      analytics: true,
      prefix: '@upstash/ratelimit:v1',
    });
    
    console.log('[RateLimit] 初始化成功');
    return ratelimit;
  } catch (error) {
    console.warn('[RateLimit] 初始化失败:', error);
    return null;
  }
}

/**
 * 获取限流器实例
 */
export function getRatelimit(): Ratelimit | null {
  return ratelimit || initializeRatelimit();
}

/**
 * 执行限流检查
 */
export async function withRateLimit(
  request: NextRequest,
  options?: {
    identifier?: string;      // 自定义标识符
    limit?: number;           // 自定义限制
    windowSize?: string;      // 自定义窗口
  }
): Promise<{
  success: boolean;
  remaining: number;
  reset: number;
  limit: number;
}> {
  const rl = getRatelimit();
  
  // Redis 未配置时跳过限流
  if (!rl) {
    return {
      success: true,
      remaining: Infinity,
      reset: 0,
      limit: 0,
    };
  }
  
  // 确定标识符
  let identifier = options?.identifier;
  
  if (!identifier) {
    // 优先使用用户 ID
    const userId = request.headers.get('x-user-id');
    if (userId) {
      identifier = `user:${userId}`;
    } else {
      // 降级到 IP
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
      identifier = `ip:${ip}`;
    }
  }
  
  // 执行限流
  const result = await rl.limit(identifier);
  
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
    limit: result.limit,
  };
}

/**
 * 限流中间件包装器
 */
export function rateLimitMiddleware(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options?: {
    limit?: number;
    windowSize?: string;
    skipPaths?: string[];
  }
) {
  return async function (request: NextRequest): Promise<NextResponse> {
    // 跳过特定路径
    if (options?.skipPaths?.some(path => request.nextUrl.pathname.startsWith(path))) {
      return handler(request);
    }
    
    // 执行限流
    const result = await withRateLimit(request, {
      limit: options?.limit,
      windowSize: options?.windowSize,
    });
    
    if (!result.success) {
      return NextResponse.json(
        {
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: '请求过于频繁，请稍后再试',
            retryAfter: Math.ceil(result.reset / 1000),
          },
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.reset.toString(),
            'Retry-After': Math.ceil(result.reset / 1000).toString(),
          },
        }
      );
    }
    
    // 添加限流头到响应
    const response = await handler(request);
    response.headers.set('X-RateLimit-Limit', result.limit.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', result.reset.toString());
    
    return response;
  };
}

/**
 * 获取限流统计
 */
export async function getRateLimitStats(
  identifier: string
): Promise<{
  remaining: number;
  limit: number;
  reset: number;
} | null> {
  const rl = getRatelimit();
  if (!rl) return null;
  
  const result = await rl.limit(identifier);
  return {
    remaining: result.remaining,
    limit: result.limit,
    reset: result.reset,
  };
}

// ============================================================================
// 便捷导出
// ============================================================================

export const rateLimit = {
  check: withRateLimit,
  middleware: rateLimitMiddleware,
  getStats: getRateLimitStats,
};

export default rateLimit;
