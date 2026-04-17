# 代码提交安全规范

> 所有人在提交代码前必须遵守以下规范，避免明文 secret 泄露到代码库。

## 必须执行的检查

每次 `git commit` 前必须通过以下两项检查：

### 1. Build 检查

```bash
npm run build
```

- 必须通过 `next build`，无任何 TypeScript / lint 错误
- 如果 build 失败，**禁止提交**

### 2. Secret 检查（禁止明文密钥）

```bash
git diff --staged | grep -E "(secret|password|token|key)\s*=\s*['\"][^'\"]{8,}['\"]"
```

- 检查暂存区是否有明文 `secret` / `password` / `token` / `key`
- 如果发现，**禁止提交**
- 排除 `node_modules/`、`.next/`、`.vercel/` 等依赖目录

### 3. 绝对禁止的行为

- ❌ 不得在任何 `.ts`、`.tsx`、`.js`、`.json` 文件里写明文 API Key / Secret
- ❌ 不得提交 `VERCEL_TOKEN`、`GITHUB_TOKEN` 等平台访问令牌
- ❌ 不得提交私钥、证书、`.env.production` 等含真实密钥的文件
- ✅ 所有密钥必须通过环境变量注入（`.env.local` 不入版本控制）
- ✅ 第三方集成使用占位符（如 `sk-your-api-key`），真实值在 Vercel Dashboard 配置

## 本地 pre-commit 检查脚本

项目提供自动化检查脚本：

```bash
# 安装（如需要）
npm install --save-dev shelljs

# 运行安全检查（会在 build 前自动执行）
npm run pre-commit-check

# 或手动运行各项检查
npm run secret-check    # 只检查 secret
npm run build            # 只检查 build
```

## Git Hook 配置

项目使用 `pre-commit` hook 自动执行检查。手动安装：

```bash
npm run setup-hooks
```

或者手动创建 `.git/hooks/pre-commit`：

```bash
#!/bin/sh
echo "🔍 Running pre-commit security checks..."

# Check 1: Build
echo "📦 Checking build..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Fix errors before committing."
  exit 1
fi

# Check 2: Secret scan on staged files
echo "🔐 Scanning for secrets in staged files..."
git diff --staged --name-only | grep -v -E "^(node_modules|\.next|\.vercel|package(-lock)?\.json)" | while read file; do
  if [ -f "$file" ]; then
    # Scan file for potential secrets (exclude common false positives)
    grep -n -E "(secret|password|token|key)\s*=\s*['\"][^'\"]{8,}['\"]" "$file" 2>/dev/null | grep -v "//.*=" | grep -v "#.*=" | grep -v "example\|demo\|dummy\|placeholder\|your-" && {
      echo "❌ Secret detected in $file"
      exit 1
    }
  fi
done

if [ $? -ne 0 ]; then
  echo "❌ Secret check failed. Remove or replace secrets before committing."
  exit 1
fi

echo "✅ All checks passed!"
```

## 常见问题

**Q: 我需要添加新的环境变量怎么办？**
A: 在 `.env.example` 中添加占位符格式：
```bash
# .env.example
MY_SERVICE_API_KEY=your-api-key-here  # 在 Vercel Dashboard 配置真实值
```

**Q: 本地测试需要真实密钥，提交前忘记移除怎么办？**
A: 使用 `git diff --staged` 仔细检查暂存区，发现即停止提交。

**Q: 发现已经提交的密钥怎么办？**
A: 立即在 GitHub Settings → Secrets 中轮换令牌，并在下一版本中移除。
