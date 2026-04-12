# 🔐 Supabase 环境变量配置报告

**项目**: China Landing AI Helper PWA  
**执行时间**: 2026-04-12 19:50-19:55  
**执行者**: 沙僧 🐚  
**状态**: ⚠️ 等待提供密钥

---

## ✅ 已完成配置

| 变量名 | 配置值 | 状态 |
|--------|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://jsuqbaumrrrgexfdvras.supabase.co` | ✅ 已更新 |
| `NEXTAUTH_URL` | `https://china-landing-ai-helper.vercel.app` | ✅ 已配置 |
| `NEXTAUTH_SECRET` | (已加密存储) | ✅ 已配置 |

---

## ⚠️ 待配置变量 (需要老板提供)

### 从 Supabase Dashboard 获取密钥

**访问地址**: https://app.supabase.com/project/jsuqbaumrrrgexfdvras/settings/api

需要复制以下两个密钥：

| 变量名 | 说明 | 安全级别 |
|--------|------|----------|
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 匿名公钥 (可暴露给客户端) | 🔓 公开 |
| `SUPABASE_SERVICE_ROLE_KEY` | 服务角色密钥 (⚠️ 绝密) | 🔒 绝密 |

### 获取步骤

1. 访问 https://app.supabase.com/
2. 登录并选择项目 `jsuqbaumrrrgexfdvras`
3. 点击左侧 **Settings** (设置)
4. 选择 **API** 页面
5. 复制以下两个值：

```
Project URL:
https://jsuqbaumrrrgexfdvras.supabase.co

anon public:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (复制完整字符串)

service_role:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (复制完整字符串，⚠️ 勿泄露)
```

---

## 🔧 配置命令 (获取密钥后执行)

```bash
cd /Users/xiaopeng/.openclaw/workspace/products/china-landing-ai-helper/pwa

# 配置 ANON_KEY (公开密钥)
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxx" production --yes

# 配置 SERVICE_ROLE_KEY (绝密密钥，必须加密)
vercel env add SUPABASE_SERVICE_ROLE_KEY --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxx" production --yes --sensitive
```

### 或通过 Vercel Dashboard 配置

1. 访问: https://vercel.com/gbhenrys-projects/pwa/settings/environment-variables
2. 点击 **Add** 按钮
3. 输入变量名和值
4. 对 `SUPABASE_SERVICE_ROLE_KEY` 勾选 **Sensitive** (加密存储)
5. 选择 **Production** 环境
6. 保存

---

## 🚀 部署命令 (配置完成后)

```bash
# 验证环境变量
vercel env ls

# 拉取最新配置
vercel env pull --environment production

# 触发生产部署
vercel --prod

# 查看部署状态
vercel ls
```

---

## 🧪 验证数据库连接

部署完成后，访问应用测试登录功能：

1. 访问: https://china-landing-ai-helper.vercel.app
2. 点击 "登录" 按钮
3. 尝试使用邮箱登录或 OAuth 登录
4. 检查控制台是否有 Supabase 连接错误

### 预期结果

- ✅ 登录页面正常显示
- ✅ 点击登录按钮无报错
- ✅ 能够成功登录/注册
- ✅ 用户数据正确保存到 Supabase

### 故障排查

如果登录失败，检查：

1. **浏览器控制台**: 是否有 `Failed to fetch` 或 `Invalid API key` 错误
2. **Vercel 函数日志**: `vercel logs --prod` 查看服务端错误
3. **Supabase Dashboard**: 查看 API 使用情况和错误日志

---

## 📋 配置清单

- [x] `NEXT_PUBLIC_SUPABASE_URL` = `https://jsuqbaumrrrgexfdvras.supabase.co`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (待提供)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = (待提供)
- [ ] 执行 `vercel --prod` 重新部署
- [ ] 验证数据库连接

---

## 🔒 安全提醒

1. **SERVICE_ROLE_KEY** 是超级管理员密钥，可以绕过所有 RLS 策略
2. 绝对不要将此密钥暴露给客户端代码
3. 仅在服务端 API 路由中使用
4. 定期轮换密钥（建议每 90 天）
5. 如果泄露，立即在 Supabase Dashboard 重置

---

## 📞 下一步

**请老板提供以下两个密钥**：

1. `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon public)
2. `SUPABASE_SERVICE_ROLE_KEY` (service_role)

获取位置：https://app.supabase.com/project/jsuqbaumrrrgexfdvras/settings/api

提供后我将立即完成配置并触发部署！

---

**报告生成时间**: 2026-04-12 19:55  
**项目 URL**: https://vercel.com/gbhenrys-projects/pwa  
**生产域名**: https://china-landing-ai-helper.vercel.app
