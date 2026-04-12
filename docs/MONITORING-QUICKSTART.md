# 监控集成快速入门

本指南帮助你快速上手项目的监控系统。

---

## 🚀 5 分钟快速开始

### 1. 确认环境变量

确保 `.env.local` 包含以下配置：

```bash
# Sentry DSN（必填）
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/your-project-id
NEXT_PUBLIC_SENTRY_RELEASE=1.0.0-beta

# 可选：外部日志服务
# NEXT_PUBLIC_LOG_ENDPOINT=https://your-log-service/api/logs
# NEXT_PUBLIC_ANALYTICS_ENDPOINT=https://your-analytics/api/collect
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 运行监控测试

```bash
# 测试健康检查和指标端点
npm run monitoring:test
```

预期输出：
```
╔════════════════════════════════════════════╗
║   🔥 监控集成测试脚本                    ║
╚════════════════════════════════════════════╝

[1/4] 测试健康检查端点 (/api/health)...
  ✅ HTTP 200 - 健康检查通过
     状态：healthy
     环境：development
     版本：1.0.0-beta

[2/4] 测试 Liveness Probe (/api/health/live)...
  ✅ HTTP 200 - Liveness Probe 通过

[3/4] 测试 Readiness Probe (/api/health/ready)...
  ✅ HTTP 200 - Readiness Probe 通过

[4/4] 测试指标收集端点 (/api/metrics)...
  ✅ POST /api/metrics - 指标接收成功

════════════════════════════════════════════
测试总结
════════════════════════════════════════════
  总计：4 个测试
  ✅ 通过：4
  ⚠️  警告：0
  ❌ 失败：0

🎉 所有测试通过！监控系统运行正常
```

### 4. 触发测试错误

在浏览器控制台执行：

```javascript
throw new Error('测试 Sentry 错误上报');
```

然后在 Sentry 项目查看错误事件。

---

## 📚 核心功能

### 1. 错误追踪（Sentry）

#### 自动捕获
- 客户端 JavaScript 错误
- 服务端 API 错误
- Edge Runtime 错误
- 未处理的 Promise rejection

#### 手动报告
```typescript
import { reportError } from '@/lib/monitoring';

try {
  await riskyOperation();
} catch (error) {
  reportError(error, {
    category: 'database',
    tags: { query: 'users' },
    extra: { userId: '123' }
  });
}
```

### 2. 性能监控

#### Core Web Vitals
自动监控并报告：
- LCP (Largest Contentful Paint)
- FCP (First Contentful Paint)
- CLS (Cumulative Layout Shift)
- FID (First Input Delay)

#### API 性能
```typescript
import { monitorApiRequest } from '@/lib/monitoring';

const result = await monitorApiRequest('/api/chat', async () => {
  return await fetch('/api/chat', { method: 'POST', body });
});
```

### 3. 日志系统

#### 基本用法
```typescript
import { logger } from '@/lib/logger';

logger.debug('调试信息', { data });
logger.info('用户登录', { userId: '123' });
logger.warn('性能警告', { duration: 3000 });
logger.error('数据库错误', error, { query: 'SELECT *' });
```

#### API 日志
```typescript
import { logApiStart, logApiEnd, logApiError } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  logApiStart({ method: 'POST', path: '/api/chat' });
  
  try {
    // ... 处理请求
    logApiEnd({ method: 'POST', path: '/api/chat', status: 200, duration: Date.now() - startTime });
  } catch (error) {
    logApiError({ method: 'POST', path: '/api/chat', error, duration: Date.now() - startTime });
    throw error;
  }
}
```

### 4. 健康检查

#### 端点
- `/api/health` - 完整健康检查
- `/api/health/live` - Kubernetes liveness probe
- `/api/health/ready` - Kubernetes readiness probe

#### 测试
```bash
curl http://localhost:3000/api/health | jq
```

---

## 🛠️ 配置 Sentry

### 1. 创建项目

1. 登录 https://sentry.io
2. 创建项目：`china-landing-ai-helper/pwa`
3. 选择平台：Next.js
4. 复制 DSN

### 2. 配置环境变量

```bash
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
NEXT_PUBLIC_SENTRY_RELEASE=1.0.0-beta
SENTRY_ORG=china-landing-ai-helper
SENTRY_PROJECT=pwa
SENTRY_AUTH_TOKEN=xxx  # 用于上传 source maps
```

### 3. 配置告警

在 Sentry UI 中创建以下告警：

#### 错误率告警
```
Condition: count() > 50 in 5 minutes
Action: Email + Slack
```

#### 性能告警
```
Condition: p75(lcp) > 4000ms in 10 minutes
Action: Slack
```

---

## 📊 查看监控数据

### Sentry 仪表板

访问：https://sentry.io/organizations/china-landing-ai-helper/

#### 关键指标
- 错误趋势（24 小时）
- 受影响用户数
- 错误类型分布
- 页面加载性能

### Vercel Analytics

访问：https://vercel.com/dashboard

#### 关键指标
- Web Vitals 实时数据
- 访问量统计
- 地区分布

### Upstash Redis

访问：https://console.upstash.com/

#### 关键指标
- 请求数/秒
- 延迟（p50/p95/p99）
- 内存使用

---

## 🔍 故障排查

### 问题：Sentry 没有收到错误

**检查清单**：
1. ✅ DSN 配置正确
2. ✅ 环境变量已加载（重启开发服务器）
3. ✅ 错误发生在客户端（服务端错误需要 server config）
4. ✅ 网络可达（无防火墙阻止）

**调试步骤**：
```bash
# 检查环境变量
echo $NEXT_PUBLIC_SENTRY_DSN

# 查看浏览器控制台（开发环境 Sentry 会打印日志）
# 如果 debug: true，会看到更多详情
```

### 问题：健康检查返回 503

**可能原因**：
- 数据库配置缺失
- Redis 连接失败
- AI API key 未配置

**解决方案**：
```bash
# 检查详细状态
curl http://localhost:3000/api/health/ready | jq

# 查看哪些检查失败
# 根据失败的检查项配置对应的环境变量
```

### 问题：日志没有输出

**检查**：
1. 开发环境：所有级别日志都会输出
2. 生产环境：仅 warn 和 error 级别输出
3. 检查 `LOG_CONFIG.consoleEnabled` 设置

---

## 📖 深入阅读

- `MONITORING-CONFIG-SUMMARY.md` - 完整配置总结
- `MONITORING-IMPLEMENTATION-REPORT.md` - 实施报告
- `docs/monitoring-alerts.md` - 告警规则详情
- `docs/monitoring-dashboard.md` - 仪表板配置

---

## 🆘 获取帮助

遇到问题？

1. 查看上述故障排查章节
2. 运行 `npm run monitoring:test` 诊断
3. 检查 Sentry 项目设置
4. 查看应用日志

---

**最后更新**: 2026-04-12  
**维护者**: 周伯通 (资深后端工程师)
