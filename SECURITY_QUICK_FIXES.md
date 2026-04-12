# 🔧 安全快速修复指南 (Security Quick Fixes)

**优先级**: P0 - 立即执行  
**预计时间**: 3-4 小时  
**影响范围**: 生产环境安全

---

## 🚀 第一步：安装安全依赖 (5 分钟)

```bash
cd products/china-landing-ai-helper/pwa

# 速率限制
npm install @upstash/ratelimit @upstash/redis

# 输入清理
npm install dompurify @types/dompurify

# 密码强度检查
npm install zxcvbn @types/zxcvbn
```

---

## 🔐 第二步：修复环境变量暴露 (30 分钟)

### 2.1 修改 `.env.local`

```bash
# 删除 NEXT_PUBLIC_ 前缀 (这些不应该暴露给客户端)
# 旧的 (删除):
# NEXT_PUBLIC_MINIMAX_API_KEY=xxx
# NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# 新的 (添加):
MINIMAX_API_KEY=your-minimax-api-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# 保留 NEXT_PUBLIC_ (这些需要客户端访问):
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_APP_URL=https://china-landing-ai-helper.vercel.app
```

### 2.2 更新 `src/lib/ai-client.ts`

```typescript
// 修改前:
const MINIMAX_API_KEY = process.env.NEXT_PUBLIC_MINIMAX_API_KEY || '';

// 修改后:
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || '';
```

### 2.3 更新 `src/lib/database.ts`

```typescript
// 修改前:
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 修改后 (服务端 API 路由使用 service role key):
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
```

---

## 🛡️ 第三步：创建中间件 (45 分钟)

### 3.1 创建 `src/middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// 初始化速率限制
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 次/分钟
  analytics: true,
});

const authRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 次/分钟 (登录/注册)
});

const chatRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 次/小时 (AI 聊天)
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 获取客户端 IP
  const ip = request.ip ?? '127.0.0.1';
  
  // 速率限制：登录/注册接口
  if (pathname.startsWith('/api/auth')) {
    const { success } = await authRatelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: '请求过于频繁，请稍后再试' },
        { 
          status: 429,
          headers: { 'Retry-After': '60' }
        }
      );
    }
  }
  
  // 速率限制：聊天接口
  if (pathname.startsWith('/api/chat')) {
    const { success } = await chatRatelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: '请求过于频繁，请稍后再试' },
        { 
          status: 429,
          headers: { 'Retry-After': '3600' }
        }
      );
    }
    
    // 检查用户认证
    const token = await getToken({ req: request });
    if (!token && pathname.startsWith('/api/chat')) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }
  }
  
  // 受保护的路由：需要登录才能访问
  const protectedRoutes = ['/profile', '/settings'];
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const token = await getToken({ req: request });
    if (!token) {
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/profile/:path*',
    '/settings/:path*',
  ],
};
```

### 3.2 配置 Upstash Redis 环境变量

在 Vercel Dashboard 添加:
```bash
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

---

## 🚫 第四步：添加 API 认证检查 (15 分钟)

### 4.1 更新 `src/app/api/chat/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { sendToAI } from '@/lib/ai-client';

export async function POST(request: NextRequest) {
  try {
    // ✅ 添加认证检查
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // ✅ 输入清理 (防止 XSS)
    const sanitizedMessage = message.trim();

    // 调用 AI
    const response = await sendToAI([
      { role: 'user', content: sanitizedMessage }
    ]);

    return NextResponse.json({
      reply: response.content,
      usage: response.usage,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
```

### 4.2 更新 `src/app/api/auth/register/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import zxcvbn from 'zxcvbn';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 }
      );
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    // ✅ 增强密码强度检查 (使用 zxcvbn)
    const passwordStrength = zxcvbn(password);
    if (passwordStrength.score < 3) {
      return NextResponse.json(
        { error: '密码强度不足，请使用更复杂的密码' },
        { status: 400 }
      );
    }

    // 检查常见密码
    const commonPasswords = ['password', '123456', 'qwerty', 'admin'];
    if (commonPasswords.includes(password.toLowerCase())) {
      return NextResponse.json(
        { error: '请不要使用常见密码' },
        { status: 400 }
      );
    }

    // ... 其余代码保持不变
```

---

## 🔒 第五步：添加 CSP 和其他安全头 (15 分钟)

### 更新 `next.config.js`

```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY', // 从 SAMEORIGIN 改为 DENY
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin', // 生产环境使用 strict-origin
        },
        // ✅ 添加 Content-Security-Policy
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.sentry.io",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: https: blob:",
            "font-src 'self' data: https://fonts.gstatic.com",
            "connect-src 'self' https://api.minimaxi.com https://*.supabase.co https://*.sentry.io",
            "frame-ancestors 'none'",
          ].join('; '),
        },
        // ✅ 添加 Permissions-Policy
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(self), payment=()',
        },
      ],
    },
  ];
},
```

---

## ✅ 第六步：验证修复 (30 分钟)

### 6.1 本地测试

```bash
# 构建并测试
npm run build
npm run start

# 测试速率限制
# 快速发送多个请求到 /api/chat，应该看到 429 错误

# 测试认证
# 未登录状态访问 /profile，应该重定向到登录页
# 未登录状态调用 /api/chat，应该返回 401 错误
```

### 6.2 安全头检查

访问 https://securityheaders.com/ 输入你的域名，检查评分

### 6.3 环境变量验证

```bash
# 确保客户端无法访问敏感变量
# 在浏览器控制台运行:
console.log(process.env.MINIMAX_API_KEY) // 应该 undefined
console.log(process.env.NEXT_PUBLIC_MINIMAX_API_KEY) // 应该不存在 (已删除)
```

---

## 📋 检查清单

完成每项后打勾:

- [ ] 安装所有安全依赖
- [ ] 修改 `.env.local` (移除 NEXT_PUBLIC_ 前缀)
- [ ] 更新 `src/lib/ai-client.ts`
- [ ] 更新 `src/lib/database.ts`
- [ ] 创建 `src/middleware.ts`
- [ ] 配置 Upstash Redis 环境变量
- [ ] 更新 `src/app/api/chat/route.ts` (添加认证)
- [ ] 更新 `src/app/api/auth/register/route.ts` (zxcvbn)
- [ ] 更新 `next.config.js` (CSP 头)
- [ ] 本地构建测试
- [ ] 部署到 Vercel 测试
- [ ] 验证速率限制生效
- [ ] 验证认证检查生效
- [ ] 使用 securityheaders.com 验证

---

## 🚨 回滚方案

如果修复导致问题:

```bash
# 1. Git 回滚
git stash  # 保存当前修改
git checkout main  # 回到主分支

# 2. Vercel 回滚
# Vercel Dashboard → Deployments → 选择上一个版本 → Promote to Production
```

---

## 📞 需要帮助？

遇到问题时检查:
1. Upstash Redis 连接是否正常
2. 环境变量是否正确配置
3. Next.js 构建日志是否有错误

---

*创建时间*: 2026-04-12  
*最后更新*: 2026-04-12  
*维护者*: 沙僧 (Security Agent)
