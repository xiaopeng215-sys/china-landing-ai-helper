/**
 * 告警通知工具库
 * 支持钉钉、飞书等通知渠道
 */

import { logger } from '../logger';

// ============================================================================
// 类型定义
// ============================================================================

export interface AlertNotification {
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  metadata?: {
    service?: string;
    endpoint?: string;
    errorType?: string;
    userId?: string;
    timestamp?: number;
    [key: string]: any;
  };
}

export interface DingTalkWebhookConfig {
  webhook: string;
  secret?: string; // 加签密钥
}

export interface FeishuWebhookConfig {
  webhook: string;
}

// ============================================================================
// 钉钉通知
// ============================================================================

/**
 * 发送钉钉群消息
 */
export async function sendDingTalkMessage(
  config: DingTalkWebhookConfig,
  notification: AlertNotification
): Promise<boolean> {
  try {
    const payload = buildDingTalkPayload(notification);
    
    const response = await fetch(config.webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    
    if (result.errcode === 0) {
      logger.info('钉钉通知发送成功', { 
        title: notification.title,
        severity: notification.severity 
      }, 'alerts');
      return true;
    } else {
      logger.error('钉钉通知发送失败', new Error(result.errmsg), {
        errcode: result.errcode,
        errmsg: result.errmsg,
      }, 'alerts');
      return false;
    }
  } catch (error) {
    logger.error('钉钉通知发送异常', error instanceof Error ? error : new Error(String(error)), {
      title: notification.title,
    }, 'alerts');
    return false;
  }
}

/**
 * 构建钉钉消息体
 */
function buildDingTalkPayload(notification: AlertNotification): any {
  const { severity, title, message, metadata } = notification;
  
  // 根据严重程度设置颜色
  const colorMap = {
    critical: '#FF0000', // 红色
    warning: '#FFA500',  // 橙色
    info: '#008000',     // 绿色
  };

  const markdown = `## ${getSeverityIcon(severity)} ${title}
  
${message}

${buildMetadataMarkdown(metadata)}

---
*发送时间：${new Date().toLocaleString('zh-CN')}*
*环境：${process.env.NODE_ENV || 'development'}*`;

  return {
    msgtype: 'markdown',
    markdown: {
      title: `${getSeverityIcon(severity)} ${title}`,
      text: markdown,
    },
    at: {
      isAtAll: severity === 'critical', // 严重告警 @所有人
    },
  };
}

/**
 * 钉钉加签计算（可选）
 */
export function signDingTalk(secret: string, timestamp: number): string {
  const crypto = require('crypto');
  const stringToSign = `${timestamp}\n${secret}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(stringToSign)
    .digest()
    .toString('base64');
  return encodeURIComponent(signature);
}

// ============================================================================
// 飞书通知
// ============================================================================

/**
 * 发送飞书群消息
 */
export async function sendFeishuMessage(
  config: FeishuWebhookConfig,
  notification: AlertNotification
): Promise<boolean> {
  try {
    const payload = buildFeishuPayload(notification);
    
    const response = await fetch(config.webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    
    if (result.StatusCode === 0 || result.code === 0 || result.ok) {
      logger.info('飞书通知发送成功', { 
        title: notification.title,
        severity: notification.severity 
      }, 'alerts');
      return true;
    } else {
      logger.error('飞书通知发送失败', new Error(result.msg || result.message || 'Unknown error'), {
        response: result,
      }, 'alerts');
      return false;
    }
  } catch (error) {
    logger.error('飞书通知发送异常', error instanceof Error ? error : new Error(String(error)), {
      title: notification.title,
    }, 'alerts');
    return false;
  }
}

/**
 * 构建飞书消息体（交互式卡片）
 */
function buildFeishuPayload(notification: AlertNotification): any {
  const { severity, title, message, metadata } = notification;
  
  // 飞书卡片消息
  return {
    msg_type: 'interactive',
    card: {
      header: {
        title: {
          tag: 'plain_text',
          content: `${getSeverityIcon(severity)} ${title}`,
        },
        template: getFeishuColor(severity),
      },
      elements: [
        {
          tag: 'markdown',
          content: message,
        },
        ...buildFeishuMetadataElements(metadata),
        {
          tag: 'note',
          elements: [
            {
              tag: 'plain_text',
              content: `发送时间：${new Date().toLocaleString('zh-CN')} | 环境：${process.env.NODE_ENV || 'development'}`,
            },
          ],
        },
      ],
    },
  };
}

/**
 * 获取飞书卡片颜色模板
 */
function getFeishuColor(severity: 'critical' | 'warning' | 'info'): string {
  switch (severity) {
    case 'critical':
      return 'red';
    case 'warning':
      return 'orange';
    case 'info':
      return 'blue';
    default:
      return 'gray';
  }
}

/**
 * 构建飞书卡片的元数据元素
 */
function buildFeishuMetadataElements(metadata?: Record<string, any>): any[] {
  if (!metadata || Object.keys(metadata).length === 0) {
    return [];
  }

  const elements: any[] = [];
  
  // 使用 div + md 展示元数据
  const mdContent = Object.entries(metadata)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `**${key}**: ${value}`)
    .join('\n');

  if (mdContent) {
    elements.push({
      tag: 'div',
      text: {
        tag: 'markdown',
        content: mdContent,
      },
    });
  }

  return elements;
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 获取严重程度图标
 */
function getSeverityIcon(severity: 'critical' | 'warning' | 'info'): string {
  switch (severity) {
    case 'critical':
      return '🔴';
    case 'warning':
      return '🟠';
    case 'info':
      return '🔵';
    default:
      return '⚪';
  }
}

/**
 * 构建元数据 Markdown
 */
function buildMetadataMarkdown(metadata?: Record<string, any>): string {
  if (!metadata || Object.keys(metadata).length === 0) {
    return '';
  }

  const lines = Object.entries(metadata)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `- **${key}**: ${value}`);

  if (lines.length === 0) return '';

  return '\n**详情**:\n' + lines.join('\n');
}

// ============================================================================
// 统一通知接口
// ============================================================================

/**
 * 发送告警通知（自动选择渠道）
 */
export async function sendAlertNotification(
  notification: AlertNotification,
  options?: {
    dingTalk?: DingTalkWebhookConfig;
    feishu?: FeishuWebhookConfig;
  }
): Promise<{
  dingTalk?: boolean;
  feishu?: boolean;
}> {
  const results: { dingTalk?: boolean; feishu?: boolean } = {};

  if (options?.dingTalk) {
    results.dingTalk = await sendDingTalkMessage(options.dingTalk, notification);
  }

  if (options?.feishu) {
    results.feishu = await sendFeishuMessage(options.feishu, notification);
  }

  return results;
}

/**
 * 从环境变量获取通知配置
 */
export function getNotificationConfig(): {
  dingTalk?: DingTalkWebhookConfig;
  feishu?: FeishuWebhookConfig;
} {
  const config: any = {};

  if (process.env.DINGTALK_WEBHOOK) {
    config.dingTalk = {
      webhook: process.env.DINGTALK_WEBHOOK,
      secret: process.env.DINGTALK_SECRET,
    };
  }

  if (process.env.FEISHU_WEBHOOK) {
    config.feishu = {
      webhook: process.env.FEISHU_WEBHOOK,
    };
  }

  return config;
}
