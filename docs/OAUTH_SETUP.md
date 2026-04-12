# 🔐 第三方登录 OAuth 配置指南

本文档说明如何配置 Google、Facebook 和 OpenAI 的 OAuth 登录。

## 📋 前置条件

1. 已安装 NextAuth.js v4: `npm install next-auth@^4`
2. 已配置 Supabase 数据库
3. 已部署应用到 Vercel (或其他 HTTPS 域名)

---

## 🎯 NextAuth.js 配置状态

✅ **已完成:**
- NextAuth.js 配置文件：`src/app/api/auth/[...nextauth]/route.ts`
- 登录页面 UI: `src/app/auth/signin/page.tsx`
- 支持 Google、Facebook、OpenAI、邮箱验证码、密码登录

⚠️ **需要配置:**
- OAuth 应用凭证 (Client ID + Secret)
- 环境变量配置
- 数据库表结构 (如果使用 Supabase Adapter)

---

## 🔧 配置步骤

### 1️⃣ 生成 NEXTAUTH_SECRET

```bash
# 在终端运行
openssl rand -base64 32
```

将生成的密钥保存到 `.env.local`:
```
NEXTAUTH_SECRET=生成的密钥
```

### 2️⃣ Google OAuth 配置

#### 步骤:
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 **Google+ API**
4. 前往 **凭据** → **创建凭据** → **OAuth 客户端 ID**
5. 应用类型选择 **Web 应用**
6. 添加授权的重定向 URI:
   ```
   https://china-landing-ai-helper.vercel.app/api/auth/callback/google
   ```
   (本地开发时添加：`http://localhost:3000/api/auth/callback/google`)
7. 复制 **客户端 ID** 和 **客户端密钥**

#### 环境变量:
```env
GOOGLE_CLIENT_ID=你的-google-client-id
GOOGLE_CLIENT_SECRET=你的-google-client-secret
```

### 3️⃣ Facebook OAuth 配置

#### 步骤:
1. 访问 [Facebook Developers](https://developers.facebook.com/)
2. 创建新应用 → 选择 **商务** 类型
3. 添加 **Facebook 登录** 产品
4. 前往 **设置** → **基本**
5. 添加有效的 **OAuth 重定向 URI**:
   ```
   https://china-landing-ai-helper.vercel.app/api/auth/callback/facebook
   ```
   (本地开发时添加：`http://localhost:3000/api/auth/callback/facebook`)
6. 复制 **应用 ID** 和 **应用密钥**

#### 环境变量:
```env
FACEBOOK_CLIENT_ID=你的-facebook-app-id
FACEBOOK_CLIENT_SECRET=你的-facebook-app-secret
```

### 4️⃣ OpenAI OAuth 配置

#### 步骤:
1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 前往 **Settings** → **Developer settings** → **OAuth**
3. 创建新的 OAuth 应用
4. 添加重定向 URI:
   ```
   https://china-landing-ai-helper.vercel.app/api/auth/callback/openai
   ```
5. 复制 **Client ID** 和 **Client Secret**

#### 环境变量:
```env
OPENAI_CLIENT_ID=你的-openai-client-id
OPENAI_CLIENT_SECRET=你的-openai-client-secret
```

### 5️⃣ Supabase 数据库配置

如果使用 NextAuth Supabase Adapter，需要创建以下表:

```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT,
  avatar TEXT,
  provider_accounts JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- NextAuth 所需表 (如果使用 adapter)
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  UNIQUE(provider, provider_account_id)
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires TIMESTAMP NOT NULL,
  PRIMARY KEY(identifier, token)
);
```

---

## 🧪 测试 OAuth 流程

### 本地开发测试:

1. 更新 `.env.local` 中的所有环境变量
2. 启动开发服务器:
   ```bash
   cd products/china-landing-ai-helper/pwa
   npm run dev
   ```
3. 访问 `http://localhost:3000/auth/signin`
4. 点击第三方登录按钮
5. 验证重定向和回调是否正常

### 生产环境测试:

1. 在 Vercel 中添加所有环境变量
2. 重新部署应用
3. 访问 `https://china-landing-ai-helper.vercel.app/auth/signin`
4. 测试各第三方登录流程

---

## 🔍 调试技巧

### 启用 NextAuth 调试模式:

在 `.env.local` 中添加:
```env
NODE_ENV=development
```

NextAuth 配置中已包含调试模式:
```typescript
debug: process.env.NODE_ENV === 'development',
```

### 查看日志:

开发服务器启动后，OAuth 流程的日志会输出到终端。

### 常见问题:

| 问题 | 解决方案 |
|------|----------|
| `NEXTAUTH_SECRET` 错误 | 运行 `openssl rand -base64 32` 生成新密钥 |
| 回调 URL 不匹配 | 检查 OAuth 提供商配置的重定向 URI |
| `provider` 未找到 | 检查 `route.ts` 中的 providers 数组 |
| 数据库连接失败 | 检查 Supabase URL 和密钥 |

---

## 📚 参考文档

- [NextAuth.js 官方文档](https://next-auth.js.org/)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login](https://developers.facebook.com/docs/facebook-login/)
- [Supabase Adapter](https://authjs.dev/getting-started/adapters/supabase)

---

## ✅ 检查清单

- [ ] 生成 NEXTAUTH_SECRET
- [ ] 配置 Google OAuth
- [ ] 配置 Facebook OAuth
- [ ] 配置 OpenAI OAuth (可选)
- [ ] 配置 Supabase 数据库
- [ ] 本地测试登录流程
- [ ] 生产环境配置
- [ ] 部署后测试

---

**最后更新:** 2026-04-12
**状态:** 🟡 配置中 (需要填写 OAuth 凭证)
