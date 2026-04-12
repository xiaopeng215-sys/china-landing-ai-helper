# 🔒 安全审计报告 (Security Audit Report)

**项目**: China Landing AI Helper PWA  
**审计日期**: 2026-04-12  
**审计人**: 沙僧 (Security Agent)  
**审计范围**: `products/china-landing-ai-helper/pwa/`  
**优先级**: P0 - 生产环境安全审查

---

## 📊 执行摘要

| 类别 | 状态 | 风险等级 | 发现数量 |
|------|------|----------|----------|
| **XSS 防护** | 🟡 部分合规 | 中 | 3 项问题 |
| **CSRF 防护** | 🟡 部分合规 | 中 | 2 项问题 |
| **密码加密** | ✅ 合规 | 低 | 1 项建议 |
| **速率限制** | 🔴 缺失 | **高** | 4 项问题 |
| **整体安全评分** | **65/100** | **中高风险** | - |

---

## 1️⃣ XSS/CSRF 防护审查

### ✅ 已实现的安全措施

| 措施 | 状态 | 说明 |
|------|------|------|
| React 默认转义 | ✅ | React 自动转义 JSX 输出，防止大部分 XSS |
| 无 dangerouslySetInnerHTML | ✅ | 代码审查未发现使用 |
| 安全响应头 | ✅ | `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff` |
| 邮箱输入验证 | ✅ | 注册接口使用正则验证邮箱格式 |
| NextAuth CSRF | ✅ | OAuth 流程有内置 CSRF 保护 |

### ❌ 发现的安全问题

#### 【中风险】缺少 Content-Security-Policy (CSP) 头
**位置**: `next.config.js`  
**问题**: 未配置 CSP 头，无法限制资源加载来源  
**影响**: 可能导致恶意脚本执行、数据外泄  
**修复建议**:
```javascript
// next.config.js headers()
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.minimaxi.com https://*.supabase.co; frame-ancestors 'self';"
}
```

#### 【中风险】用户输入未进行 sanitize
**位置**: `src/components/views/ChatView.tsx`, `src/app/api/chat/route.ts`  
**问题**: 用户输入的聊天内容直接发送给 AI 并渲染，未进行 sanitize  
**影响**: 可能存储恶意脚本，造成存储型 XSS  
**修复建议**:
```bash
npm install dompurify @types/dompurify
```
```typescript
// 服务端
import DOMPurify from 'dompurify';
const sanitizedMessage = DOMPurify.sanitize(message);

// 客户端 (如有富文本)
import DOMPurify from 'dompurify';
const cleanHTML = DOMPurify.sanitize(dirtyHTML);
```

#### 【中风险】/api/chat 缺少 CSRF 验证
**位置**: `src/app/api/chat/route.ts`  
**问题**: POST 接口未验证 CSRF Token  
**影响**: 可能被利用进行跨站请求伪造  
**修复建议**:
```typescript
// 使用 next-auth 的 CSRF token
import { getToken } from 'next-auth/jwt';

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ... 继续处理
}
```

#### 【低风险】缺少 Referrer-Policy 细化配置
**位置**: `next.config.js`  
**问题**: 当前配置为 `strict-origin-when-cross-origin`，建议生产环境使用 `strict-origin`  
**影响**: 可能泄露敏感 URL 信息  
**修复建议**: 生产环境改为 `strict-origin`

---

## 2️⃣ 密码加密方案审查

### ✅ 已实现的安全措施

| 措施 | 状态 | 说明 |
|------|------|------|
| bcrypt 加密 | ✅ | 使用 bcryptjs 库，10 轮 salt |
| 密码强度验证 | ✅ | 要求 8 位以上，包含字母和数字 |
| 密码哈希存储 | ✅ | 数据库存储 hash，不存明文 |
| 响应不泄露密码 | ✅ | API 返回不包含密码字段 |

**代码审查**: `src/app/api/auth/register/route.ts`
```typescript
// ✅ 正确的密码加密实现
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);
```

### ⚠️ 改进建议

#### 【低风险】密码强度检查可增强
**问题**: 当前正则未检查常见密码、未使用 zxcvbn 评估  
**建议**:
```bash
npm install zxcvbn @types/zxcvbn
```
```typescript
import zxcvbn from 'zxcvbn';

const result = zxcvbn(password);
if (result.score < 3) {
  return NextResponse.json(
    { error: '密码强度不足，请使用更复杂的密码' },
    { status: 400 }
  );
}
```

#### 【低风险】缺少密码重置流程
**问题**: 无忘记密码功能  
**建议**: 实现邮箱验证的密码重置流程

---

## 3️⃣ 速率限制实现审查

### 🔴 严重问题：完全缺失速率限制

**审计发现**:
- ❌ 未安装任何速率限制库 (upstash/ratelimit, express-rate-limit 等)
- ❌ 无 `src/middleware.ts` 文件
- ❌ API 接口无任何请求频率限制
- ❌ 登录/注册接口易受暴力破解攻击

#### 【高风险】登录/注册接口无速率限制
**位置**: `src/app/api/auth/register/route.ts`, `src/app/api/auth/[...nextauth]/route.ts`  
**影响**: 
- 暴力破解用户密码
- 大量注册垃圾账号
- 消耗数据库资源

**修复建议**:
```bash
npm install @upstash/ratelimit @upstash/redis
```
```typescript
// src/middleware.ts 或 API 路由
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 次/分钟
  analytics: true,
});

export async function POST(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: '请求过于频繁，请稍后再试' },
      { 
        status: 429,
        headers: { 'Retry-After': '60' }
      }
    );
  }
  // ... 继续处理
}
```

#### 【高风险】/api/chat 接口无速率限制
**位置**: `src/app/api/chat/route.ts`  
**影响**: 
- API 配额被快速消耗
- 可能导致高额 AI 调用费用
- DoS 攻击风险

**修复建议**: 限制每用户 5 次/小时
```typescript
const chatRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 h'),
});
```

#### 【高风险】缺少中间件层防护
**问题**: 无 `src/middleware.ts` 文件  
**建议**: 创建中间件统一处理速率限制、认证检查

---

## 4️⃣ 安全漏洞扫描

### 🔴 高危漏洞

#### 1. 环境变量暴露风险
**位置**: `.env.local`, `src/lib/ai-client.ts`, `src/lib/database.ts`  
**问题**: 
- `NEXT_PUBLIC_MINIMAX_API_KEY` 暴露在客户端
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 暴露在客户端
- 任何 `NEXT_PUBLIC_` 前缀的变量都会打包到客户端代码

**影响**: API Key 可能被提取并滥用  
**修复建议**:
```bash
# 移除 NEXT_PUBLIC_ 前缀，改为服务端变量
MINIMAX_API_KEY=xxx  # 不在客户端使用
SUPABASE_SERVICE_ROLE_KEY=xxx  # 仅服务端使用
```
```typescript
// 服务端 API 路由使用
const apiKey = process.env.MINIMAX_API_KEY; // 不带 NEXT_PUBLIC_
```

#### 2. 未认证用户可访问聊天 API
**位置**: `src/app/api/chat/route.ts`  
**问题**: 接口未检查用户会话  
**影响**: 未登录用户可调用 AI，消耗配额  
**修复建议**:
```typescript
import { getToken } from 'next-auth/jwt';

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json(
      { error: '请先登录' },
      { status: 401 }
    );
  }
  // ... 继续处理
}
```

#### 3. Supabase RLS 策略未验证
**位置**: `src/lib/database.ts`  
**问题**: 使用 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 进行数据库操作，依赖 RLS 策略  
**影响**: 如 RLS 配置不当，可能导致数据泄露  
**修复建议**:
- 审查 Supabase Dashboard 中的 RLS 策略
- 确保 `users`, `favorites`, `browse_history` 等表有正确的行级安全策略
- 敏感操作使用 `SUPABASE_SERVICE_ROLE_KEY` (服务端)

### 🟡 中危漏洞

#### 4. 缺少安全日志和监控
**问题**: 无安全事件日志 (登录失败、异常请求等)  
**建议**: 集成 Sentry 记录安全事件

#### 5. 错误信息可能泄露敏感数据
**位置**: 多个 API 路由  
**问题**: 错误响应包含实现细节  
**建议**: 生产环境使用通用错误消息

### 🟢 低危问题

#### 6. 依赖版本需定期审计
**建议**: 定期运行 `npm audit` 和 `npm outdated`

#### 7. 缺少 Permissions-Policy 头
**建议**: 添加限制浏览器功能的头
```javascript
{
  key: 'Permissions-Policy',
  value: 'camera=(), microphone=(), geolocation=(self)'
}
```

---

## 📋 修复优先级矩阵

| 优先级 | 问题 | 修复难度 | 预计时间 |
|--------|------|----------|----------|
| **P0** | 添加速率限制 (登录/注册/chat) | 中 | 2 小时 |
| **P0** | /api/chat 添加认证检查 | 低 | 30 分钟 |
| **P0** | 移除客户端 API Key 暴露 | 中 | 1 小时 |
| **P1** | 添加 CSP 头 | 低 | 30 分钟 |
| **P1** | 实现 CSRF Token 验证 | 中 | 1 小时 |
| **P1** | 添加输入 sanitize (DOMPurify) | 低 | 30 分钟 |
| **P2** | 增强密码强度检查 (zxcvbn) | 低 | 30 分钟 |
| **P2** | 添加 Permissions-Policy 头 | 低 | 15 分钟 |
| **P2** | 审查 Supabase RLS 策略 | 中 | 1 小时 |
| **P3** | 实现密码重置流程 | 中 | 2 小时 |
| **P3** | 添加安全事件日志 | 中 | 1 小时 |

---

## 🛠️ 立即行动清单

### 第一阶段 (P0 - 24 小时内)
```bash
# 1. 安装速率限制依赖
npm install @upstash/ratelimit @upstash/redis

# 2. 创建中间件
touch src/middleware.ts

# 3. 修改环境变量 (移除 NEXT_PUBLIC_ 前缀)
# 编辑 .env.local 和所有引用这些变量的文件
```

### 第二阶段 (P1 - 48 小时内)
```bash
# 1. 安装 sanitization 库
npm install dompurify @types/dompurify

# 2. 安装密码强度库
npm install zxcvbn @types/zxcvbn

# 3. 更新 next.config.js 添加 CSP 头
```

### 第三阶段 (P2 - 1 周内)
- 审查 Supabase RLS 策略
- 实现密码重置流程
- 添加安全事件日志

---

## 📈 安全评分提升路径

```
当前评分：65/100 (中高风险)

完成 P0 修复后：80/100 (中等风险)
完成 P1 修复后：90/100 (低风险)
完成 P2 修复后：95/100 (生产就绪)
```

---

## 📞 联系与支持

如有疑问或需要协助修复，请联系安全团队。

**下次审计建议**: 完成 P0/P1 修复后进行复审

---

*报告生成时间*: 2026-04-12 10:55 GMT+8  
*审计工具*: 手动代码审查 + 自动化扫描  
*审计标准*: OWASP Top 10, CWE/SANS Top 25
