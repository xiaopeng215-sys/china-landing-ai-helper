/**
 * 监控工具库
 * 提供性能监控、用户行为追踪、错误报告等功能
 */

import * as Sentry from '@sentry/nextjs';

// ============================================================================
// 类型定义
// ============================================================================

export interface MonitoringEvent {
  category: 'performance' | 'user_action' | 'error' | 'api' | 'navigation';
  action: string;
  data?: Record<string, any>;
  timestamp?: number;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  delta?: number;
  rating?: 'good' | 'needs-improvement' | 'poor';
  attribution?: string;
}

export interface UserAction {
  action: string;
  element?: string;
  page?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

// ============================================================================
// 性能监控 (Core Web Vitals)
// ============================================================================

/**
 * 报告 Core Web Vitals 指标
 */
export function reportWebVitals(metric: PerformanceMetric) {
  const { name, value, delta, rating } = metric;

  // 发送到 Sentry Performance
  Sentry.addBreadcrumb({
    category: 'web_vitals',
    message: `${name}: ${value}ms (${rating})`,
    level: 'info',
    data: { value, delta, rating },
  });

  // 记录到控制台（仅开发环境）
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${name}:`, {
      value,
      delta,
      rating,
    });
  }

  // 发送到分析端点（可选）
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
    sendToAnalytics({
      type: 'web_vital',
      name,
      value,
      rating,
      timestamp: Date.now(),
    });
  }
}

/**
 * 监控页面加载性能
 */
export function monitorPageLoad() {
  if (typeof window === 'undefined' || typeof performance === 'undefined') {
    return;
  }

  // 使用 Performance API 获取页面加载指标
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

  if (navigation) {
    const metrics = {
      // DNS 查询时间
      dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
      // TCP 连接时间
      tcpConnect: navigation.connectEnd - navigation.connectStart,
      // SSL 握手时间
      sslHandshake: navigation.secureConnectionStart 
        ? navigation.connectEnd - navigation.secureConnectionStart 
        : 0,
      // TTFB (Time to First Byte)
      ttfb: navigation.responseStart - navigation.requestStart,
      // 内容下载时间
      contentDownload: navigation.responseEnd - navigation.responseStart,
      // DOM 解析时间
      domInteractive: navigation.domInteractive - navigation.domInteractive,
      // DOM 完成时间
      domComplete: navigation.domComplete - navigation.domInteractive,
      // 页面完全加载时间
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      // 首屏时间 (近似)
      firstContentfulPaint: getFirstContentfulPaint(),
    };

    // 报告关键指标
    Sentry.addBreadcrumb({
      category: 'page_load',
      message: `TTFB: ${metrics.ttfb}ms, DOM Complete: ${metrics.domComplete}ms`,
      level: 'info',
      data: metrics,
    });

    return metrics;
  }

  return null;
}

/**
 * 获取首屏绘制时间
 */
function getFirstContentfulPaint(): number {
  if (typeof performance === 'undefined') return 0;

  const entries = performance.getEntriesByType('paint');
  const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
  return fcp ? fcp.startTime : 0;
}

// ============================================================================
// 用户行为分析
// ============================================================================

/**
 * 追踪用户点击事件
 */
export function trackClick(element: HTMLElement, metadata?: Record<string, any>) {
  const action: UserAction = {
    action: 'click',
    element: getElementSelector(element),
    page: window.location.pathname,
    timestamp: Date.now(),
    metadata: {
      text: element.textContent?.trim().slice(0, 100),
      tagName: element.tagName,
      className: element.className,
      id: element.id,
      ...metadata,
    },
  };

  // 发送到 Sentry
  Sentry.addBreadcrumb({
    category: 'ui',
    type: 'click',
    message: `Clicked ${action.element}`,
    data: action.metadata,
    level: 'info',
  });

  return action;
}

/**
 * 追踪页面浏览
 */
export function trackPageView(path: string, options?: {
  title?: string;
  referrer?: string;
}) {
  Sentry.addBreadcrumb({
    category: 'navigation',
    type: 'navigation',
    message: `Navigated to ${path}`,
    data: {
      path,
      title: options?.title,
      referrer: options?.referrer || document.referrer,
    },
  });
}

/**
 * 追踪用户会话
 */
export function trackSession(userId: string, metadata?: Record<string, any>) {
  // 设置用户上下文
  Sentry.setUser({
    id: userId,
    ...metadata,
  });

  // 记录会话开始
  Sentry.addBreadcrumb({
    category: 'session',
    type: 'default',
    message: 'Session started',
    data: metadata,
    level: 'info',
  });
}

// ============================================================================
// API 监控
// ============================================================================

/**
 * API 请求监控包装器
 */
export async function monitorApiRequest<T>(
  endpoint: string,
  requestFn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const startTime = performance.now();
  
  return Sentry.startSpan(
    {
      name: `API ${endpoint}`,
      op: 'http.client',
    },
    async (span) => {
      span.setAttribute('url', endpoint);
      if (metadata) {
        Object.entries(metadata).forEach(([key, value]) => {
          span.setAttribute(key, value);
        });
      }
      
      try {
        const result = await requestFn();
        const duration = performance.now() - startTime;

        // 记录成功指标
        Sentry.addBreadcrumb({
          category: 'api',
          type: 'http',
          message: `API ${endpoint} completed in ${duration.toFixed(2)}ms`,
          level: 'info',
          data: { duration, success: true },
        });

        return result;
      } catch (error) {
        const duration = performance.now() - startTime;

        // 记录错误指标
        Sentry.addBreadcrumb({
          category: 'api',
          type: 'error',
          message: `API ${endpoint} failed after ${duration.toFixed(2)}ms`,
          level: 'error',
          data: { duration, error: error instanceof Error ? error.message : 'Unknown error' },
        });

        throw error;
      }
    }
  );
}

// ============================================================================
// 错误报告增强
// ============================================================================

/**
 * 报告错误并添加上下文
 */
export function reportError(
  error: Error,
  context?: {
    category?: string;
    tags?: Record<string, string>;
    extra?: Record<string, any>;
  }
) {
  Sentry.captureException(error, {
    tags: context?.tags ? { ...context.tags, category: context.category } : { category: context?.category },
    extra: context?.extra,
  });
}

/**
 * 添加性能监控面包屑
 */
export function addPerformanceBreadcrumb(metric: string, value: number, unit: string = 'millisecond') {
  Sentry.addBreadcrumb({
    category: 'performance',
    type: 'default',
    message: `${metric}: ${value} ${unit}`,
    data: { metric, value, unit },
    level: 'info',
  });
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 获取元素的 CSS 选择器
 */
function getElementSelector(element: HTMLElement): string {
  if (element.id) {
    return `#${element.id}`;
  }

  const parts: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current.tagName) {
    let selector = current.tagName.toLowerCase();

    if (current.id) {
      selector = `#${current.id}`;
      parts.unshift(selector);
      break;
    } else if (current.className && typeof current.className === 'string') {
      const classes = current.className.split(' ').filter(Boolean).slice(0, 2);
      if (classes.length > 0) {
        selector += `.${classes.join('.')}`;
      }
    }

    parts.unshift(selector);
    current = current.parentElement;

    // 最多追溯到 body
    if (current?.tagName === 'BODY') {
      break;
    }
  }

  return parts.join(' > ');
}

/**
 * 发送到分析端点
 */
async function sendToAnalytics(data: Record<string, any>) {
  try {
    await fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || '/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      keepalive: true,
    });
  } catch (error) {
    // 静默失败，不影响用户体验
    console.error('[Analytics] Failed to send:', error);
  }
}

// ============================================================================
// 初始化
// ============================================================================

/**
 * 初始化客户端监控
 */
export function initClientMonitoring() {
  if (typeof window === 'undefined') {
    return;
  }

  // 监控页面加载
  if (document.readyState === 'complete') {
    monitorPageLoad();
  } else {
    window.addEventListener('load', () => {
      monitorPageLoad();
    });
  }

  // 监控用户点击（事件委托）
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target) {
      trackClick(target);
    }
  });

  // 监控页面导航（SPA）
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    trackPageView(window.location.pathname);
  };

  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    trackPageView(window.location.pathname);
  };

  // 监听 popstate
  window.addEventListener('popstate', () => {
    trackPageView(window.location.pathname);
  });
}
