# 监控仪表板配置

## Sentry 仪表板

### 概览仪表板

创建以下图表：

#### 1. 错误趋势
- **指标**: `count()` where `level:error`
- **分组**: 按错误类型
- **时间范围**: 24 小时
- **刷新频率**: 5 分钟

#### 2. 用户影响
- **指标**: `count_unique(user.id)` where `level:error`
- **分组**: 按错误类型
- **时间范围**: 24 小时

#### 3. 错误类型分布
- **指标**: `count()` where `level:error`
- **分组**: 按 exception.type
- **图表类型**: 饼图

#### 4. 页面错误率
- **指标**: `count()` where `level:error`
- **分组**: 按 transaction
- **排序**: 降序

### 性能仪表板

#### 1. Core Web Vitals 趋势
- **指标**: 
  - `p75(lcp)` - Largest Contentful Paint
  - `p75(fcp)` - First Contentful Paint
  - `p75(cls)` - Cumulative Layout Shift
  - `p75(fid)` - First Input Delay
- **时间范围**: 7 天
- **刷新频率**: 1 小时

#### 2. API 性能
- **指标**: `p95(transaction.duration)`
- **分组**: 按 transaction name
- **过滤**: `transaction.op:http.server`
- **时间范围**: 24 小时

#### 3. 页面加载时间
- **指标**: `p75(transaction.duration)`
- **分组**: 按 transaction
- **排序**: 降序

#### 4. 慢事务分析
- **指标**: `count()` where `transaction.duration > 3000ms`
- **分组**: 按 transaction
- **时间范围**: 24 小时

### 用户行为仪表板

#### 1. 活跃用户
- **指标**: `count_unique(user.id)`
- **分组**: 按小时
- **时间范围**: 24 小时

#### 2. 用户会话
- **指标**: `count()` where `event_type:session_start`
- **分组**: 按小时
- **时间范围**: 7 天

#### 3. 功能使用率
- **指标**: `count()` where `event_type:user_action`
- **分组**: 按 action name
- **时间范围**: 24 小时

#### 4. 错误影响用户数
- **指标**: `count_unique(user.id)` where `level:error`
- **分组**: 按错误类型
- **时间范围**: 24 小时

## Vercel 仪表板

### 部署监控

1. 登录 Vercel Dashboard
2. 选择项目: `china-landing-ai-helper`
3. 导航到: Analytics

#### 关键指标
- **Web Vitals**: LCP, FID, CLS, FCP
- **访问量**: PV, UV
- **错误率**: 按页面分组
- **地区分布**: 按地理位置

### 设置告警

1. 进入项目设置
2. 导航到: Alerts
3. 创建告警规则:
   - 错误率 > 5%
   - LCP > 4s
   - 部署失败

## Upstash Redis 仪表板

### 监控指标

1. 登录 Upstash Console
2. 选择数据库
3. 查看 Metrics

#### 关键指标
- **请求数**: Commands/s
- **延迟**: Latency (p50, p95, p99)
- **内存使用**: Memory usage
- **连接数**: Active connections

### 设置告警

1. 进入数据库设置
2. 导航到: Alerts
3. 创建告警:
   - 内存使用 > 80%
   - 延迟 > 100ms
   - 连接数 > 100

## 自定义仪表板组件

### React 组件示例

```tsx
// src/components/monitoring/HealthStatus.tsx
import { useEffect, useState } from 'react';

export function HealthStatus() {
  const [health, setHealth] = useState({
    api: 'healthy',
    database: 'healthy',
    redis: 'healthy',
    ai: 'healthy',
  });

  useEffect(() => {
    const checkHealth = async () => {
      const response = await fetch('/api/health');
      const data = await response.json();
      setHealth(data);
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // 30 秒
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="health-status">
      {Object.entries(health).map(([service, status]) => (
        <div key={service} className={`status-item ${status}`}>
          <span className="service-name">{service}</span>
          <span className="status-indicator">{status}</span>
        </div>
      ))}
    </div>
  );
}
```

## Grafana 集成（可选）

如果使用 Grafana，可以配置以下数据源：

### 数据源
1. **Prometheus**: 指标收集
2. **Loki**: 日志聚合
3. **Tempo**: 分布式追踪
4. **Sentry**: 错误追踪

### 仪表板模板
- 导入 ID: `10789` (Node.js 应用监控)
- 导入 ID: `10566` (Next.js 应用监控)
- 导入 ID: `11662` (Redis 监控)

## 仪表板访问权限

| 角色 | 访问级别 | 可操作 |
|------|---------|-------|
| 管理员 | 完全访问 | 创建/编辑/删除 |
| 开发人员 | 只读 + 创建 | 查看/创建个人仪表板 |
| 产品经理 | 只读 | 查看业务指标 |
| 运维 | 完全访问 | 创建/编辑告警 |
