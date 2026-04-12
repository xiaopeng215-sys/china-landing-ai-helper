# GitHub Actions Workflows

本项目配置了 3 套 CI/CD Workflow，覆盖不同使用场景。

## 📋 Workflow 列表

| 文件名 | 用途 | 推荐度 |
|--------|------|--------|
| [`ci-cd-complete.yml`](ci-cd-complete.yml) | **完整 CI/CD 流程** | ⭐⭐⭐⭐⭐ |
| [`test-automation.yml`](test-automation.yml) | 专项测试流程 | ⭐⭐⭐⭐ |
| [`deploy.yml`](deploy.yml) | 简化部署流程 | ⭐⭐⭐ |

## 🚀 快速开始

### 自动触发

- **Push 到 main/master/develop**: 自动运行完整 CI/CD
- **Pull Request**: 自动运行测试 + 部署 Preview
- **Release**: 自动部署到生产环境

### 手动触发

1. 进入 GitHub 仓库 → **Actions** 标签
2. 选择要运行的 Workflow
3. 点击 **Run workflow** 按钮
4. 选择分支和参数 (如需要)

## 📊 完整流程 (ci-cd-complete.yml)

```
┌─────────────┐
│  Code Push  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  1. Code Quality│ ← ESLint + TypeScript
└──────┬──────────┘
       │
       ├──────────────┐
       ▼              ▼
┌─────────────┐ ┌────────────┐
│  2. Tests   │ │ 3.Security │ ← npm audit + Snyk
│  (Jest 80%) │ └─────┬──────┘
└──────┬──────┘       │
       │              │
       └──────┬───────┘
              │
              ▼
       ┌─────────────┐
       │  4. Build   │ ← Next.js Build
       └──────┬──────┘
              │
       ┌──────┴──────┐
       ▼             ▼
┌─────────────┐ ┌──────────────┐
│ PR: Preview │ │ Main: Prod   │
└─────────────┘ └──────────────┘
              │
              ▼
       ┌─────────────┐
       │ Quality Gate│ ← 汇总所有阶段
       └─────────────┘
```

## 🎯 质量门禁

| 检查项 | 阈值 | 失败处理 |
|--------|------|---------|
| ESLint | 0 错误 | 阻断 |
| TypeScript | 0 错误 | 阻断 |
| 测试覆盖率 | >= 80% | 阻断 |
| 安全漏洞 | 无高危 | 阻断 |
| Lighthouse | >= 90 分 | 警告 (PR) |

## 🔧 配置 Secrets

在 GitHub 仓库设置中配置以下 Secrets:

```
VERCEL_TOKEN          - Vercel 部署 Token
VERCEL_ORG_ID         - Vercel 组织 ID
VERCEL_PROJECT_ID     - Vercel 项目 ID
SENTRY_AUTH_TOKEN     - Sentry 认证 Token
SNYK_TOKEN            - Snyk 安全扫描 Token (可选)
LHCI_GITHUB_APP_TOKEN - Lighthouse CI Token (可选)
```

## 📁 测试目录

```
tests/
├── unit/              # 单元测试
├── integration/       # 集成测试
└── e2e/              # E2E 测试

src/__tests__/        # 组件测试
```

## 🛠️ 本地验证

在提交前，建议本地运行以下命令:

```bash
# 1. 代码质量检查
npm run lint
npx tsc --noEmit

# 2. 测试 + 覆盖率
npm run test:coverage

# 3. 构建验证
npm run build

# 4. 安全检查
npm audit
```

## 📖 详细文档

完整 SOP 文档：[WORKFLOW-SOP.md](../WORKFLOW-SOP.md)

## ⚠️ 注意事项

1. **不要删除 workflow 文件** - 它们是 CI/CD 的核心配置
2. **谨慎修改阈值** - 降低覆盖率要求需团队讨论
3. **定期更新依赖** - 运行 `npm audit fix` 修复安全漏洞
4. **监控运行时长** - Workflow 超时时间为 30 分钟

---

**维护者**: 小龙虾 🦞  
**更新时间**: 2026-04-12
