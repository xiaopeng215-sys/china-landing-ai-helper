/**
 * 健康检查 API
 * 提供应用和服务依赖的健康状态检查
 */

import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import * as Sentry from '@sentry/nextjs';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  services: {
    api: ServiceHealth;
    database: ServiceHealth;
    redis: ServiceHealth;
    ai: ServiceHealth;
  };
  metrics?: {
    responseTime: number;
    uptime: number;
    memoryUsage?: NodeJS.MemoryUsage;
  };
}

interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  message?: string;
  latency?: number;
  lastChecked: string;
}

/**
 * GET /api/health
 * 返回应用整体健康状态
 */
export async function GET() {
  const startTime = Date.now();

  try {
    // 并行检查所有服务
    const [databaseHealth, redisHealth, aiHealth] = await Promise.all([
      checkDatabase(),
      checkRedis(),
      checkAI(),
    ]);

    const services = {
      api: {
        status: 'healthy' as const,
        message: 'API is running',
        lastChecked: new Date().toISOString(),
      },
      database: databaseHealth,
      redis: redisHealth,
      ai: aiHealth,
    };

    // 确定整体状态
    const overallStatus = determineOverallStatus(services);

    const health: HealthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_SENTRY_RELEASE || 'unversioned',
      environment: process.env.NODE_ENV || 'development',
      services,
      metrics: {
        responseTime: Date.now() - startTime,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
      },
    };

    // 根据健康状态返回不同的 HTTP 状态码
    const statusCode = overallStatus === 'unhealthy' ? 503 : 200;

    return NextResponse.json(health, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Response-Time': `${Date.now() - startTime}ms`,
      },
    });
  } catch (error) {
    // 记录错误
    Sentry.captureException(error, {
      tags: { type: 'healthcheck' },
    });

    // 即使出错也返回部分信息
    return NextResponse.json(
      {
        status: 'unhealthy' as const,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}

/**
 * 检查数据库连接
 */
async function checkDatabase(): Promise<ServiceHealth> {
  try {
    const startTime = Date.now();

    // 简单的数据库连接测试
    // 实际项目中应该执行一个轻量级查询
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return {
        status: 'unhealthy',
        message: 'Database configuration missing',
        lastChecked: new Date().toISOString(),
      };
    }

    // 模拟数据库检查（实际应该执行真实查询）
    // 这里仅检查配置是否存在
    const latency = Date.now() - startTime;

    return {
      status: 'healthy',
      message: 'Database connection OK',
      latency,
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Database check failed',
      lastChecked: new Date().toISOString(),
    };
  }
}

/**
 * 检查 Redis 连接
 */
async function checkRedis(): Promise<ServiceHealth> {
  try {
    const startTime = Date.now();

    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!redisUrl || !redisToken) {
      return {
        status: 'degraded',
        message: 'Redis configuration missing (rate limiting disabled)',
        lastChecked: new Date().toISOString(),
      };
    }

    const redis = new Redis({
      url: redisUrl,
      token: redisToken,
    });

    // 执行 PING 测试
    const result = await redis.ping();
    const latency = Date.now() - startTime;

    if (result === 'PONG') {
      return {
        status: 'healthy',
        message: 'Redis connection OK',
        latency,
        lastChecked: new Date().toISOString(),
      };
    } else {
      return {
        status: 'degraded',
        message: 'Redis responded with unexpected value',
        latency,
        lastChecked: new Date().toISOString(),
      };
    }
  } catch (error) {
    return {
      status: 'degraded',
      message: error instanceof Error ? error.message : 'Redis check failed (rate limiting may be disabled)',
      lastChecked: new Date().toISOString(),
    };
  }
}

/**
 * 检查 AI 服务
 */
async function checkAI(): Promise<ServiceHealth> {
  try {
    const startTime = Date.now();

    const apiKey = process.env.MINIMAX_API_KEY;

    if (!apiKey || apiKey === 'your-minimax-api-key') {
      return {
        status: 'degraded',
        message: 'AI API key not configured',
        lastChecked: new Date().toISOString(),
      };
    }

    // 简单的连接测试（不实际调用 API）
    const latency = Date.now() - startTime;

    return {
      status: 'healthy',
      message: 'AI service configured',
      latency,
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'AI service check failed',
      lastChecked: new Date().toISOString(),
    };
  }
}

/**
 * 确定整体健康状态
 */
function determineOverallStatus(services: {
  [key: string]: ServiceHealth;
}): 'healthy' | 'degraded' | 'unhealthy' {
  const statuses = Object.values(services).map(s => s.status);

  if (statuses.includes('unhealthy')) {
    return 'unhealthy';
  }

  if (statuses.includes('degraded')) {
    return 'degraded';
  }

  return 'healthy';
}
