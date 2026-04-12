# 🧪 OAuth 登录测试指南

## 快速测试流程

### 方法 1: 使用测试凭证 (推荐用于开发)

如果还没有正式的 OAuth 凭证，可以使用以下方法快速测试:

#### Google OAuth 测试:
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建测试项目
3. 按照 `OAUTH_SETUP.md` 配置
4. **重要:** 在测试模式下，Google 允许使用未验证的应用

#### Facebook OAuth 测试:
1. Facebook 应用在开发模式下可以直接测试
2. 添加测试用户: **应用仪表板** → **角色** → **测试用户**
3. 使用测试用户账号登录

### 方法 2: 本地 Mock 测试 (无需 OAuth 凭证)

创建一个测试用的 OAuth Mock 提供者:

```typescript
// src/app/api/auth/[...nextauth]/route.ts 中添加

const MockProvider = {
  id: 'mock',
  name: 'Mock Login',
  type: 'oauth' as const,
  authorization: 'https://example.com',
  clientId: 'mock-client',
  clientSecret: 'mock-secret',
  profile() {
    return {
      id: 'mock-user-id',
      email: 'test@example.com',
      name: 'Test User',
      image: 'https://i.pravatar.cc/150',
    };
  },
};

// 添加到 providers 数组
providers: [
  // ... 其他 providers
  MockProvider,
]
```

### 方法 3: 使用邮箱验证码 (无需外部配置)

邮箱验证码登录已经配置，只需设置邮件服务器:

```env
EMAIL_SERVER=smtp://localhost:1025  # 使用 Mailhog 等测试 SMTP
EMAIL_FROM=noreply@test.com
```

---

## 🔬 自动化测试脚本

### 创建测试文件:

```typescript
// src/tests/oauth.test.ts
import { signIn } from 'next-auth/react';

describe('OAuth Login', () => {
  it('should login with Google', async () => {
    const result = await signIn('google', { redirect: false });
    expect(result?.error).toBeUndefined();
  });

  it('should login with Facebook', async () => {
    const result = await signIn('facebook', { redirect: false });
    expect(result?.error).toBeUndefined();
  });
});
```

### 运行测试:

```bash
npm test -- oauth.test.ts
```

---

## 🐛 调试 Checklist

### 登录失败时检查:

- [ ] 环境变量是否正确加载?
  ```bash
  # 在开发服务器中打印
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
  ```

- [ ] NextAuth 配置是否正确?
  ```bash
  # 访问 /api/auth/providers 查看可用 providers
  curl http://localhost:3000/api/auth/providers
  ```

- [ ] 回调 URL 是否匹配?
  ```
  检查：OAuth 提供商配置 vs .env.local 中的 NEXTAUTH_URL
  ```

- [ ] 数据库连接是否正常?
  ```bash
  # 检查 Supabase 连接
  curl https://your-project.supabase.co/rest/v1/users
  ```

---

## 📊 测试报告模板

```markdown
## OAuth 测试报告

**测试日期:** YYYY-MM-DD
**测试环境:** 本地开发 / 生产环境

### Google OAuth
- [ ] 配置完成
- [ ] 重定向正常
- [ ] 回调处理正常
- [ ] 用户数据保存正常
- **状态:** ✅ 通过 / ❌ 失败

### Facebook OAuth
- [ ] 配置完成
- [ ] 重定向正常
- [ ] 回调处理正常
- [ ] 用户数据保存正常
- **状态:** ✅ 通过 / ❌ 失败

### OpenAI OAuth
- [ ] 配置完成
- [ ] 重定向正常
- [ ] 回调处理正常
- [ ] 用户数据保存正常
- **状态:** ✅ 通过 / ❌ 失败

### 问题记录:
1. ...
2. ...

### 解决方案:
1. ...
2. ...
```

---

## 🚀 下一步

1. **获取 OAuth 凭证** - 按照 `OAUTH_SETUP.md` 配置
2. **更新环境变量** - 填写真实的 Client ID 和 Secret
3. **本地测试** - 在开发环境验证流程
4. **生产部署** - 在 Vercel 配置环境变量
5. **最终测试** - 验证生产环境登录

---

**提示:** 如果遇到问题，检查 NextAuth 日志输出，通常错误信息会明确指出问题所在。
