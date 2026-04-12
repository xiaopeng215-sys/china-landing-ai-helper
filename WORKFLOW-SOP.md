# 🦞 CI/CD Workflow 标准操作流程 (SOP)

**项目**: China Landing AI Helper PWA  
**版本**: 1.0  
**更新时间**: 2026-04-12  
**状态**: ✅ 已激活

---

## 📋 目录

1. [Workflow 概览](#workflow-概览)
2. [触发条件](#触发条件)
3. [完整流程图](#完整流程图)
4. [各阶段详解](#各阶段详解)
5. [环境配置](#环境配置)
6. [故障排查](#故障排查)
7. [最佳实践](#最佳实践)

---

## Workflow 概览

本项目配置了 **3 套 Workflow**，覆盖不同场景：

| Workflow 文件 | 用途 | 触发场景 |
|--------------|------|---------|
| `ci-cd-complete.yml` | **主 Workflow** | 完整 CI/CD 流程 |
| `test-automation.yml` | 专项测试 | 测试验证、手动触发 |
| `deploy.yml` | 简化部署 | 快速部署验证 |

**推荐使用**: `ci-cd-complete.yml` (功能最完整)

---

## 触发条件

### 自动触发

| 事件 | 分支 | 执行 Workflow |
|------|------|--------------|
| Push | `main`, `master`, `develop` | ✅ 完整 CI/CD |
| Pull Request | `main`, `master`, `develop` | ✅ 完整 CI/CD + Preview 部署 |
| Release Published | 任意 | ✅ 生产部署 |

### 手动触发

```bash
# GitHub UI: Actions → 选择 Workflow → Run workflow
# 可选参数:
# - test_type: all | unit | integration | e2e
# - coverage_threshold: 80 (默认)
```

---

## 完整流程图

```
┌─────────────────────────────────────────────────────────────────┐
│                        代码提交/Push                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Stage 1: Code Quality (代码质量检查)                           │
│  ├── 🔍 ESLint 语法检查                                         │
│  └── 📝 TypeScript 类型检查                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│  Stage 2: Tests          │  │  Stage 3: Security       │
│  🧪 单元测试 + 覆盖率     │  │  🔒 npm audit + Snyk     │
│  ✅ 覆盖率 >= 80%        │  │  ✅ 无高危漏洞           │
└──────────────────────────┘  └──────────────────────────┘
                    │                   │
                    └─────────┬─────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Stage 4: Build (构建验证)                                      │
│  🏗️ npm run build                                              │
│  📦 生成 .next 构建产物                                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
         (PR 场景)            (Main/Master 分支)
┌─────────────────────┐    ┌─────────────────────┐
│  Deploy Preview     │    │  Deploy Production  │
│  🚀 Vercel Preview  │    │  🌐 Vercel Prod     │
└─────────────────────┘    └─────────────────────┘
                    │                   │
                    └─────────┬─────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Stage 8: Quality Gate Summary (质量门禁汇总)                   │
│  ✅ 所有阶段通过 → 部署成功                                     │
│  ❌ 任一阶段失败 → 阻断部署                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 各阶段详解

### Stage 1: Code Quality (代码质量)

**Job**: `lint`  
**运行时间**: ~2 分钟  
**失败条件**: ESLint 错误或 TypeScript 类型错误

```yaml
# 关键检查项
- npm run lint          # ESLint 语法检查
- npx tsc --noEmit      # TypeScript 类型检查
```

**常见问题**:
- ESLint 报错 → 运行 `npm run lint -- --fix`
- TypeScript 错误 → 修复类型定义

---

### Stage 2: Automated Tests (自动化测试)

**Job**: `test`  
**运行时间**: ~5 分钟  
**失败条件**: 测试失败或覆盖率 < 80%

```yaml
# 测试命令
npm run test:coverage

# 覆盖率阈值
- 全局覆盖率 >= 80%
- Hooks 覆盖率 >= 75%
```

**测试目录结构**:
```
tests/
├── unit/           # 单元测试
├── integration/    # 集成测试
└── e2e/           # E2E 测试
src/__tests__/     # 组件测试
```

**覆盖率报告位置**: `coverage/coverage-summary.json`

---

### Stage 3: Security Scan (安全扫描)

**Job**: `security`  
**运行时间**: ~2 分钟  
**失败条件**: 发现高危漏洞

```yaml
# 安全检查
- npm audit --audit-level=high   # NPM 依赖审计
- Snyk 扫描 (可选)                # 深度安全扫描
```

**修复漏洞**:
```bash
npm audit fix          # 自动修复
npm audit fix --force  # 强制修复 (可能破坏性)
```

---

### Stage 4: Build (构建)

**Job**: `build`  
**运行时间**: ~5-8 分钟  
**失败条件**: 构建失败

```yaml
# 构建命令
npm run build

# 环境变量
SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
```

**构建产物**: `.next/` (保留 3 天)

---

### Stage 5: Lighthouse Performance (性能审计)

**Job**: `lighthouse`  
**触发条件**: 仅 PR 场景  
**运行时间**: ~3 分钟  
**失败条件**: 性能分数 < 90

```yaml
# 审计指标
- Performance >= 90
- Accessibility >= 90
- Best Practices >= 90
- SEO >= 90
```

**本地运行**:
```bash
npm install -g lighthouse
lighthouse http://localhost:3000 --output=json
```

---

### Stage 6/7: Deploy (部署)

#### Deploy Preview (PR)
**环境**: `preview`  
**触发**: Pull Request  
**URL**: 自动生成预览链接

#### Deploy Production (生产)
**环境**: `production`  
**触发**: Push 到 main/master 或 Release  
**URL**: 生产环境地址

---

### Stage 8: Quality Gate Summary (质量门禁)

**Job**: `quality-gate`  
**触发**: 所有阶段完成后 (always)  
**作用**: 汇总所有阶段状态，失败则阻断

**输出示例**:
```markdown
## 🎯 Quality Gate Results

| Stage | Status |
|-------|--------|
| Code Quality | success |
| Automated Tests | success |
| Security Scan | success |
| Build | success |
| Lighthouse | success |

✅ **All Quality Gates PASSED**
```

---

## 环境配置

### GitHub Secrets 配置

在 GitHub 仓库 Settings → Secrets and variables → Actions 中配置:

| Secret 名称 | 用途 | 获取方式 |
|------------|------|---------|
| `VERCEL_TOKEN` | Vercel 部署 | Vercel Dashboard → Account → Tokens |
| `VERCEL_ORG_ID` | Vercel 组织 ID | Vercel Dashboard → Settings |
| `VERCEL_PROJECT_ID` | Vercel 项目 ID | Vercel Dashboard → Project Settings |
| `SENTRY_AUTH_TOKEN` | Sentry 错误追踪 | Sentry → Settings → API Keys |
| `SNYK_TOKEN` | Snyk 安全扫描 | Snyk → Settings → Auth Token |
| `LHCI_GITHUB_APP_TOKEN` | Lighthouse CI | LHCI 文档 |

### 环境变量文件

```bash
# .env.production (生产环境)
NEXT_PUBLIC_API_URL=https://api.example.com
SENTRY_DSN=https://xxx@sentry.io/xxx
```

---

## 故障排查

### Workflow 失败常见原因

#### 1. 依赖安装失败
```bash
# 清除缓存重试
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

#### 2. 测试失败
```bash
# 本地运行测试
npm run test:coverage

# 查看失败详情
cat coverage/coverage-summary.json
```

#### 3. 构建失败
```bash
# 本地构建验证
npm run build

# 检查 TypeScript 错误
npx tsc --noEmit
```

#### 4. 部署失败
```bash
# 检查 Vercel 配置
cat .vercel/project.json

# 本地部署测试
vercel --token=${VERCEL_TOKEN}
```

### 查看日志

1. GitHub Actions → 选择 Workflow → 选择运行记录
2. 点击失败的 Job → 查看步骤日志
3. 搜索错误关键词 (ERROR, FAIL, Exception)

### 重新运行

- **单个 Job**: 点击 Job 右上角 "Re-run jobs"
- **整个 Workflow**: 点击 "Re-run all jobs"

---

## 最佳实践

### 开发流程

```
1. 本地开发
   ↓
2. npm run lint && npm run test && npm run build
   ↓
3. git commit -m "feat: xxx"
   ↓
4. git push origin feature-branch
   ↓
5. 创建 Pull Request
   ↓
6. 等待 CI/CD 通过
   ↓
7. Code Review
   ↓
8. Merge to main
   ↓
9. 自动部署到生产
```

### 提交规范

```bash
# 功能开发
git commit -m "feat: add user authentication"

# 修复 bug
git commit -m "fix: resolve login issue"

# 文档更新
git commit -m "docs: update README"

# 测试添加
git commit -m "test: add unit tests for API"
```

### 分支策略

| 分支 | 用途 | 部署目标 |
|------|------|---------|
| `main` / `master` | 生产代码 | Production |
| `develop` | 开发集成分支 | Preview |
| `feature/*` | 功能开发 | Preview (PR) |
| `hotfix/*` | 紧急修复 | Production |

### 性能优化

1. **缓存依赖**: Workflow 已配置 npm 缓存
2. **并行执行**: lint/test/security 并行运行
3. **按需触发**: Lighthouse 仅在 PR 运行
4. **产物清理**: 构建产物保留 3-7 天

---

## 附录

### 相关文档

- [Jest 配置](jest.config.js)
- [测试脚本](scripts/ci/validate-coverage.js)
- [Vercel 配置](.vercel/project.json)

### 命令速查

```bash
# 开发
npm run dev

# 构建
npm run build

# 测试
npm test
npm run test:coverage
npm run test:watch

# 代码质量
npm run lint
npx tsc --noEmit

# 部署
vercel deploy --prod
```

### 联系方式

- **项目负责人**: 老板
- **技术支持**: 小龙虾 🦞
- **文档维护**: 自动更新

---

**最后更新**: 2026-04-12 19:40  
**下次审查**: 2026-05-12
