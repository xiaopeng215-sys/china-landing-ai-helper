/**
 * 统一日志系统
 * 提供结构化的日志记录，支持不同级别和输出目标
 */

import * as Sentry from '@sentry/nextjs';

// ============================================================================
// 类型定义
// ============================================================================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  [key: string]: any;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  source?: string;
}

// ============================================================================
// 配置
// ============================================================================

const LOG_CONFIG = {
  // 开发环境显示所有日志，生产环境只显示 warn 和 error
  minLevel: (process.env.NODE_ENV === 'production' ? 'warn' : 'debug') as LogLevel,
  // 是否发送到 Sentry（仅 error 级别）
  sentryEnabled: process.env.NODE_ENV === 'production',
  // 是否输出到控制台
  consoleEnabled: true,
  // 是否包含时间戳
  includeTimestamp: true,
  // 是否包含堆栈跟踪（仅 error）
  includeStackTrace: true,
};

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// ============================================================================
// 日志类
// ============================================================================

class Logger {
  private context: LogContext = {};

  /**
   * 设置全局上下文
   */
  setContext(context: LogContext) {
    this.context = { ...this.context, ...context };
  }

  /**
   * 清除上下文
   */
  clearContext() {
    this.context = {};
  }

  /**
   * 调试日志
   */
  debug(message: string, context?: LogContext, source?: string) {
    this.log('debug', message, context, source);
  }

  /**
   * 信息日志
   */
  info(message: string, context?: LogContext, source?: string) {
    this.log('info', message, context, source);
  }

  /**
   * 警告日志
   */
  warn(message: string, context?: LogContext, source?: string) {
    this.log('warn', message, context, source);
  }

  /**
   * 错误日志
   */
  error(message: string, error?: Error, context?: LogContext, source?: string) {
    this.log('error', message, { ...context, error: error?.message, stack: error?.stack }, source);

    // 生产环境发送到 Sentry
    if (LOG_CONFIG.sentryEnabled && error) {
      Sentry.captureException(error, {
        tags: { source: source || 'unknown' },
        extra: { ...this.context, ...context },
      });
    }
  }

  /**
   * 核心日志方法
   */
  private log(level: LogLevel, message: string, context?: LogContext, source?: string) {
    // 检查日志级别
    if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[LOG_CONFIG.minLevel]) {
      return;
    }

    const entry: LogEntry = {
      timestamp: LOG_CONFIG.includeTimestamp ? new Date().toISOString() : '',
      level,
      message,
      context: { ...this.context, ...context },
      source: source || this.detectSource(),
    };

    // 输出到控制台
    if (LOG_CONFIG.consoleEnabled) {
      this.outputToConsole(entry);
    }

    // 发送到日志服务（如果有配置）
    if (process.env.NEXT_PUBLIC_LOG_ENDPOINT && level !== 'debug') {
      this.sendToLogService(entry);
    }
  }

  /**
   * 输出到控制台
   */
  private outputToConsole(entry: LogEntry) {
    const { timestamp, level, message, context, source } = entry;

    const prefix = [
      LOG_CONFIG.includeTimestamp ? `[${timestamp}]` : '',
      `[${level.toUpperCase()}]`,
      source ? `[${source}]` : '',
    ]
      .filter(Boolean)
      .join(' ');

    const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';

    // eslint-disable-next-line no-console
    console[consoleMethod](`${prefix} ${message}`, context || '');

    // 错误级别打印堆栈
    if (level === 'error' && LOG_CONFIG.includeStackTrace && context?.stack) {
      // eslint-disable-next-line no-console
      console.error(context.stack);
    }
  }

  /**
   * 发送到日志服务
   */
  private async sendToLogService(entry: LogEntry) {
    try {
      await fetch(process.env.NEXT_PUBLIC_LOG_ENDPOINT || '/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
        keepalive: true,
      });
    } catch (error) {
      // 静默失败，避免日志系统本身影响应用
      // eslint-disable-next-line no-console
      console.error('[Logger] Failed to send to log service:', error);
    }
  }

  /**
   * 检测调用源
   */
  private detectSource(): string {
    if (typeof window === 'undefined') {
      return 'server';
    }

    try {
      const error = new Error();
      const stack = error.stack;
      if (!stack) return 'unknown';

      const lines = stack.split('\n');
      // 找到调用日志函数的第一行
      for (const line of lines.slice(2, 6)) {
        const match = line.match(/at (.+?) \((.+)\)/);
        if (match) {
          const [, func, file] = match;
          const fileName = file.split('/').pop()?.replace('.ts', '').replace('.tsx', '');
          return `${fileName}:${func}`;
        }
      }
    } catch {
      // 忽略错误
    }

    return 'unknown';
  }
}

// ============================================================================
// 导出实例
// ============================================================================

export const logger = new Logger();

// ============================================================================
// 便捷函数
// ============================================================================

export function debug(message: string, context?: LogContext) {
  logger.debug(message, context);
}

export function info(message: string, context?: LogContext) {
  logger.info(message, context);
}

export function warn(message: string, context?: LogContext) {
  logger.warn(message, context);
}

export function error(message: string, error?: Error, context?: LogContext) {
  logger.error(message, error, context);
}

// ============================================================================
// API 请求日志中间件
// ============================================================================

export interface ApiLogContext {
  method: string;
  path: string;
  userId?: string;
  duration?: number;
  status?: number;
  error?: string | Error;
}

/**
 * 记录 API 请求开始
 */
export function logApiStart(context: ApiLogContext) {
  logger.info(`API Request: ${context.method} ${context.path}`, {
    method: context.method,
    path: context.path,
    userId: context.userId,
  }, 'api');
}

/**
 * 记录 API 请求结束
 */
export function logApiEnd(context: ApiLogContext & { duration: number; status: number }) {
  const level = context.status >= 400 ? 'warn' : 'info';
  const message = `API Response: ${context.method} ${context.path} ${context.status} (${context.duration}ms)`;

  if (level === 'warn') {
    logger.warn(message, {
      method: context.method,
      path: context.path,
      status: context.status,
      duration: context.duration,
      error: context.error,
    }, 'api');
  } else {
    logger.info(message, {
      method: context.method,
      path: context.path,
      status: context.status,
      duration: context.duration,
    }, 'api');
  }
}

/**
 * 记录 API 错误
 */
export function logApiError(context: ApiLogContext & { error: string | Error; duration: number }) {
  const errorObj = context.error instanceof Error ? context.error : new Error(context.error || 'Unknown error');
  
  logger.error(
    `API Error: ${context.method} ${context.path}`,
    errorObj,
    {
      method: context.method,
      path: context.path,
      status: context.status,
      duration: context.duration,
      userId: context.userId,
    },
    'api'
  );
}
