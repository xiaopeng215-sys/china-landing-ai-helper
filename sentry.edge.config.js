// This file configures the initialization of Sentry on the Edge Runtime.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Define how likely traces are sampled. Adjust this value in production.
  tracesSampleRate: 0.1, // Edge runtime 更低采样率

  // Set the environment
  environment: process.env.NODE_ENV || 'development',

  // Set the release
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || 'unversioned',

  // Enable tracing
  enableTracing: true,

  // Edge runtime 特定的 traces sampler
  tracesSampler: (samplingContext) => {
    // 不采样健康检查端点
    if (samplingContext.transactionContext.name?.includes('healthcheck')) {
      return 0;
    }
    return 0.1;
  },

  // 忽略某些错误
  ignoreErrors: [
    'NetworkError',
    'AbortError',
  ],
});
