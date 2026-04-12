# 🔐 安全审计报告 - China Landing AI Helper PWA

**审计日期**: 2026-04-12  
**审计员**: 金吒安全审计 Agent  
**审计范围**: 依赖安全、认证流程、数据安全、敏感信息保护  
**整体评分**: 72/100 (🟡 中等风险)

---

## 📊 执行摘要

| 类别 | 严重 | 高 | 中 | 低 | 信息 |
|------|------|---|---|---|-----|
| **依赖安全** | 0 | 0 | 0 | 4 | 0 |
| **认证流程** | 0 | 1 | 2 | 1 | 2 |
| **数据安全** | 0 | 1 | 1 | 2 | 1 |
| **敏感信息** | 0 | 1 | 2 | 3 | 1 |
| **总计** | **0** | **2** | **5** | **10** | **4** |

**关键发现**:
- 🔴 2 个高危问题需立即修复 (CSRF 保护、Supabase RLS)
- 🟡 5 个中危问题建议本周内修复
- ✅ 无严重 (Critical) 级别漏洞

---

## 🔴 P0 高危问题 (立即修复)

### 1. CSRF 保护缺失

**位置**: `src/app/api/auth/[...nextauth]/route.ts`

**问题**: NextAuth 配置未启用 CSRF 保护

**风险**: 跨站请求伪造攻击

**修复**:
```typescript
const handler = NextAuth({
  providers: [/* ... */],
  csrfProtection: true,  // ✅ 添加此行
  // 或自定义配置
  // csrfToken: { /* ... */ }
});
```

### 2. Supabase RLS 未验证

**位置**: `src/lib/database.ts`

**问题**: 使用匿名密钥但未确认行级安全策略是否启用

**风险**: 数据越权访问

**验证步骤**:
1. 登录 Supabase Dashboard → Authentication → Policies
2. 确认所有表都有 RLS 策略
3. 测试未授权访问是否被拒绝

**推荐策略**:
```sql
-- users 表
CREATE POLICY "用户隔离" ON users FOR SELECT USING (auth.uid() = id);

-- itineraries 表  
CREATE POLICY "用户隔离" ON itineraries FOR ALL USING (auth.uid() = user_id);
```

---

## 🟡 P1 中危问题 (本周修复)

### 3. 注册端点无速率限制

**位置**: `src/app/api/auth/register/route.ts`

**修复**: 添加 Upstash Redis 速率限制
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"),
});

// 在 POST handler 中
const { success } = await ratelimit.limit(request.ip || "unknown");
if (!success) {
  return NextResponse.json({ error: "请求过于频繁" }, { status: 429 });
}
```

### 4. MiniMax API Key 命名不当

**位置**: `src/lib/ai-client.ts`, `.env.local`

**问题**: 使用 `NEXT_PUBLIC_` 前缀但应为服务端密钥

**修复**:
```bash
# .env.local - 修改为
MINIMAX_API_KEY=your-key  # 移除 NEXT_PUBLIC_
```

```typescript
// src/lib/ai-client.ts
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || '';  // 移除 NEXT_PUBLIC_
```

### 5. JWT 配置不完整

**位置**: `src/app/api/auth/[...nextauth]/route.ts`

**修复**:
```typescript
const handler = NextAuth({
  // ...
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
    secret: process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET,
  },
});
```

### 6. 安全头配置冲突

**位置**: `next.config.js` vs `vercel.json`

**问题**: `X-Frame-Options` 配置不一致 (SAMEORIGIN vs DENY)

**修复**: 统一使用 `DENY` (在 next.config.js 中修改)

---

## 🟢 P2 低危问题 (下次迭代)

### 7-10. 其他改进项

7. **密码强度**: 增加特殊字符要求，最小 10 位
8. **Sentry 防护**: 配置域名白名单，启用速率限制
9. **密钥轮换**: 实现自动化轮换流程
10. **数据清理**: 浏览历史 90 天自动过期

---

## ✅ 安全优势

- ✅ 生产依赖无高危漏洞
- ✅ 密码 bcrypt 加密存储
- ✅ 安全头配置完善 (HSTS, CSP, X-Frame-Options 等)
- ✅ 无危险代码模式 (eval, innerHTML)
- ✅ 环境变量管理规范
- ✅ 输入验证到位 (邮箱、密码)

---

## 📋 修复检查清单

```markdown
## P0 (2026-04-13 前)
- [ ] 启用 NextAuth CSRF 保护
- [ ] 验证 Supabase RLS 策略

## P1 (2026-04-19 前)
- [ ] 实现注册速率限制
- [ ] 修复 MiniMax API Key 命名
- [ ] 配置 JWT 加密和过期时间
- [ ] 统一安全头配置

## P2 (2026-04-30 前)
- [ ] 加强密码策略
- [ ] 配置 Sentry 域名白名单
- [ ] 实现密钥轮换流程
- [ ] 添加数据自动清理
```

---

## 🔍 审计方法

1. **依赖扫描**: `npm audit --json`
2. **代码审查**: 手动审查认证、数据库、API 路由
3. **配置检查**: 环境变量、安全头、PWA 配置
4. **Git 历史**: 检查敏感信息泄露历史
5. **模式匹配**: 搜索危险代码模式

---

## 📞 联系方式

如有疑问，请联系开发团队或安全负责人。

**下次审计**: 2026-07-12 (季度审计)
