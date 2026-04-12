# 🔐 环境变量配置报告

**项目**: China Landing AI Helper PWA  
**执行时间**: 2026-04-12 19:27-19:35  
**执行者**: 沙僧 🐚 (Subagent)  
**状态**: ⚠️ 部分完成 - 需手动配置剩余凭证

---

## 📊 执行概览

| 任务 | 状态 | 说明 |
|------|------|------|
| 1. 生成 NEXTAUTH_SECRET | ✅ 完成 | 已生成并配置 |
| 2. 配置 Vercel 环境变量 | ⚠️ 部分完成 | 2/6 已配置，4/6 需手动 |
| 3. 验证配置生效 | ✅ 完成 | Vercel CLI 验证通过 |
| 4. 输出配置报告 | ✅ 完成 | 本报告 |

---

## ✅ 已完成配置

### 1. NEXTAUTH_SECRET

**生成方式**: `openssl rand -base64 32`  
**生成值**: `w28KSsi5mUDnMIUkUAvEH+xXRkiulPD2YS6wulrTSPc=`  
**配置状态**: ✅ 已更新至 Vercel Production 环境  
**配置时间**: 2026-04-12 19:32  
**验证命令**: `vercel env ls`

```bash
$ vercel env add NEXTAUTH_SECRET --value "w28KSsi5mUDnMIUkUAvEH+xXRkiulPD2YS6wulrTSPc=" production --yes --sensitive
Retrieving project…
Saving
Added Environment Variable NEXTAUTH_SECRET to Project pwa [339ms]
```

### 2. NEXTAUTH_URL

**配置值**: `https://china-landing-ai-helper.vercel.app`  
**配置状态**: ✅ 已更新至 Vercel Production 环境  
**配置时间**: 2026-04-12 19:33  
**验证命令**: `vercel env update NEXTAUTH_URL production --value "https://china-landing-ai-helper.vercel.app" --yes`

---

## ⚠️ 需手动配置的变量

以下变量需要访问对应服务的管理后台获取真实凭证：

### 1. Supabase 配置 (3 个变量)

**获取位置**: https://app.supabase.com/project/_/settings/api

| 变量名 | 当前值 | 操作 |
|--------|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | 替换为实际项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (空) | 从 Supabase Dashboard 复制 |
| `SUPABASE_SERVICE_ROLE_KEY` | (空) | 从 Supabase Dashboard 复制 |

**配置步骤**:
1. 访问 [Supabase Dashboard](https://app.supabase.com/)
2. 选择或创建项目
3. 进入 Settings → API
4. 复制以下三个值：
   - Project URL
   - `anon` public key
   - `service_role` key (⚠️ 敏感，勿泄露)
5. 在 Vercel Dashboard 配置：
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL --value "https://xxx.supabase.co" production --yes
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY --value "eyJ..." production --yes --sensitive
   vercel env add SUPABASE_SERVICE_ROLE_KEY --value "eyJ..." production --yes --sensitive
   ```

### 2. Google OAuth 配置

**获取位置**: https://console.cloud.google.com/apis/credentials

| 变量名 | 当前值 | 操作 |
|--------|--------|------|
| `GOOGLE_CLIENT_SECRET` | (空) | 从 Google Cloud Console 复制 |

**注**: `GOOGLE_CLIENT_ID` 已配置：`771411045609-el0ufcnuef58tnb7ol46sg2abip5pp4f.apps.googleusercontent.com`

**配置步骤**:
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 选择项目 → APIs & Services → Credentials
3. 找到 OAuth 2.0 Client ID
4. 复制 Client Secret
5. 在 Vercel Dashboard 配置：
   ```bash
   vercel env add GOOGLE_CLIENT_SECRET --value "GOCSPX-xxx" production --yes --sensitive
   ```

### 3. Facebook OAuth 配置

**获取位置**: https://developers.facebook.com/apps/

| 变量名 | 当前值 | 操作 |
|--------|--------|------|
| `FACEBOOK_CLIENT_SECRET` | (空) | 从 Facebook Developer 复制 |

**注**: `FACEBOOK_CLIENT_ID` 已配置：`1487908142746360`

**配置步骤**:
1. 访问 [Facebook Developers](https://developers.facebook.com/)
2. 选择应用 → Settings → Basic
3. 复制 App Secret
4. 在 Vercel Dashboard 配置：
   ```bash
   vercel env add FACEBOOK_CLIENT_SECRET --value "xxx" production --yes --sensitive
   ```

---

## 📋 Vercel 项目信息

| 项目 | 值 |
|------|-----|
| **项目名称** | pwa |
| **Project ID** | `prj_v2VQ5zwQ3sqKSY9t2sHYcgOfaKNp` |
| **Org ID** | `team_rwlg3KJZp2FVddFcHocRB3AK` |
| **Vercel Dashboard** | https://vercel.com/gbhenrys-projects/pwa |
| **生产域名** | https://china-landing-ai-helper.vercel.app |

---

## 🔧 快速配置命令

### 方式一：Vercel CLI (推荐)

```bash
cd /Users/xiaopeng/.openclaw/workspace/products/china-landing-ai-helper/pwa

# Supabase
vercel env add NEXT_PUBLIC_SUPABASE_URL --value "https://xxx.supabase.co" production --yes
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY --value "eyJ..." production --yes --sensitive
vercel env add SUPABASE_SERVICE_ROLE_KEY --value "eyJ..." production --yes --sensitive

# Google OAuth
vercel env add GOOGLE_CLIENT_SECRET --value "GOCSPX-xxx" production --yes --sensitive

# Facebook OAuth
vercel env add FACEBOOK_CLIENT_SECRET --value "xxx" production --yes --sensitive
```

### 方式二：Vercel Dashboard

1. 访问 https://vercel.com/gbhenrys-projects/pwa/settings/environment-variables
2. 点击 "Add" 按钮
3. 输入变量名、值、选择 "Production" 环境
4. 对敏感变量勾选 "Sensitive" (加密存储)
5. 保存

---

## ✅ 验证步骤

配置完成后，执行以下验证：

```bash
# 1. 验证环境变量已配置
vercel env ls

# 2. 拉取最新配置
vercel env pull --environment production

# 3. 检查 .env.production 文件
cat .env.production

# 4. 触发重新部署
vercel --prod

# 5. 验证部署
vercel ls
```

---

## 🚨 安全注意事项

1. **敏感变量加密**: 所有密钥类变量必须标记为 "Sensitive"
2. **不要提交到 Git**: `.env.production` 已在 `.gitignore` 中
3. **定期轮换**: 建议每 90 天轮换一次密钥
4. **最小权限**: Supabase `service_role` key 仅用于服务端

---

## 📝 配置清单

- [x] NEXTAUTH_SECRET - ✅ 已配置
- [x] NEXTAUTH_URL - ✅ 已配置
- [ ] NEXT_PUBLIC_SUPABASE_URL - ⏳ 待配置
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY - ⏳ 待配置
- [ ] SUPABASE_SERVICE_ROLE_KEY - ⏳ 待配置
- [ ] GOOGLE_CLIENT_SECRET - ⏳ 待配置
- [ ] FACEBOOK_CLIENT_SECRET - ⏳ 待配置

---

## 📞 后续支持

如需协助获取凭证：
- **Supabase**: 访问 https://app.supabase.com/
- **Google OAuth**: 访问 https://console.cloud.google.com/
- **Facebook OAuth**: 访问 https://developers.facebook.com/

**报告生成时间**: 2026-04-12 19:35  
**下次审查**: 配置完成后重新验证

---

*配置完成度：2/7 (28.6%)* 🦞
