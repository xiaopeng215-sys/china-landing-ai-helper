// Sentry Alert Rules Configuration
// P1-16: Sentry 告警规则配置
// 对应 Sentry 项目: gbhenry/pwa
// DSN: https://429149bf2ffdb770adada90a98d5f25d@o4511198667931648.ingest.us.sentry.io/4511199238029312
//
// 在 Sentry Dashboard 中手动创建以下告警规则，或通过 sentry-cli/api 配置
// 文档: https://docs.sentry.io/product/accounts/quotas/alerts/

module.exports = {
  // ============================================
  // P1-16: Sentry 告警规则
  // ============================================

  alerts: [
    // ------------------------------------------------
    // [P1-CRITICAL] API 错误率超过 5%
    // ------------------------------------------------
    {
      name: "[P1-CRITICAL] API Error Rate > 5% in 5 min",
      aggregate: "percentage(count_if(http.status_code, equals, 500), count()) > 0.05",
      query: "event.type:transaction project:pwa transaction.op:http.server",
      timeWindow: 5,
      resolution: 5,
      triggers: [
        {
          name: "critical",
          severity: "critical",
          thresholdType: "above",
          thresholdValue: 5,
          actions: [],  // 配置飞书 Webhook 或 Email
        },
      ],
      description: "当 5 分钟内 API 5xx 错误率超过 5% 时触发",
      documentation: "https://docs.sentry.io/product/alerts/create-alerts/",
    },

    // ------------------------------------------------
    // [P1-CRITICAL] Session Replay 无法正常工作
    // ------------------------------------------------
    {
      name: "[P1-CRITICAL] High Error Count > 20 in 10 min",
      aggregate: "count() > 20",
      query: "event.type:error project:pwa",
      timeWindow: 10,
      resolution: 10,
      triggers: [
        {
          name: "critical",
          severity: "critical",
          thresholdType: "above",
          thresholdValue: 20,
          actions: [],
        },
      ],
      description: "当 10 分钟内错误数超过 20 时触发（异常堆积）",
    },

    // ------------------------------------------------
    // [P2-WARNING] Performance - LCP > 4s
    // ------------------------------------------------
    {
      name: "[P2-WARNING] LCP > 4s in 15 min",
      aggregate: "p95(lcp)",
      query: "event.type:transaction project:pwa",
      timeWindow: 15,
      resolution: 15,
      environment: "production",
      triggers: [
        {
          name: "warning",
          severity: "warning",
          thresholdType: "above",
          thresholdValue: 4000, // 4000ms
          actions: [],
        },
      ],
      description: "当 P95 LCP 超过 4 秒时触发（用户体验下降）",
    },

    // ------------------------------------------------
    // [P2-WARNING] API 延迟 P99 > 3s
    // ------------------------------------------------
    {
      name: "[P2-WARNING] API P99 Latency > 3s in 10 min",
      aggregate: "p99(transaction.duration)",
      query: "event.type:transaction project:pwa transaction.op:http.server",
      timeWindow: 10,
      resolution: 10,
      environment: "production",
      triggers: [
        {
          name: "warning",
          severity: "warning",
          thresholdType: "above",
          thresholdValue: 3000,
          actions: [],
        },
      ],
      description: "当 API P99 延迟超过 3 秒时触发",
    },

    // ------------------------------------------------
    // [P3-INFO] 新错误类型出现
    // ------------------------------------------------
    {
      name: "[P3-INFO] New Error Type Appears",
      aggregate: "uniqueIssues()",
      query: "event.type:error project:pwa",
      timeWindow: 60,
      resolution: 60,
      triggers: [
        {
          name: "info",
          severity: "info",
          thresholdType: "above",
          thresholdValue: 0,
          actions: [],
        },
      ],
      description: "当出现新的错误类型时触发（监控新问题）",
    },

    // ------------------------------------------------
    // [P2-WARNING] AI Chat 错误率
    // ------------------------------------------------
    {
      name: "[P2-WARNING] AI Chat Error Rate > 10% in 5 min",
      aggregate: "percentage(count_if(tags.ai_error, equals, true), count()) > 0.10",
      query: "event.type:transaction project:pwa transaction:/api/chat*",
      timeWindow: 5,
      resolution: 5,
      environment: "production",
      triggers: [
        {
          name: "warning",
          severity: "warning",
          thresholdType: "above",
          thresholdValue: 10,
          actions: [],
        },
      ],
      description: "当 AI Chat 接口 5 分钟内错误率超过 10% 时触发",
    },
  ],

  // ============================================
  // 告警通知配置
  // ============================================
  notification: {
    // 飞书 Webhook（需要在 Sentry 配置）
    feishuWebhook: process.env.FEISHU_WEBHOOK || "",

    // 告警接收人
    recipients: {
      critical: ["tech-lead", "backend-team"],
      warning: ["backend-team"],
      info: ["backend-team"],
    },

    // 告警静默时段（避免深夜打扰）
    quietHours: {
      enabled: true,
      start: "22:00", // 22:00 - 08:00 不发 P3 告警
      end: "08:00",
      timezone: "Asia/Shanghai",
      suppressSeverity: ["info"], // 仅静默 info 级别
    },
  },

  // ============================================
  // 采样率配置（供参考，实际在 sentry.*.config.js 中配置）
  // ============================================
  sampling: {
    production: {
      tracesSampleRate: 0.1,          // 服务端追踪采样 10%
      replaysSessionSampleRate: 0.1,     // Session Replay 采样 10%
      replaysOnErrorSampleRate: 1.0,    // 错误时 Replay 全量
    },
    development: {
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 1.0,
      replaysOnErrorSampleRate: 1.0,
    },
  },
};
