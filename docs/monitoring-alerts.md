# 监控告警规则配置

本文档定义了 Sentry 和其他监控系统的告警规则。

## Sentry 告警规则

### 1. 错误率告警

#### 高错误率 (Critical)
- **触发条件**: 5 分钟内错误率 > 5%
- **影响范围**: 所有用户
- **通知渠道**: 邮件 + Slack
- **响应时间**: 15 分钟内

#### 中错误率 (Warning)
- **触发条件**: 10 分钟内错误率 > 2%
- **影响范围**: 部分用户
- **通知渠道**: Slack
- **响应时间**: 1 小时内

### 2. 性能告警

#### 页面加载慢 (Critical)
- **触发条件**: LCP > 4s 持续 10 分钟
- **影响范围**: 所有页面
- **通知渠道**: Slack
- **响应时间**: 30 分钟内

#### API 响应慢 (Warning)
- **触发条件**: API P95 延迟 > 2s 持续 5 分钟
- **影响范围**: /api/chat 端点
- **通知渠道**: Slack
- **响应时间**: 1 小时内

### 3. 可用性告警

#### 服务不可用 (Critical)
- **触发条件**: 健康检查失败 3 次
- **影响范围**: 整个应用
- **通知渠道**: 邮件 + Slack + 电话
- **响应时间**: 立即

#### 数据库连接失败 (Critical)
- **触发条件**: Supabase 连接错误 > 10 次/分钟
- **影响范围**: 所有需要数据库的功能
- **通知渠道**: 邮件 + Slack
- **响应时间**: 15 分钟内

### 4. 业务指标告警

#### 聊天失败率 (Warning)
- **触发条件**: /api/chat 5xx 错误 > 3% 持续 5 分钟
- **影响范围**: 聊天功能
- **通知渠道**: Slack
- **响应时间**: 30 分钟内

#### 认证失败 (Warning)
- **触发条件**: 登录失败率 > 10% 持续 10 分钟
- **影响范围**: 用户认证
- **通知渠道**: Slack
- **响应时间**: 1 小时内

## Sentry 配置步骤

### 创建告警规则

1. 登录 Sentry: https://sentry.io/
2. 进入项目: `china-landing-ai-helper/pwa`
3. 导航到: Alerts → Create Alert

### 错误率告警配置

```yaml
Alert Name: 高错误率告警
Condition: 
  - Aggregate: count()
  - Filter: level:error
  - Threshold: > 50
  - Time Window: 5 minutes
Actions:
  - Send email to: team@example.com
  - Send Slack notification to: #alerts-critical
```

### 性能告警配置

```yaml
Alert Name: 页面加载性能告警
Condition:
  - Metric: p75(lcp)
  - Threshold: > 4000ms
  - Time Window: 10 minutes
Actions:
  - Send Slack notification to: #alerts-performance
```

## 自定义告警端点

创建 `/api/alerts/webhook` 端点接收外部告警：

```typescript
// POST /api/alerts/webhook
{
  "source": "sentry|upstash|minimax",
  "severity": "critical|warning|info",
  "title": "告警标题",
  "message": "告警详情",
  "metadata": { ... }
}
```

## 告警升级策略

| 级别 | 响应时间 | 升级时间 | 升级目标 |
|------|---------|---------|---------|
| Critical | 15 分钟 | 30 分钟 | 技术负责人 |
| Warning | 1 小时 | 4 小时 | 值班工程师 |
| Info | 24 小时 | - | - |

## 值班安排

- **工作日**: 9:00-18:00 - 值班工程师
- **夜间/周末**: on-call 轮值

## 告警静默

以下情况可以静默告警：

1. 计划内维护（提前通知）
2. 已知的第三方服务问题
3. 测试环境告警

## 告警回顾

每周审查：
- 误报告警
- 漏报事件
- 响应时间
- 改进建议
