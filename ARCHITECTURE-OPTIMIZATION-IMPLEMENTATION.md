# 架构优化实施指南

**版本**: 1.0  
**更新时间**: 2026-04-12  
**关联文档**: ARCHITECTURE-OPTIMIZATION-REPORT.md  

---

## 📦 新增文件清单

```
src/lib/
├── cache.ts                    # ✅ 统一缓存服务
├── ai-cache.ts                 # ✅ AI 响应缓存
└── database-pool.ts            # ✅ 数据库连接池

src/app/api/middleware/
├── rate-limit.ts               # ✅ 速率限制中间件
└── error-handler.ts            # ✅ 统一错误处理
```

---

## 🚀 快速开始

### 步骤 1: 安装依赖 (如需要)

```bash
cd products/china-landing-ai-helper/pwa
npm install
```

### 步骤 2: 配置环境变量

确保 `.env.local` 包含以下配置:

```bash
# Redis (必需 - 用于缓存和限流)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Supabase (必需 - 用于数据库)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 步骤 3: 集成缓存服务

#### 3.1 在 API Route 中使用缓存

**示例**: `src/app/api/v1/chat/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { sendToAIWithCache } from '@/lib/ai-cache';
import { withRateLimit } from '@/app/api/middleware/rate-limit';
import { handleApiError, createValidationError } from '@/app/api/middleware/error-handler';

export async function POST(request: NextRequest) {
  try {
    // 1. 速率限制检查
    const rateLimitResult = await withRateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMIT_EXCEEDED', message: '请求过于频繁' } },
        { status: 429 }
      );
    }
    
    // 2. 解析请求体
    let body;
    try {
      body = await request.json();
    } catch {
      throw createValidationError('无效的请求格式');
    }
    
    const { message, model } = body;
    
    // 3. 验证参数
    if (!message || typeof message !== 'string' || !message.trim()) {
      throw createValidationError('消息不能为空');
    }
    
    // 4. 调用 AI (带缓存)
    const messages = [{ role: 'user' as const, content: message }];
    const aiResponse = await sendToAIWithCache(messages, {
      model: model || 'qwen',
      structured: true,
      cacheTTL: 3600, // 1 小时
    });
    
    // 5. 返回响应
    return NextResponse.json({
      reply: aiResponse.content,
      model,
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}
```

#### 3.2 在数据库操作中使用连接池

**示例**: 更新 `src/lib/database.ts`

```typescript
// 在文件顶部导入
import { withDb } from '@/lib/database-pool';

// 替换所有直接调用 supabase.client 的地方
export async function getUserProfile(userId: string): Promise<User | null> {
  return withDb(async (client) => {
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }).catch((error) => {
    console.error('获取用户资料失败:', error);
    return null;
  });
}

// 类似地更新其他函数...
```

---

## 📊 监控与调试

### 查看缓存统计

```typescript
import { cache } from '@/lib/cache';

const stats = cache.getStats();
console.log('缓存统计:', stats);
// 输出: { hits: 100, misses: 50, size: 25, memory: { size: 25, maxSize: 100 } }
```

### 查看 AI 缓存命中率

```typescript
import { getCacheStats } from '@/lib/ai-cache';

const stats = await getCacheStats();
console.log('AI 缓存统计:', stats);
// 输出: { totalRequests: 150, cacheHits: 90, cacheMisses: 60, hitRate: '60.00%' }
```

### 查看数据库连接池统计

```typescript
import { getPoolStats } from '@/lib/database-pool';

const stats = getPoolStats();
console.log('连接池统计:', stats);
// 输出: { total: 5, inUse: 2, idle: 3, waiting: 0, totalQueries: 150 }
```

---

## 🔧 常见问题

### Q1: Redis 连接失败怎么办？

**A**: 系统会自动降级到内存缓存模式。检查日志:

```
[Cache] Redis 未配置，使用内存缓存
```

确保环境变量正确:

```bash
echo $UPSTASH_REDIS_REST_URL
echo $UPSTASH_REDIS_REST_TOKEN
```

### Q2: 数据库连接池未初始化？

**A**: 检查 Supabase 配置:

```bash
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

如果配置为占位符，系统会使用 Fallback 模式。

### Q3: 缓存命中率低？

**A**: 可能原因:
1. TTL 设置过短 → 增加 `cacheTTL` 参数
2. 请求参数变化频繁 → 检查消息规范化
3. 缓存 Key 冲突 → 检查 `createCacheKey` 函数

### Q4: 连接池等待队列过长？

**A**: 可能原因:
1. 最大连接数过小 → 增加 `max` 配置
2. 查询超时过短 → 增加 `queryTimeout`
3. 存在慢查询 → 检查数据库性能

调整配置:

```typescript
_pool = new SupabasePool(url, key, {
  min: 2,
  max: 20,  // 增加最大连接数
  acquireTimeout: 10000,  // 增加获取超时
});
```

---

## 📈 性能基准测试

### 测试脚本

```bash
# 安装 wrk (macOS)
brew install wrk

# 测试 chat API
wrk -t12 -c400 -d30s https://your-app.vercel.app/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"测试消息","model":"qwen"}'
```

### 预期性能提升

| 指标 | 优化前 | 优化后 | 提升 |
|------|--------|--------|------|
| P50 延迟 | 500ms | 150ms | 70% ↓ |
| P95 延迟 | 800ms | 200ms | 75% ↓ |
| P99 延迟 | 1200ms | 350ms | 71% ↓ |
| 最大并发 | 100 RPS | 500 RPS | 5x ↑ |
| AI 缓存命中率 | 0% | 60%+ | - |

---

## 🎯 下一步

### 本周完成

- [ ] 重构现有 API Route 使用新中间件
- [ ] 更新数据库操作使用连接池
- [ ] 集成 AI 响应缓存到 chat API
- [ ] 性能基准测试

### 下周完成

- [ ] API v1 版本化
- [ ] 统一请求验证
- [ ] 监控仪表板
- [ ] 文档完善

---

## 📞 支持

遇到问题？

1. 检查日志输出
2. 查看本文档常见问题
3. 联系架构优化团队

---

*最后更新：2026-04-12*
