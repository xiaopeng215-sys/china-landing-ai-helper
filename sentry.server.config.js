// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Add optional integrations for additional features
  integrations: [
    // Express/Node.js specific integrations
    Sentry.httpIntegration(),
  ],

  // MO-02: 生产环境 tracesSampleRate 降至 0.1
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Set the environment
  environment: process.env.NODE_ENV || 'development',

  // Set the release
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || 'unversioned',

  // 性能监控配置
  enableTracing: true,

  // 自定义 traces sampler（仅生产环境生效）
  tracesSampler: (samplingContext) => {
    if (process.env.NODE_ENV !== 'production') {
      return 1.0; // 非生产环境全采样
    }
    // 生产环境：按事务类型差异化采样
    if (samplingContext.transactionContext.name?.includes('healthcheck')) {
      return 0; // 不采样健康检查
    }
    if (samplingContext.transactionContext.name?.includes('OPTIONS')) {
      return 0.01; // 低频采样 OPTIONS 请求
    }
    if (samplingContext.transactionContext.name?.includes('static')) {
      return 0.05; // 静态资源超低采样
    }
    if (samplingContext.transactionContext.name?.includes('api/chat')) {
      return 0.15; // AI 对话稍微多采样（有价值）
    }
    // 默认生产采样率 0.1
    return 0.1;
  },

  // 忽略某些错误
  ignoreErrors: [
    // 网络错误
    'NetworkError',
    'Network request failed',
    // 客户端取消
    'AbortError',
    'The operation was aborted',
    // 无意义的错误
    'Non-Error promise rejection captured',
    'ResizeObserver loop limit exceeded',
    // 第三方扩展错误
    'chrome-extension://',
    'moz-extension://',
  ],

  // 在发送前处理事件
  beforeSend(event, hint) {
    // 检查是否是重复错误
    if (event.exception) {
      const error = hint.originalException;
      if (error instanceof Error && error.message?.includes('Network')) {
        // 网络错误降低优先级
        event.tags = { ...event.tags, error_type: 'network' };
      }
    }
    return event;
  },
});
