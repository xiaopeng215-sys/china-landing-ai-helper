# 🚀 快速开始指南

**China Landing AI Helper - 用户认证系统**

---

## 📦 1. 环境配置

### 1.1 复制环境变量文件
```bash
cp .env.example .env.local
```

### 1.2 配置必要的环境变量

**必须配置** (本地开发最低要求):

```bash
# NextAuth 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=运行：openssl rand -base64 32

# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# MiniMax AI 配置
NEXT_PUBLIC_MINIMAX_API_KEY=your-minimax-api-key
```

**可选配置** (完整功能):

```bash
# Google OAuth (如需要 Google 登录)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# 邮箱服务 (如需要邮箱验证码登录)
EMAIL_SERVER=smtp://user:pass@smtp.example.com:587
EMAIL_FROM=noreply@example.com
```

---

## 🗄️ 2. 数据库设置

### 2.1 创建 Supabase 项目

1. 访问 https://supabase.com/
2. 创建新项目
3. 等待项目初始化完成

### 2.2 运行数据库迁移

1. 进入 Supabase SQL Editor
2. 复制 `docs/supabase-schema.sql` 的全部内容
3. 执行 SQL 创建所有表和策略

### 2.3 获取数据库凭证

在 Supabase 项目设置中获取：
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **Anon Public Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Service Role Key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ 保密)

---

## 🔑 3. 获取 API Keys

### 3.1 MiniMax API Key

1. 访问 https://platform.minimaxi.com/
2. 注册/登录账号
3. 进入 API 控制台
4. 创建 API Key
5. 复制到 `NEXT_PUBLIC_MINIMAX_API_KEY`

### 3.2 Google OAuth (可选)

1. 访问 https://console.cloud.google.com/
2. 创建新项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 凭证
5. 添加授权重定向 URI:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
6. 复制 Client ID 和 Secret 到环境变量

### 3.3 邮箱服务 (可选)

**使用 SendGrid**:

1. 注册 https://sendgrid.com/
2. 创建 API Key
3. 验证发件人邮箱
4. 配置环境变量:
   ```bash
   EMAIL_SERVER=smtp://apikey:YOUR_SENDGRID_KEY@smtp.sendgrid.net:587
   EMAIL_FROM=your-verified@email.com
   ```

---

## 🏃 4. 运行项目

### 4.1 安装依赖
```bash
npm install
```

### 4.2 启动开发服务器
```bash
npm run dev
```

### 4.3 访问应用
打开浏览器访问：http://localhost:3000

---

## 🧪 5. 测试功能

### 5.1 注册账号

1. 访问 http://localhost:3000/auth/signup
2. 填写：
   - 昵称：Test User
   - 邮箱：test@example.com
   - 密码：Test1234 (至少 8 位，包含字母和数字)
   - 确认密码：Test1234
   - 勾选"同意服务条款"
3. 点击"创建账号"
4. 应该自动登录并跳转到首页

### 5.2 登录

1. 访问 http://localhost:3000/auth/signin
2. 选择"密码登录"
3. 输入邮箱和密码
4. 点击"登录"
5. 应该跳转到首页

### 5.3 AI 对话

1. 访问 http://localhost:3000 (或点击聊天图标)
2. 发送消息："帮我规划上海 4 天行程"
3. 等待 AI 回复
4. 验证消息是否保存
5. 刷新页面，验证历史消息是否加载

### 5.4 会话管理

1. 点击侧边栏菜单 (左上角)
2. 查看会话列表
3. 点击"新对话"创建新会话
4. 切换历史会话
5. 验证消息历史正确加载

---

## 🔧 6. 常见问题

### Q: 注册失败，提示"数据库未配置"
**A**: 检查 `.env.local` 中的 Supabase 配置是否正确：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Q: 登录失败，提示"用户不存在"
**A**: 确保先注册账号，或者检查邮箱是否输入正确。

### Q: AI 回复是 Mock 内容
**A**: 检查 `NEXT_PUBLIC_MINIMAX_API_KEY` 是否配置，未配置时会降级到 Mock 回复。

### Q: 无法访问受保护的路由
**A**: 确保已登录。未登录访问 `/chat` 等页面会自动重定向到登录页。

### Q: 构建时出现 ESLint 错误
**A**: 这是已知的 ESLint 配置问题，不影响功能。可以暂时忽略或运行：
```bash
npm run build -- --no-lint
```

---

## 📱 7. 移动端测试

### 7.1 本地网络访问

1. 查看本机 IP 地址:
   ```bash
   # macOS
   ipconfig getifaddr en0
   
   # Windows
   ipconfig
   ```

2. 修改 `.env.local`:
   ```bash
   NEXTAUTH_URL=http://YOUR-IP:3000
   ```

3. 重启开发服务器

4. 在手机浏览器访问：`http://YOUR-IP:3000`

### 7.2 PWA 安装

1. 在手机浏览器访问应用
2. 点击"添加到主屏幕"
3. 确认安装
4. 应用会像原生 App 一样显示在主屏幕

---

## 🚀 8. 部署到 Vercel

### 8.1 准备工作

1. 安装 Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. 登录 Vercel:
   ```bash
   vercel login
   ```

### 8.2 配置环境变量

在 Vercel 项目设置中添加所有环境变量：
- `NEXTAUTH_URL` → `https://your-project.vercel.app`
- `NEXTAUTH_SECRET` → 新的随机密钥
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_MINIMAX_API_KEY`
- 其他可选配置...

### 8.3 部署

```bash
# 预览部署
vercel

# 生产部署
vercel --prod
```

### 8.4 更新回调 URL

部署后，更新以下配置：

**Google OAuth**:
```
https://your-project.vercel.app/api/auth/callback/google
```

**邮箱服务**:
更新 `EMAIL_FROM` 为生产域名

---

## 📞 9. 获取帮助

### 文档
- [NextAuth.js 文档](https://next-auth.js.org/)
- [Supabase 文档](https://supabase.com/docs)
- [MiniMax 文档](https://platform.minimaxi.com/docs)

### 日志查看

**开发环境**:
```bash
# 查看 Next.js 日志
npm run dev

# 查看 Supabase 日志
# 在 Supabase Dashboard → Logs
```

**生产环境**:
```bash
# Vercel 日志
vercel logs your-project-id

# Sentry 错误报告
# 访问你的 Sentry 项目 dashboard
```

---

## ✅ 10. 检查清单

部署前确认：

- [ ] 所有环境变量已配置
- [ ] Supabase 数据库表已创建
- [ ] MiniMax API Key 已配置
- [ ] Google OAuth 已配置 (如使用)
- [ ] 邮箱服务已配置 (如使用)
- [ ] 本地测试通过
- [ ] 移动端测试通过
- [ ] 生产环境变量已更新
- [ ] 域名已绑定 (如使用自定义域名)

---

**祝部署顺利！🎉**

如有问题，请查看 `AUTH-IMPLEMENTATION-REPORT.md` 获取详细文档。
