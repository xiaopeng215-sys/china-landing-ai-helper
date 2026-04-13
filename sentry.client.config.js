// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration({
      // P1-15: Replay 隐私保护
      maskAllText: true,         // 掩码所有文本内容（用户名、标题等）
      blockAllMedia: true,        // 屏蔽所有媒体（图片、视频）
      maskSensitiveAttributes: [
        'password',
        'passwordConfirm',
        'secret',
        'token',
        'apiKey',
        'authorization',
        'cookie',
        'x-api-key',
      ],
    }),
  ],

  // MO-02: 生产环境采样率降至 20%（开发环境 100%）
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,

  // Define how likely Replay events are sampled.
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Set the environment
  environment: process.env.NODE_ENV || 'development',

  // Set the release
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || 'unversioned',

  // 忽略无意义的客户端错误
  ignoreErrors: [
    'NetworkError',
    'Network request failed',
    'AbortError',
    'The operation was aborted',
    'Non-Error promise rejection captured',
    'ResizeObserver loop limit exceeded',
    'chrome-extension://',
    'moz-extension://',
  ],
});
