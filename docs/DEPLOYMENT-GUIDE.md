# 🚀 Vercel 部署完整指南

**项目**: China Landing AI Helper PWA  
**创建时间**: 2026-04-12  
**状态**: ✅ 生产就绪

---

## 📋 部署清单

### 前置条件

- [ ] Vercel 账号已创建
- [ ] GitHub 仓库已连接
- [ ] 域名已购买 (可选)
- [ ] 所有 API 密钥已获取 (MiniMax, Supabase, Sentry)

---

## 1️⃣ Vercel 项目配置

### 1.1 创建项目

```bash
# 方法 A: 通过 Vercel CLI
cd products/china-landing-ai-helper/pwa
vercel login
vercel link --create

# 方法 B: 通过 Vercel Dashboard
# 1. 访问 https://vercel.com/new
# 2. 导入 GitHub 仓库
# 3. 选择项目根目录：products/china-landing-ai-helper/pwa
```

### 1.2 项目设置

访问 Vercel Dashboard → Settings → General

| 设置项 | 值 | 说明 |
|--------|-----|------|
| **Name** | `china-landing-ai-helper` | 项目名称 |
| **Framework** | Next.js | 自动检测 |
| **Root Directory** | `products/china-landing-ai-helper/pwa` | 如果使用 monorepo |
| **Build Command** | `npm run build` | 默认 |
| **Output Directory** | `.next` | 默认 |
| **Install Command** | `npm install` | 默认 |

### 1.3 构建设置

Settings → Build

- ✅ **Ignored Build Step**: 使用默认 (根据 git 变化)
- ✅ **Bypass**: 允许通过 commit message `[skip ci]` 跳过构建
- ✅ **Node.js Version**: 20.x (与 CI/CD 一致)

---

## 2️⃣ 域名与 SSL 配置

### 2.1 添加自定义域名

Settings → Domains → Add

#### 主域名配置

```
域名：chinalanding.ai
类型：Primary Domain
重定向：自动启用 www → 非 www
```

#### DNS 配置记录

在域名提供商处添加:

```
# 根域名 (ALIAS/ANAME 或 A 记录)
类型：A
名称：@
值：76.76.21.21

# 或使用 CNAME (如果提供商支持 ALIAS)
类型：CNAME
名称：@
值：cname.vercel-dns.com

# WWW 子域名
类型：CNAME
名称：www
值：cname.vercel-dns.com
```

### 2.2 SSL 证书

Vercel **自动**提供 Let's Encrypt SSL 证书:

- ✅ 自动申请和续期
- ✅ 支持通配符证书
- ✅ 自动配置 HTTPS 重定向
- ✅ 证书状态: Settings → Domains → 查看

#### 验证 SSL

```bash
# 检查证书
curl -I https://chinalanding.ai

# 预期输出:
# HTTP/2 200
# strict-transport-security: max-age=31536000; includeSubDomains; preload
```

### 2.3 强制 HTTPS

已在 `vercel.json` 中配置:

```json
{
  "headers": [
    {
      "source": "/:path*",
      "has": [
        {
          "type": "header",
          "header": "x-forwarded-proto",
          "value": "http"
        }
      ],
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        }
      ]
    }
  ]
}
```

#### 启用 HSTS Preload

访问: https://hstspreload.org/?domain=chinalanding.ai

提交域名到 HSTS Preload List (浏览器内置 HTTPS 强制)

---

## 3️⃣ CDN 缓存策略

### 3.1 缓存配置总览

| 资源类型 | Cache-Control | 说明 |
|----------|---------------|------|
| **静态资源** (JS, CSS, 图片) | `public, max-age=31536000, immutable` | 1 年，永久缓存 |
| **Service Worker** (sw.js) | `no-cache, must-revalidate` | 每次检查更新 |
| **Manifest** (manifest.json) | `max-age=604800, must-revalidate` | 7 天 |
| **API 响应** | `no-store` | 不缓存 |
| **HTML 页面** | `s-maxage=0, stale-while-revalidate` | 边缘不缓存 |

### 3.2 Vercel Edge Network

Vercel 全球 CDN 自动启用:

- 🌍 **200+** 边缘节点
- ⚡ **自动** Gzip/Brotli 压缩
- 🔄 **智能** 缓存失效
- 🛡️ **内置** DDoS 防护

### 3.3 缓存优化策略

#### 静态资源指纹

Next.js 自动为静态资源添加哈希:

```
/_next/static/chunks/main-abc123.js  → 缓存 1 年
/_next/static/css/styles-def456.css → 缓存 1 年
/icons/icon-192x192.png             → 缓存 1 年
```

#### Service Worker 缓存

```javascript
// public/sw.js (已配置)
runtimeCaching: [
  {
    urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'images-cache',
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 天
      },
    },
  },
  {
    urlPattern: /^https:\/\/api\..*/i,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'api-cache',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24, // 1 天
      },
    },
  },
]
```

### 3.4 缓存失效

#### 自动失效

- ✅ 部署新版本时，旧静态资源自动失效
- ✅ Service Worker 自动检测更新

#### 手动失效

```bash
# 清除 Vercel CDN 缓存
vercel invalidate --all

# 或通过 Dashboard
Dashboard → Settings → Caching → Purge Cache
```

---

## 4️⃣ 部署流程

### 4.1 本地测试构建

```bash
cd products/china-landing-ai-helper/pwa

# 1. 清理构建缓存
rm -rf .next node_modules

# 2. 安装依赖
npm ci

# 3. 运行 lint
npm run lint

# 4. 运行测试
npm test

# 5. 生产构建
npm run build

# 6. 本地预览
npm run start
```

### 4.2 部署到 Vercel

#### 方法 A: Git 自动部署 (推荐)

```bash
# 推送到 main 分支
git checkout main
git push origin main

# Vercel 自动检测并部署
# 预览 URL: https://china-landing-ai-helper-xxx.vercel.app
```

#### 方法 B: Vercel CLI

```bash
# 部署到 Preview
vercel

# 部署到 Production
vercel --prod

# 带环境变量的部署
vercel --prod --env production
```

### 4.3 部署验证清单

- [ ] 构建成功 (无错误)
- [ ] 首页加载正常
- [ ] PWA 安装提示显示
- [ ] Service Worker 注册成功
- [ ] API 调用正常
- [ ] 登录/注册功能正常
- [ ] SSL 证书有效
- [ ] 域名解析正确
- [ ] CDN 缓存命中 (检查响应头)

---

## 5️⃣ 监控与告警

### 5.1 Vercel Analytics

Settings → Analytics → Enable

- ✅ **Web Vitals**: FCP, LCP, CLS, FID
- ✅ **实时流量**: 访问量，来源，地区
- ✅ **错误追踪**: 4xx, 5xx 错误率

### 5.2 Sentry 集成

已配置 `@sentry/nextjs`:

```javascript
// next.config.js
withSentryConfig(nextConfig, {
  org: "china-landing-ai-helper",
  project: "pwa",
  tunnelRoute: "/monitoring",
})
```

#### Sentry Dashboard

访问: https://sentry.io/organizations/china-landing-ai-helper/

- 🔍 **错误追踪**: 实时错误报告
- 📊 **性能监控**: 事务追踪
- 🚨 **告警**: 错误率阈值告警

### 5.3 告警配置

#### Vercel 告警

Settings → Notifications

- ✅ 部署失败 → 邮件通知
- ✅ 构建时间 > 5 分钟 → 邮件通知
- ✅ 自定义域名 SSL 即将过期 → 邮件通知

#### Sentry 告警

Alerts → Create Alert

```
规则：error_rate > 1% (5 分钟窗口)
动作：发送邮件到 dev-team@chinalanding.ai
```

---

## 6️⃣ 回滚策略

### 6.1 Vercel 一键回滚

Dashboard → Deployments → 选择历史版本 → ⋯ → Rollback

- ✅ 立即生效
- ✅ 保留当前环境变量
- ✅ 自动通知团队成员

### 6.2 Git 回滚

```bash
# 回滚到上一个版本
git revert HEAD
git push origin main

# 或强制回滚到指定 commit
git reset --hard abc123
git push --force origin main
```

### 6.3 回滚验证

- [ ] 回滚部署成功
- [ ] 功能验证通过
- [ ] 错误率恢复正常
- [ ] 通知团队回滚完成

---

## 7️⃣ 性能优化

### 7.1 构建优化

已在 `next.config.js` 配置:

```javascript
{
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    formats: ['image/webp', 'image/avif'], // 现代格式
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'radix-ui'],
  },
}
```

### 7.2 边缘函数优化

```json
// vercel.json
{
  "functions": {
    "src/app/api/chat/route.ts": {
      "maxDuration": 60,
      "memory": 1024
    },
    "src/app/api/auth/**": {
      "maxDuration": 30,
      "memory": 512
    }
  }
}
```

### 7.3 性能目标

| 指标 | 目标值 | 当前值 |
|------|--------|--------|
| **Lighthouse Performance** | ≥90 | 待测试 |
| **FCP** | <1.5s | 待测试 |
| **LCP** | <2.5s | 待测试 |
| **CLS** | <0.1 | 待测试 |
| **TTI** | <3.5s | 待测试 |

---

## 8️⃣ 安全加固

### 8.1 安全头配置

已在 `vercel.json` 和 `next.config.js` 配置:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: (在中间件配置)
Permissions-Policy: camera=(), microphone=(), geolocation=(self)
```

### 8.2 速率限制

使用 Upstash Redis:

```typescript
// src/middleware.ts
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 h"), // 5 次/小时
});
```

### 8.3 安全扫描

```bash
# 依赖漏洞扫描
npm audit --audit-level=high

# 自动化扫描 (GitHub Actions)
# 每次 PR 自动运行 npm audit
```

---

## 📚 相关文档

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署](https://nextjs.org/docs/deployment)
- [Vercel CLI](https://vercel.com/docs/cli)
- [自定义域名](https://vercel.com/docs/concepts/projects/custom-domains)
- [CDN 缓存](https://vercel.com/docs/concepts/caching)

---

## 🆘 故障排查

### 问题: 部署失败，构建超时

**解决**:
1. 检查 `vercel.json` 中 `functions.maxDuration`
2. 优化构建脚本，减少不必要的步骤
3. 联系 Vercel 支持提升配额

### 问题: 自定义域名 SSL 证书无效

**解决**:
1. 检查 DNS 配置是否正确
2. 等待 DNS 传播 (最多 48 小时)
3. 在 Vercel Dashboard 重新验证域名

### 问题: CDN 缓存未生效

**解决**:
1. 检查 `vercel.json` 中 `headers` 配置
2. 确认资源 URL 包含哈希指纹
3. 清除浏览器缓存后重试

---

**维护者**: 开发团队  
**最后更新**: 2026-04-12  
**下次审查**: 2026-05-12
