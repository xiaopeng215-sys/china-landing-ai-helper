# 🔐 环境变量配置指南

**项目**: China Landing AI Helper PWA  
**最后更新**: 2026-04-12  
**状态**: ✅ 生产就绪

---

## 📋 环境变量清单

### 必需变量 (生产环境)

| 变量名 | 类型 | 说明 | 加密 |
|--------|------|------|------|
| `NEXTAUTH_URL` | Runtime | 生产环境 URL | ❌ |
| `NEXTAUTH_SECRET` | Runtime | JWT 签名密钥 (32 字节随机) | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Build + Runtime | Supabase 项目 URL | ❌ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Build + Runtime | Supabase 匿名密钥 | ✅ |
| `NEXT_PUBLIC_MINIMAX_API_KEY` | Runtime | MiniMax AI API 密钥 | ✅ |
| `NEXT_PUBLIC_SENTRY_DSN` | Build + Runtime | Sentry DSN | ❌ |
| `SENTRY_AUTH_TOKEN` | Build | Sentry 源映射上传 | ✅ |
| `VERCEL_ORG_ID` | Build | Vercel 组织 ID | ❌ |
| `VERCEL_PROJECT_ID` | Build | Vercel 项目 ID | ❌ |

### 可选变量

| 变量名 | 类型 | 说明 | 默认值 |
|--------|------|------|--------|
| `UPSTASH_REDIS_REST_URL` | Runtime | Redis URL (速率限制) | - |
| `UPSTASH_REDIS_REST_TOKEN` | Runtime | Redis Token | - |
| `NEXT_PUBLIC_APP_URL` | Build | 应用 URL (用于 PWA) | `NEXTAUTH_URL` |
| `NEXT_PUBLIC_APP_NAME` | Build | 应用名称 | `China Landing AI Helper` |
| `NEXT_PUBLIC_SENTRY_RELEASE` | Build | Sentry 版本号 | `1.0.0-beta` |
| `DISABLE_SENTRY_SERVER_PLUGIN` | Build | 禁用服务端 Sentry | `false` |
| `DISABLE_SENTRY_CLIENT_PLUGIN` | Build | 禁用客户端 Sentry | `false` |
| `ANALYZE` | Build | 启用 bundle 分析 | `false` |

---

## 🔧 Vercel 配置步骤

### 1. 生成 NEXTAUTH_SECRET

```bash
# 在终端执行
openssl rand -base64 32
```

示例输出: `your-secret-key-here-replace-this`

### 2. Vercel Dashboard 配置

访问: https://vercel.com/dashboard → 选择项目 → Settings → Environment Variables

#### Production 环境变量

```bash
# 认证
NEXTAUTH_URL=https://chinalanding.ai
NEXTAUTH_SECRET=<从上面生成的密钥>

# 数据库
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<你的 Supabase 匿名密钥>

# AI
NEXT_PUBLIC_MINIMAX_API_KEY=<你的 MiniMax API 密钥>

# 监控
NEXT_PUBLIC_SENTRY_DSN=https://429149bf2ffdb770adada90a98d5f25d@o4511198667931648.ingest.us.sentry.io/4511199238029312
SENTRY_AUTH_TOKEN=<你的 Sentry Token>

# Vercel (用于 CI/CD)
VERCEL_ORG_ID=<你的组织 ID>
VERCEL_PROJECT_ID=<你的项目 ID>

# 速率限制 (可选)
UPSTASH_REDIS_REST_URL=https://<your-redis>.upstash.io
UPSTASH_REDIS_REST_TOKEN=<你的 Redis Token>
```

#### Preview 环境变量

复制 Production 配置，但修改:
- `NEXTAUTH_URL`: 使用 Vercel preview 域名 (自动注入)
- 其他变量可与 Production 共享

#### Development 环境变量

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=localhost-secret-key-for-development-only
# 其他变量可与 Production 相同
```

### 3. 通过 Vercel CLI 配置

```bash
# 登录 Vercel
vercel login

# 进入项目目录
cd products/china-landing-ai-helper/pwa

# 关联现有项目
vercel link

# 拉取环境变量
vercel env pull

# 逐个添加环境变量
vercel env add NEXTAUTH_URL production https://chinalanding.ai
vercel env add NEXTAUTH_SECRET production <生成的密钥>
# ... 重复添加其他变量
```

### 4. 通过 GitHub Secrets 配置 (用于 CI/CD)

访问: https://github.com/<org>/china-landing-ai-helper/settings/secrets/actions

添加以下 Secrets:
- `VERCEL_TOKEN`: Vercel API Token
- `VERCEL_ORG_ID`: Vercel 组织 ID
- `VERCEL_PROJECT_ID`: Vercel 项目 ID
- `SENTRY_AUTH_TOKEN`: Sentry Token
- `SUPABASE_URL`: Supabase URL
- `SUPABASE_ANON_KEY`: Supabase 匿名密钥
- `MINIMAX_API_KEY`: MiniMax API 密钥

---

## 🛡️ 安全最佳实践

### 1. 敏感变量加密

在 Vercel Dashboard 中，以下变量应标记为 **"Sensitive"** (加密存储):
- ✅ `NEXTAUTH_SECRET`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `NEXT_PUBLIC_MINIMAX_API_KEY`
- ✅ `SENTRY_AUTH_TOKEN`
- ✅ `UPSTASH_REDIS_REST_TOKEN`

### 2. 变量作用域

| 变量 | Production | Preview | Development |
|------|------------|---------|-------------|
| `NEXTAUTH_URL` | ✅ | ✅ | ✅ |
| `NEXTAUTH_SECRET` | ✅ | ✅ | ✅ |
| `NEXT_PUBLIC_*` | ✅ | ✅ | ✅ |
| `SENTRY_AUTH_TOKEN` | ✅ | ❌ | ❌ |

### 3. 禁止行为

- ❌ **不要**将 `.env.local` 提交到 Git (已在 `.gitignore` 中)
- ❌ **不要**在客户端代码中暴露 `SENTRY_AUTH_TOKEN` 等后端密钥
- ❌ **不要**在生产环境使用开发密钥
- ❌ **不要**在日志中打印敏感变量

---

## 🔄 环境变量轮换

### MiniMax API Key 轮换

1. 在 Vercel Dashboard 创建新密钥
2. 更新环境变量 `NEXT_PUBLIC_MINIMAX_API_KEY`
3. 重新部署: `vercel --prod`
4. 验证功能正常后删除旧密钥

### NEXTAUTH_SECRET 轮换

⚠️ **警告**: 更改此密钥会使所有现有会话失效!

1. 生成新密钥
2. 提前 24 小时通知用户即将登出
3. 更新环境变量
4. 重新部署

---

## 📝 本地开发配置

### .env.local 模板

```bash
# 认证
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=localhost-dev-secret-change-in-production

# 数据库
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# AI
NEXT_PUBLIC_MINIMAX_API_KEY=your-minimax-api-key

# 监控
NEXT_PUBLIC_SENTRY_DSN=https://429149bf2ffdb770adada90a98d5f25d@o4511198667931648.ingest.us.sentry.io/4511199238029312

# 应用
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="China Landing AI Helper (Dev)"
NEXT_PUBLIC_SENTRY_RELEASE=dev

# 调试
ANALYZE=false
DISABLE_SENTRY_SERVER_PLUGIN=false
DISABLE_SENTRY_CLIENT_PLUGIN=false
```

### 快速设置脚本

```bash
#!/bin/bash
# scripts/setup-env.sh

cp .env.example .env.local

echo "🔐 生成 NEXTAUTH_SECRET..."
SECRET=$(openssl rand -base64 32)
sed -i.bak "s/NEXTAUTH_SECRET=.*/NEXTAUTH_SECRET=$SECRET/" .env.local
rm .env.local.bak

echo "✅ 本地环境配置完成!"
echo "⚠️  请手动编辑 .env.local 填入实际的 API 密钥"
```

---

## 🚨 故障排查

### 问题: 构建失败，提示缺少环境变量

```bash
> Build error occurred
> Error: Missing environment variable: NEXT_PUBLIC_SUPABASE_URL
```

**解决**:
1. 检查 Vercel Dashboard → Settings → Environment Variables
2. 确认变量已添加到 **Production** 环境
3. 重新触发部署

### 问题: 登录失败，JWT 验证错误

**可能原因**: `NEXTAUTH_SECRET` 不正确或已更改

**解决**:
1. 确认 `NEXTAUTH_SECRET` 在所有环境一致
2. 清除浏览器 Cookie
3. 重新登录

### 问题: API 调用失败，401 Unauthorized

**可能原因**: `NEXT_PUBLIC_MINIMAX_API_KEY` 无效或过期

**解决**:
1. 在 MiniMax Dashboard 验证 API Key 状态
2. 更新 Vercel 环境变量
3. 重新部署

---

## 📚 相关文档

- [Vercel 环境变量文档](https://vercel.com/docs/concepts/projects/environment-variables)
- [NextAuth.js 配置](https://next-auth.js.org/configuration/options)
- [Sentry Next.js 集成](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Supabase 认证](https://supabase.com/docs/guides/auth)

---

**维护者**: 开发团队  
**最后审查**: 2026-04-12
