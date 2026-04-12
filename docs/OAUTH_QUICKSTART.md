# 🚀 OAuth 快速入门

**5 分钟完成第三方登录配置**

---

## ⚡ 三步配置

### 1️⃣ 生成密钥 (30 秒)

```bash
openssl rand -base64 32
```

复制输出到 `.env.local`:
```env
NEXTAUTH_SECRET=复制的密钥
```

### 2️⃣ 配置 Google OAuth (2 分钟)

1. 访问 https://console.cloud.google.com/
2. 创建新项目
3. **API 和服务** → **启用 API 和服务** → 搜索 "Google+ API" → 启用
4. **凭据** → **创建凭据** → **OAuth 客户端 ID**
5. 应用类型：**Web 应用**
6. 授权的重定向 URI:
   ```
   http://localhost:3000/api/auth/callback/google  (本地开发)
   https://china-landing-ai-helper.vercel.app/api/auth/callback/google  (生产)
   ```
7. 复制 **客户端 ID** 和 **客户端密钥** 到 `.env.local`:
   ```env
   GOOGLE_CLIENT_ID=复制的 ID
   GOOGLE_CLIENT_SECRET=复制的密钥
   ```

### 3️⃣ 测试 (1 分钟)

```bash
npm run dev
```

访问 http://localhost:3000/auth/signin

点击 **使用 Google 账号登录** 按钮 ✅

---

## 📘 Facebook 配置 (可选)

1. 访问 https://developers.facebook.com/
2. **我的应用** → **创建应用** → 商务
3. 添加产品：**Facebook 登录**
4. **设置** → **基本**:
   - 添加重定向 URI: `http://localhost:3000/api/auth/callback/facebook`
5. 复制 **应用 ID** 和 **应用密钥** 到 `.env.local`:
   ```env
   FACEBOOK_CLIENT_ID=复制的 ID
   FACEBOOK_CLIENT_SECRET=复制的密钥
   ```

---

## 🎯 验证清单

- [ ] `.env.local` 包含 `NEXTAUTH_SECRET`
- [ ] `.env.local` 包含 `GOOGLE_CLIENT_ID` 和 `GOOGLE_CLIENT_SECRET`
- [ ] 开发服务器启动成功
- [ ] 访问登录页面无报错
- [ ] 点击 Google 登录能跳转到 Google 授权页
- [ ] 授权后能成功返回并登录

---

## 🐛 遇到问题？

### 常见错误:

**错误:** `NEXTAUTH_SECRET is required`  
**解决:** 运行 `openssl rand -base64 32` 生成密钥

**错误:** `redirect_uri_mismatch`  
**解决:** 检查 OAuth 控制台的重定向 URI 是否与 `.env.local` 中的 `NEXTAUTH_URL` 匹配

**错误:** `Provider not found`  
**解决:** 检查环境变量名称是否正确 (全部大写)

---

## 📚 更多文档

- 详细配置: `docs/OAUTH_SETUP.md`
- 测试指南: `docs/OAUTH_TEST_GUIDE.md`
- 状态报告: `docs/OAUTH_STATUS.md`

---

**提示:** 配置完成后，记得在生产环境 (Vercel) 也添加相同的环境变量！
