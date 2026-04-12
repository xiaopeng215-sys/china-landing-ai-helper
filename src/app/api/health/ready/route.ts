/**
 * Readiness Probe - Kubernetes 就绪探针
 * 检查应用及所有依赖服务是否就绪
 */

import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

interface ReadinessStatus {
  status: 'ready' | 'not_ready';
  timestamp: string;
  checks: {
    api: boolean;
    database: boolean;
    redis: boolean;
    ai: boolean;
  };
}

/**
 * GET /api/health/ready
 * Kubernetes readiness probe endpoint
 */
export async function GET() {
  const checks: ReadinessStatus['checks'] = {
    api: true,
    database: false,
    redis: false,
    ai: false,
  };

  // 检查数据库配置
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  checks.database = !!(supabaseUrl && supabaseKey);

  // 检查 Redis 连接
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (redisUrl && redisToken) {
    try {
      const redis = new Redis({ url: redisUrl, token: redisToken });
      const result = await redis.ping();
      checks.redis = result === 'PONG';
    } catch {
      checks.redis = false;
    }
  } else {
    // Redis 可选（仅用于速率限制）
    checks.redis = true;
  }

  // 检查 AI 服务配置
  const apiKey = process.env.MINIMAX_API_KEY;
  checks.ai = !!(apiKey && apiKey !== 'your-minimax-api-key');

  // 所有检查通过才算就绪
  const allReady = Object.values(checks).every(check => check);

  const status: ReadinessStatus = {
    status: allReady ? 'ready' : 'not_ready',
    timestamp: new Date().toISOString(),
    checks,
  };

  return NextResponse.json(status, {
    status: allReady ? 200 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
