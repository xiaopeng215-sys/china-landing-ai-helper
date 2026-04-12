# 🔥 P0 核心功能实施计划

**项目**: China Landing AI Helper PWA  
**创建时间**: 2026-04-12  
**时限**: 8 小时  
**状态**: 📋 待执行

---

## 📊 当前状态分析

### ✅ 已完成的基础设施

| 模块 | 状态 | 说明 |
|------|------|------|
| **项目结构** | ✅ | Next.js 14 + TypeScript + Tailwind CSS |
| **PWA 配置** | ✅ | manifest.json, Service Worker, 离线支持 |
| **UI 组件** | ✅ | 5 个 Wanderlog 风格卡片组件 |
| **响应式布局** | ✅ | 移动优先，断点适配 |
| **NextAuth 基础** | ✅ | 配置文件已创建，支持邮箱/Google 登录 |
| **Supabase 集成** | ✅ | 数据库客户端已配置 |
| **AI 客户端** | ✅ | MiniMax API 集成，含 Mock fallback |
| **聊天 API** | ✅ | `/api/chat/route.ts` 已实现 |

### ⚠️ 需要完善的核心功能

| 模块 | 优先级 | 当前状态 | 缺失内容 |
|------|--------|----------|----------|
| **用户认证** | P0 | 🟡 部分完成 | 缺少密码登录、注册流程、中间件保护 |
| **AI 对话** | P0 | 🟡 部分完成 | 缺少真实 API Key、流式响应、会话历史 |
| **安全加固** | P0 | 🔴 未开始 | XSS 防护、CSRF Token、密码加密、速率限制 |
| **部署配置** | P0 | 🟡 部分完成 | Vercel 配置、SSL、环境变量、域名绑定 |

---

## 🎯 P0 实施计划

### 1️⃣ 用户认证系统 (预计 2 小时)

#### 目标
实现完整的注册/登录/退出流程，支持邮箱密码和 Google OAuth。

#### 任务清单

**1.1 完善 NextAuth 配置**
```typescript
// src/app/api/auth/[...nextauth]/route.ts
- [ ] 添加 CredentialsProvider (邮箱密码登录)
- [ ] 添加注册接口 /api/auth/register
- [ ] 实现 bcrypt 密码加密
- [ ] 配置 JWT 回调，存储用户 ID
```

**1.2 创建注册页面**
```typescript
// src/app/auth/signup/page.tsx
- [ ] 邮箱输入 + 验证
- [ ] 密码输入 (强度检测)
- [ ] 确认密码
- [ ] 服务条款同意
- [ ] 提交后自动登录
```

**1.3 改进登录页面**
```typescript
// src/app/auth/signin/page.tsx
- [ ] 添加密码登录表单
- [ ] 添加"忘记密码"链接
- [ ] 添加"记住我"选项
- [ ] 错误提示优化
```

**1.4 创建中间件保护**
```typescript
// src/middleware.ts
- [ ] 检查用户会话
- [ ] 重定向未授权访问
- [ ] 白名单路由 (/auth/*, /api/auth/*)
- [ ] API 路由保护
```

**1.5 完善用户资料页**
```typescript
// src/app/profile/page.tsx
- [ ] 修改密码功能
- [ ] 邮箱验证状态显示
- [ ] 账号删除选项
- [ ] 数据导出功能
```

#### 技术要点
- **密码加密**: bcryptjs (10 轮 salt)
- **会话策略**: JWT (无状态，适合 Vercel)
- **Token 有效期**: 7 天 (可刷新)
- **安全措施**: 密码强度检测、登录失败限制

---

### 2️⃣ AI 对话集成 (预计 2.5 小时)

#### 目标
实现真实的 MiniMax API 调用，支持流式响应和会话历史。

#### 任务清单

**2.1 配置 MiniMax API**
```bash
# .env.local
- [ ] NEXT_PUBLIC_MINIMAX_API_KEY=your-api-key
- [ ] MINIMAX_MODEL=MiniMax-M2.7
- [ ] MINIMAX_MAX_TOKENS=1500
```

**2.2 改进 AI 客户端**
```typescript
// src/lib/ai-client.ts
- [ ] 添加流式响应支持 (StreamingTextResponse)
- [ ] 实现会话历史管理 (message array)
- [ ] 添加错误重试机制
- [ ] 实现速率限制 (5 次/小时)
- [ ] 添加 Token 计数和用量统计
```

**2.3 改进聊天 API**
```typescript
// src/app/api/chat/route.ts
- [ ] 支持流式响应 (TextEncoderStream)
- [ ] 保存会话历史到 Supabase
- [ ] 添加用户认证检查
- [ ] 实现上下文窗口管理 (最近 10 条消息)
```

**2.4 改进前端聊天界面**
```typescript
// src/components/views/ChatView.tsx
- [ ] 流式显示 AI 回复 (打字机效果)
- [ ] 显示 Token 用量
- [ ] 添加"重新生成"按钮
- [ ] 添加"复制回复"功能
- [ ] 支持 Markdown 渲染
- [ ] 加载状态优化 (骨架屏)
```

**2.5 会话管理**
```typescript
// src/lib/session-store.ts
- [ ] 创建新会话
- [ ] 加载历史会话
- [ ] 删除会话
- [ ] 重命名会话
- [ ] 会话列表展示
```

#### 技术要点
- **流式响应**: Vercel AI SDK 或原生 Fetch + Reader
- **会话存储**: Supabase `chat_sessions` 和 `messages` 表
- **错误处理**: 降级到 Mock 回复，提示用户
- **性能优化**: 消息分页加载，虚拟滚动

---

### 3️⃣ 安全加固 (预计 2 小时)

#### 目标
实现全面的安全防护措施，符合生产环境标准。

#### 任务清单

**3.1 XSS 防护**
```typescript
// src/middleware.ts + 组件
- [ ] 设置 Content-Security-Policy 头
- [ ] 所有用户输入进行 sanitize (DOMPurify)
- [ ] 禁用 dangerouslySetInnerHTML (除非必要)
- [ ] 输出编码 (React 默认已做)
```

**3.2 CSRF 防护**
```typescript
// src/lib/csrf.ts
- [ ] 生成 CSRF Token (每会话)
- [ ] 在所有表单中添加 CSRF Token
- [ ] API 路由验证 CSRF Token
- [ ] SameSite Cookie 设置 (Strict)
```

**3.3 密码安全**
```typescript
// src/lib/auth.ts
- [ ] bcrypt 加密 (10 轮 salt)
- [ ] 密码强度检测 (zxcvbn)
- [ ] 禁止常见密码
- [ ] 密码重置流程 (邮箱验证)
```

**3.4 速率限制**
```typescript
// src/middleware.ts
- [ ] 基于 IP 的速率限制 (upstash/ratelimit)
- [ ] 登录接口：5 次/分钟
- [ ] AI 接口：5 次/小时
- [ ] 注册接口：3 次/小时
- [ ] 返回 Retry-After 头
```

**3.5 其他安全措施**
```typescript
// src/middleware.ts
- [ ] HSTS 头 (强制 HTTPS)
- [ ] X-Frame-Options (DENY)
- [ ] X-Content-Type-Options (nosniff)
- [ ] Referrer-Policy (strict-origin-when-cross-origin)
- [ ] Permissions-Policy (限制浏览器功能)
```

**3.6 敏感数据保护**
```typescript
// .env.local
- [ ] 环境变量加密存储 (Vercel Encrypted Env)
- [ ] 禁止在客户端暴露敏感变量
- [ ] API Key 轮换机制
- [ ] 数据库连接池配置
```

#### 技术要点
- **CSP**: `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; ...`
- **速率限制**: upstash/ratelimit (Redis-based, serverless-friendly)
- **密码库**: bcryptjs + zxcvbn
- ** sanitization**: DOMPurify (客户端), validator (服务端)

---

### 4️⃣ 部署配置 (预计 1.5 小时)

#### 目标
完成 Vercel 部署配置，启用 SSL 和自定义域名。

#### 任务清单

**4.1 Vercel 项目配置**
```json
// vercel.json
- [ ] 配置项目名称：china-landing-ai-helper
- [ ] 配置构建命令：npm run build
- [ ] 配置输出目录：.next
- [ ] 配置环境变量 (生产环境)
- [ ] 配置预览部署 (Pull Request)
```

**4.2 环境变量配置**
```bash
# Vercel Dashboard → Settings → Environment Variables
- [ ] NEXTAUTH_URL=https://your-domain.com
- [ ] NEXTAUTH_SECRET=<生成随机密钥>
- [ ] NEXT_PUBLIC_MINIMAX_API_KEY=<API Key>
- [ ] NEXT_PUBLIC_SUPABASE_URL=<URL>
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY=<Key>
- [ ] SENTRY_DSN=<DSN>
- [ ] UPSTASH_REDIS_REST_URL=<URL> (速率限制)
- [ ] UPSTASH_REDIS_REST_TOKEN=<Token>
```

**4.3 自定义域名**
```bash
# Vercel Dashboard → Domains
- [ ] 添加域名：chinalanding.ai (示例)
- [ ] 配置 DNS (CNAME → cname.vercel-dns.com)
- [ ] 启用自动 SSL (Vercel 自动管理)
- [ ] 配置 www 重定向
```

**4.4 生产构建优化**
```javascript
// next.config.js
- [ ] 启用压缩 (compression)
- [ ] 配置图片优化 (next/image)
- [ ] 启用静态导出 (可选)
- [ ] 配置 Sentry 源映射
- [ ] 禁用开发工具 (devtools)
```

**4.5 监控和日志**
```typescript
// src/lib/monitoring.ts
- [ ] 配置 Sentry 错误追踪
- [ ] 配置 Vercel Analytics
- [ ] 配置性能监控 (FCP, LCP, TTI)
- [ ] 配置错误告警 (邮件/Slack)
```

**4.6 部署流程**
```bash
# 本地测试
- [ ] npm run build (验证构建)
- [ ] npm run lint (代码检查)
- [ ] npm run test (单元测试)
- [ ] Vercel CLI: vercel --prod

# CI/CD (GitHub Actions)
- [ ] 自动部署 (main 分支)
- [ ] 预览部署 (PR 分支)
- [ ] 部署通知 (Slack/邮件)
```

#### 技术要点
- **SSL**: Vercel 自动提供 Let's Encrypt 证书
- **CDN**: Vercel Edge Network (全球加速)
- **缓存策略**: 静态资源 1 年，HTML 不缓存
- **回滚**: Vercel 支持一键回滚到历史版本

---

## 📋 实施顺序

```
1. 用户认证系统 (2h) → 2. AI 对话集成 (2.5h) → 3. 安全加固 (2h) → 4. 部署配置 (1.5h)
```

**关键路径**: 认证 → AI → 安全 → 部署

**依赖关系**:
- AI 对话依赖用户认证 (保存会话历史)
- 安全加固贯穿所有模块
- 部署配置依赖前三者完成

---

## 🛠️ 技术栈

| 类别 | 技术选型 | 说明 |
|------|----------|------|
| **框架** | Next.js 14 | App Router, Server Components |
| **认证** | NextAuth.js v4 | Credentials + Google OAuth |
| **数据库** | Supabase | PostgreSQL, 实时订阅 |
| **AI** | MiniMax-M2.7 | 中文优化，低成本 |
| **加密** | bcryptjs | 密码哈希 |
| **速率限制** | upstash/ratelimit | Redis, serverless |
| **部署** | Vercel | 自动 SSL, CDN |
| **监控** | Sentry | 错误追踪，性能监控 |

---

## ⚠️ 风险矩阵

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| MiniMax API 不可用 | 中 | 高 | Mock fallback, 多 provider 切换 |
| Supabase 连接失败 | 低 | 高 | 本地缓存，降级到 localStorage |
| Vercel 部署失败 | 低 | 中 | 本地构建测试，回滚机制 |
| 安全漏洞 | 中 | 高 | 代码审查，自动化扫描 |
| 环境变量泄露 | 低 | 高 | Vercel 加密存储，权限控制 |

---

## 📝 验收标准

### 用户认证
- [ ] 用户可以注册账号 (邮箱 + 密码)
- [ ] 用户可以登录 (邮箱密码 / Google)
- [ ] 用户可以退出登录
- [ ] 受保护路由重定向到登录页
- [ ] 密码加密存储

### AI 对话
- [ ] 真实 MiniMax API 调用成功
- [ ] 流式响应显示正常
- [ ] 会话历史保存到数据库
- [ ] 错误时降级到 Mock 回复
- [ ] Token 用量显示正确

### 安全加固
- [ ] CSP 头配置正确
- [ ] CSRF Token 验证通过
- [ ] 速率限制生效
- [ ] 密码强度检测工作
- [ ] 安全扫描无高危漏洞

### 部署配置
- [ ] Vercel 构建成功
- [ ] 自定义域名绑定
- [ ] SSL 证书生效
- [ ] 环境变量配置正确
- [ ] 监控告警配置完成

---

## 🚀 下一步行动

1. **立即执行**: 配置 MiniMax API Key 和 Supabase 凭证
2. **第一优先级**: 完成用户认证系统 (登录/注册)
3. **第二优先级**: 实现 AI 流式响应
4. **第三优先级**: 添加安全防护措施
5. **最后**: Vercel 部署和域名配置

---

**文档维护**: 完成每个任务后更新状态，记录遇到的问题和解决方案。

**联系方式**: 有问题请联系开发团队或查阅文档。
