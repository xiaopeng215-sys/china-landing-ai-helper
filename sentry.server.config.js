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

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 0.2, // 生产环境降低采样率

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Set the environment
  environment: process.env.NODE_ENV || 'development',

  // Set the release
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || 'unversioned',

  // 性能监控配置
  enableTracing: true,

  // 自定义 traces sampler
  tracesSampler: (samplingContext) => {
    // 对某些事务进行不同的采样
    if (samplingContext.transactionContext.name?.includes('healthcheck')) {
      return 0; // 不采样健康检查
    }
    if (samplingContext.transactionContext.name?.includes('OPTIONS')) {
      return 0.01; // 低频采样 OPTIONS 请求
    }
    // 默认采样率
    return 0.2;
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
