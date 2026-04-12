/**
 * 指标收集 API
 * 接收客户端发送的性能指标和用户行为数据
 */

import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { logger, logApiStart, logApiEnd } from '@/lib/logger';

interface WebVitalMetric {
  type: 'web_vital';
  name: string;
  value: number;
  rating?: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

interface UserActionMetric {
  type: 'user_action';
  action: string;
  element?: string;
  page?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface ErrorMetric {
  type: 'error';
  message: string;
  stack?: string;
  page?: string;
  timestamp: number;
}

type Metric = WebVitalMetric | UserActionMetric | ErrorMetric;

interface MetricsPayload {
  metrics: Metric[];
  userAgent?: string;
  url?: string;
}

/**
 * POST /api/metrics
 * 接收客户端指标
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  logApiStart({
    method: 'POST',
    path: '/api/metrics',
  });

  try {
    // 解析请求体
    let body: MetricsPayload;
    try {
      body = await request.json();
    } catch (error) {
      logApiEnd({
        method: 'POST',
        path: '/api/metrics',
        status: 400,
        duration: Date.now() - startTime,
        error: 'Invalid JSON',
      });

      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }

    const { metrics, userAgent, url } = body;

    if (!metrics || !Array.isArray(metrics)) {
      logApiEnd({
        method: 'POST',
        path: '/api/metrics',
        status: 400,
        duration: Date.now() - startTime,
        error: 'Metrics array required',
      });

      return NextResponse.json(
        { error: 'Metrics array required' },
        { status: 400 }
      );
    }

    // 处理每个指标
    const processedMetrics: Array<{ type: string; status: 'processed' | 'error'; error?: string }> = [];

    for (const metric of metrics) {
      try {
        await processMetric(metric, { userAgent, url });
        processedMetrics.push({ type: metric.type, status: 'processed' });
      } catch (error) {
        logger.error('Failed to process metric', error as Error, { metric });
        processedMetrics.push({ 
          type: metric.type, 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    const successCount = processedMetrics.filter(m => m.status === 'processed').length;
    const errorCount = processedMetrics.filter(m => m.status === 'error').length;

    logApiEnd({
      method: 'POST',
      path: '/api/metrics',
      status: 200,
      duration: Date.now() - startTime,
    });

    return NextResponse.json({
      success: true,
      processed: successCount,
      errors: errorCount,
      details: processedMetrics,
    });
  } catch (error) {
    logger.error('Metrics API error', error as Error);
    
    logApiEnd({
      method: 'POST',
      path: '/api/metrics',
      status: 500,
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      { error: 'Failed to process metrics' },
      { status: 500 }
    );
  }
}

/**
 * 处理单个指标
 */
async function processMetric(metric: Metric, context: { userAgent?: string; url?: string }) {
  await Sentry.startSpan(
    {
      name: `process_metric.${metric.type}`,
      op: 'function',
    },
    async () => {
      switch (metric.type) {
        case 'web_vital':
          await processWebVital(metric, context);
          break;
        case 'user_action':
          await processUserAction(metric, context);
          break;
        case 'error':
          await processError(metric, context);
          break;
        default:
          logger.warn('Unknown metric type', { type: (metric as any).type });
      }
    }
  );
}

/**
 * 处理 Web Vitals 指标
 */
async function processWebVital(metric: WebVitalMetric, context: { userAgent?: string; url?: string }) {
  // 记录到 Sentry Metrics
  Sentry.metrics.distribution(`web_vitals.${metric.name}`, metric.value, {
    unit: metric.name === 'cumulative-layout-shift' ? 'none' : 'millisecond',
  });

  // 添加面包屑
  Sentry.addBreadcrumb({
    category: 'performance',
    type: 'default',
    message: `Web Vitals: ${metric.name} = ${metric.value} (${metric.rating || 'unknown'})`,
    data: {
      ...metric,
      ...context,
    },
    level: 'info',
  });

  // 记录日志（仅开发环境或性能差的指标）
  if (process.env.NODE_ENV === 'development' || metric.rating === 'poor') {
    logger.info(`Web Vitals: ${metric.name}`, {
      value: metric.value,
      rating: metric.rating,
      url: context.url,
    });
  }

  // 如果性能很差，记录为问题
  if (metric.rating === 'poor') {
    Sentry.captureMessage(`Poor Web Vitals: ${metric.name}`, {
      level: 'warning',
      tags: {
        metric: metric.name,
        rating: 'poor',
      },
      extra: {
        ...metric,
        ...context,
      },
    });
  }
}

/**
 * 处理用户行为指标
 */
async function processUserAction(metric: UserActionMetric, context: { userAgent?: string; url?: string }) {
  // 记录到 Sentry Breadcrumbs
  Sentry.addBreadcrumb({
    category: 'user_action',
    type: 'default',
    message: `User action: ${metric.action}`,
    data: { ...metric, ...context },
    level: 'info',
  });

  // 记录特定动作
  if (metric.action === 'click' && metric.element) {
    Sentry.addBreadcrumb({
      category: 'ui',
      type: 'click',
      message: `Clicked: ${metric.element}`,
      data: metric,
    });
  }
}

/**
 * 处理错误指标
 */
async function processError(metric: ErrorMetric, context: { userAgent?: string; url?: string }) {
  // 创建错误对象
  const error = new Error(metric.message);
  if (metric.stack) {
    error.stack = metric.stack;
  }

  // 发送到 Sentry
  Sentry.captureException(error, {
    tags: {
      source: 'client_error',
      page: metric.page || 'unknown',
    },
    extra: {
      ...metric,
      ...context,
    },
  });

  // 记录日志
  logger.error('Client error', error, {
    page: metric.page,
    url: context.url,
  });
}

/**
 * GET /api/metrics
 * 返回指标收集状态
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/metrics',
    acceptedTypes: ['web_vital', 'user_action', 'error'],
    timestamp: new Date().toISOString(),
  });
}
