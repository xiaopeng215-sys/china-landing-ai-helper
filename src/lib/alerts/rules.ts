/**
 * 告警规则配置
 * 定义登录、AI 对话等业务的告警规则
 */

import * as Sentry from '@sentry/nextjs';
import { logger } from '../logger';
import { sendAlertNotification, getNotificationConfig } from './notification';

// ============================================================================
// 类型定义
// ============================================================================

export interface AlertRule {
  id: string;
  name: string;
  category: 'auth' | 'ai' | 'performance' | 'availability';
  severity: 'critical' | 'warning' | 'info';
  description: string;
  threshold: number;
  windowMs: number; // 时间窗口（毫秒）
  action: (count: number, windowMs: number) => Promise<void>;
}

export interface LoginFailureEvent {
  userId?: string;
  email?: string;
  provider?: string;
  error?: string;
  timestamp: number;
}

export interface AIConversationEvent {
  sessionId?: string;
  userId?: string;
  error?: string;
  latency?: number;
  timestamp: number;
}

// ============================================================================
// 告警规则定义
// ============================================================================

/**
 * 登录失败告警规则
 */
export const LOGIN_FAILURE_RULE: AlertRule = {
  id: 'auth-login-failure',
  name: '登录失败率过高',
  category: 'auth',
  severity: 'warning',
  description: '10 分钟内登录失败率超过 10%',
  threshold: 10, // 10 次失败
  windowMs: 10 * 60 * 1000, // 10 分钟
  action: async (count, windowMs) => {
    await sendLoginFailureAlert(count, windowMs);
  },
};

/**
 * AI 对话错误告警规则
 */
export const AI_ERROR_RULE: AlertRule = {
  id: 'ai-conversation-error',
  name: 'AI 对话错误率过高',
  category: 'ai',
  severity: 'critical',
  description: '5 分钟内 AI 对话错误超过 5 次',
  threshold: 5,
  windowMs: 5 * 60 * 1000, // 5 分钟
  action: async (count, windowMs) => {
    await sendAIErrorAlert(count, windowMs);
  },
};

/**
 * AI 响应慢告警规则
 */
export const AI_SLOW_RESPONSE_RULE: AlertRule = {
  id: 'ai-slow-response',
  name: 'AI 响应时间过长',
  category: 'ai',
  severity: 'warning',
  description: 'AI 对话 P95 延迟超过 5 秒',
  threshold: 5000, // 5 秒
  windowMs: 5 * 60 * 1000, // 5 分钟
  action: async (latency, windowMs) => {
    await sendAISlowResponseAlert(latency, windowMs);
  },
};

/**
 * 会话创建失败告警规则
 */
export const SESSION_CREATE_FAILURE_RULE: AlertRule = {
  id: 'session-create-failure',
  name: '会话创建失败',
  category: 'ai',
  severity: 'critical',
  description: '5 分钟内会话创建失败超过 3 次',
  threshold: 3,
  windowMs: 5 * 60 * 1000,
  action: async (count, windowMs) => {
    await sendSessionCreateFailureAlert(count, windowMs);
  },
};

// ============================================================================
// 告警计数器
// ============================================================================

class AlertCounter {
  private events: Map<string, { timestamp: number; count: number }[]> = new Map();

  /**
   * 记录事件
   */
  record(ruleId: string, timestamp: number = Date.now()) {
    const now = timestamp;
    const events = this.events.get(ruleId) || [];
    
    events.push({ timestamp: now, count: 1 });
    
    // 清理旧事件（保留最近 2 倍窗口时间）
    const cutoff = now - 2 * 60 * 60 * 1000; // 2 小时
    const filtered = events.filter(e => e.timestamp > cutoff);
    
    this.events.set(ruleId, filtered);
  }

  /**
   * 获取窗口内的事件数
   */
  getCount(ruleId: string, windowMs: number): number {
    const now = Date.now();
    const events = this.events.get(ruleId) || [];
    const cutoff = now - windowMs;
    
    return events
      .filter(e => e.timestamp > cutoff)
      .reduce((sum, e) => sum + e.count, 0);
  }

  /**
   * 检查是否触发告警
   */
  check(rule: AlertRule): boolean {
    const count = this.getCount(rule.id, rule.windowMs);
    return count >= rule.threshold;
  }

  /**
   * 重置计数器
   */
  reset(ruleId: string) {
    this.events.delete(ruleId);
  }
}

// 全局计数器实例
const counter = new AlertCounter();

// ============================================================================
// 告警触发函数
// ============================================================================

/**
 * 记录登录失败
 */
export function recordLoginFailure(event: LoginFailureEvent) {
  counter.record(LOGIN_FAILURE_RULE.id, event.timestamp);
  
  // 记录到 Sentry
  Sentry.addBreadcrumb({
    category: 'auth',
    type: 'error',
    message: '登录失败',
    level: 'warning',
    data: event,
  });

  // 检查是否触发告警
  checkAndAlert(LOGIN_FAILURE_RULE);
}

/**
 * 记录 AI 对话错误
 */
export function recordAIError(event: AIConversationEvent) {
  counter.record(AI_ERROR_RULE.id, event.timestamp);
  
  // 记录到 Sentry
  Sentry.addBreadcrumb({
    category: 'ai',
    type: 'error',
    message: 'AI 对话错误',
    level: 'error',
    data: event,
  });

  // 检查是否触发告警
  checkAndAlert(AI_ERROR_RULE);
}

/**
 * 记录 AI 响应时间
 */
export function recordAILatency(latency: number, event: AIConversationEvent) {
  if (latency > AI_SLOW_RESPONSE_RULE.threshold) {
    counter.record(AI_SLOW_RESPONSE_RULE.id, event.timestamp);
    
    // 记录到 Sentry
    Sentry.addBreadcrumb({
      category: 'ai',
      type: 'performance',
      message: `AI 响应慢：${latency}ms`,
      level: 'warning',
      data: { ...event, latency },
    });

    // 检查是否触发告警
    checkAndAlert(AI_SLOW_RESPONSE_RULE);
  }
}

/**
 * 记录会话创建失败
 */
export function recordSessionCreateFailure(event: AIConversationEvent) {
  counter.record(SESSION_CREATE_FAILURE_RULE.id, event.timestamp);
  
  // 记录到 Sentry
  Sentry.addBreadcrumb({
    category: 'ai',
    type: 'error',
    message: '会话创建失败',
    level: 'error',
    data: event,
  });

  // 检查是否触发告警
  checkAndAlert(SESSION_CREATE_FAILURE_RULE);
}

// ============================================================================
// 告警发送函数
// ============================================================================

/**
 * 检查并发送告警
 */
async function checkAndAlert(rule: AlertRule) {
  const count = counter.getCount(rule.id, rule.windowMs);
  
  if (count >= rule.threshold) {
    logger.warn(`触发告警规则：${rule.name}`, {
      ruleId: rule.id,
      count,
      threshold: rule.threshold,
      windowMs: rule.windowMs,
    }, 'alerts');

    try {
      await rule.action(count, rule.windowMs);
      
      // 重置计数器（避免重复告警）
      counter.reset(rule.id);
    } catch (error) {
      logger.error('发送告警失败', error instanceof Error ? error : new Error(String(error)), {
        ruleId: rule.id,
      }, 'alerts');
    }
  }
}

/**
 * 发送登录失败告警
 */
async function sendLoginFailureAlert(count: number, windowMs: number) {
  const config = getNotificationConfig();
  
  const notification = {
    severity: 'warning' as const,
    title: '🔐 登录失败率过高',
    message: `过去 ${windowMs / 60000} 分钟内检测到 ${count} 次登录失败`,
    metadata: {
      rule: LOGIN_FAILURE_RULE.id,
      threshold: LOGIN_FAILURE_RULE.threshold,
      environment: process.env.NODE_ENV,
    },
  };

  await sendAlertNotification(notification, config);
}

/**
 * 发送 AI 错误告警
 */
async function sendAIErrorAlert(count: number, windowMs: number) {
  const config = getNotificationConfig();
  
  const notification = {
    severity: 'critical' as const,
    title: '🤖 AI 对话错误率过高',
    message: `过去 ${windowMs / 60000} 分钟内检测到 ${count} 次 AI 对话错误`,
    metadata: {
      rule: AI_ERROR_RULE.id,
      threshold: AI_ERROR_RULE.threshold,
      environment: process.env.NODE_ENV,
    },
  };

  await sendAlertNotification(notification, config);
}

/**
 * 发送 AI 响应慢告警
 */
async function sendAISlowResponseAlert(latency: number, windowMs: number) {
  const config = getNotificationConfig();
  
  const notification = {
    severity: 'warning' as const,
    title: '🐌 AI 响应时间过长',
    message: `AI 对话 P95 延迟达到 ${latency}ms（阈值：${AI_SLOW_RESPONSE_RULE.threshold}ms）`,
    metadata: {
      rule: AI_SLOW_RESPONSE_RULE.id,
      threshold: AI_SLOW_RESPONSE_RULE.threshold,
      latency,
      environment: process.env.NODE_ENV,
    },
  };

  await sendAlertNotification(notification, config);
}

/**
 * 发送会话创建失败告警
 */
async function sendSessionCreateFailureAlert(count: number, windowMs: number) {
  const config = getNotificationConfig();
  
  const notification = {
    severity: 'critical' as const,
    title: '❌ 会话创建失败',
    message: `过去 ${windowMs / 60000} 分钟内 ${count} 次会话创建失败`,
    metadata: {
      rule: SESSION_CREATE_FAILURE_RULE.id,
      threshold: SESSION_CREATE_FAILURE_RULE.threshold,
      environment: process.env.NODE_ENV,
    },
  };

  await sendAlertNotification(notification, config);
}

// ============================================================================
// 导出所有规则
// ============================================================================

export const ALERT_RULES: AlertRule[] = [
  LOGIN_FAILURE_RULE,
  AI_ERROR_RULE,
  AI_SLOW_RESPONSE_RULE,
  SESSION_CREATE_FAILURE_RULE,
];

/**
 * 获取规则列表
 */
export function getAlertRules() {
  return ALERT_RULES.map(rule => ({
    id: rule.id,
    name: rule.name,
    category: rule.category,
    severity: rule.severity,
    description: rule.description,
    threshold: rule.threshold,
    windowMinutes: rule.windowMs / 60000,
  }));
}
