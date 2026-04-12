/**
 * 告警 Webhook 端点
 * 接收来自 Sentry、Upstash 等外部服务的告警
 * 并转发到钉钉/飞书通知渠道
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import {
  sendAlertNotification,
  getNotificationConfig,
  type AlertNotification,
} from '@/lib/alerts/notification';

// ============================================================================
// 类型定义
// ============================================================================

interface SentryAlert {
  project: string;
  issue: {
    id: string;
    title: string;
    level: string;
    type: string;
  };
  event: {
    id: string;
    message: string;
    tags: Record<string, string>;
  };
  url: string;
}

interface GenericAlert {
  source: 'sentry' | 'upstash' | 'minimax' | 'custom';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// POST /api/alerts/webhook
// ============================================================================

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    
    // 验证告警来源
    const authHeader = request.headers.get('authorization');
    const alertToken = process.env.ALERT_WEBHOOK_TOKEN;
    
    if (alertToken && authHeader !== `Bearer ${alertToken}`) {
      logger.warn('告警 Webhook 认证失败', {
        hasToken: !!authHeader,
        source: body?.source,
      }, 'alerts');
      
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 解析告警
    const notification = parseAlert(body);
    
    if (!notification) {
      return NextResponse.json(
        { error: 'Invalid alert format' },
        { status: 400 }
      );
    }

    // 记录告警
    logger.warn('收到告警', {
      title: notification.title,
      severity: notification.severity,
      source: notification.metadata?.source,
    }, 'alerts');

    // 获取通知配置
    const config = getNotificationConfig();
    
    if (!config.dingTalk && !config.feishu) {
      logger.warn('未配置通知渠道', {
        hasDingTalk: !!config.dingTalk,
        hasFeishu: !!config.feishu,
      }, 'alerts');
      
      return NextResponse.json({
        status: 'received',
        warning: 'No notification channels configured',
        notification,
      });
    }

    // 发送通知
    const results = await sendAlertNotification(notification, config);
    
    const duration = Date.now() - startTime;
    
    logger.info('告警处理完成', {
      title: notification.title,
      severity: notification.severity,
      duration,
      results,
    }, 'alerts');

    return NextResponse.json({
      status: 'sent',
      notification: {
        title: notification.title,
        severity: notification.severity,
      },
      results,
      duration,
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.error('告警处理失败', error instanceof Error ? error : new Error(String(error)), {
      duration,
    }, 'alerts');

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET /api/alerts/webhook - 健康检查
// ============================================================================

export async function GET() {
  const config = getNotificationConfig();
  
  return NextResponse.json({
    status: 'ok',
    channels: {
      dingTalk: !!config.dingTalk,
      feishu: !!config.feishu,
    },
    timestamp: new Date().toISOString(),
  });
}

// ============================================================================
// 辅助函数
// ============================================================================

/**
 * 解析告警消息
 */
function parseAlert(body: any): AlertNotification | null {
  // Sentry 格式
  if (body.project && body.issue) {
    return parseSentryAlert(body as SentryAlert);
  }

  // 通用格式
  if (body.source && body.severity && body.title) {
    return {
      severity: body.severity as 'critical' | 'warning' | 'info',
      title: body.title,
      message: body.message,
      metadata: {
        source: body.source,
        ...body.metadata,
        timestamp: Date.now(),
      },
    };
  }

  // 简单格式（兼容）
  if (body.title && body.message) {
    return {
      severity: body.severity as 'critical' | 'warning' | 'info' || 'warning',
      title: body.title,
      message: body.message,
      metadata: {
        timestamp: Date.now(),
      },
    };
  }

  return null;
}

/**
 * 解析 Sentry 告警
 */
function parseSentryAlert(alert: SentryAlert): AlertNotification {
  const severity = mapSentryLevel(alert.issue.level);
  
  const message = `
**项目**: ${alert.project}
**问题**: ${alert.issue.title}
**类型**: ${alert.issue.type}
**事件 ID**: ${alert.event.id}

${alert.event.message || '查看详情请点击链接'}

[查看 Sentry](${alert.url})
  `.trim();

  return {
    severity,
    title: `[Sentry] ${alert.issue.title}`,
    message,
    metadata: {
      source: 'sentry',
      projectId: alert.project,
      issueId: alert.issue.id,
      issueType: alert.issue.type,
      eventId: alert.event.id,
      url: alert.url,
      tags: alert.event.tags,
      timestamp: Date.now(),
    },
  };
}

/**
 * 映射 Sentry 级别
 */
function mapSentryLevel(level: string): 'critical' | 'warning' | 'info' {
  switch (level.toLowerCase()) {
    case 'fatal':
    case 'error':
      return 'critical';
    case 'warning':
    case 'warn':
      return 'warning';
    default:
      return 'info';
  }
}
