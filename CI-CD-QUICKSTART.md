# 🚀 CI/CD 快速参考卡片

**30 秒了解项目 CI/CD 流程**

---

## 📋 一句话总结

> 代码提交 → 自动测试 → 自动部署 → 质量门禁保障

---

## 🎯 核心流程

```
git push → GitHub Actions → ✅ Tests → ✅ Build → 🚀 Vercel Deploy
```

---

## ✅ 质量门禁 (必须通过)

| 检查项 | 阈值 | 失败后果 |
|--------|------|---------|
| ESLint | 0 错误 | ❌ 阻断部署 |
| TypeScript | 0 错误 | ❌ 阻断部署 |
| 测试覆盖率 | ≥ 80% | ❌ 阻断部署 |
| 安全漏洞 | 无高危 | ❌ 阻断部署 |
| Lighthouse | ≥ 90 分 | ⚠️ 仅警告 (PR) |

---

## 🔧 本地验证命令 (提交前必跑)

```bash
# 一套组合拳，全部通过再提交
npm run lint && npm run test:coverage && npm run build
```

**分解命令**:
```bash
npm run lint           # 代码质量检查
npm run test:coverage  # 测试 + 覆盖率
npm run build          # 构建验证
npm audit              # 安全检查
```

---

## 📊 Workflow 触发条件

| 场景 | 触发条件 | 执行内容 |
|------|---------|---------|
| **开发** | Push 到 develop | 完整 CI/CD + Preview 部署 |
| **PR** | 创建 Pull Request | 完整 CI/CD + Preview 部署 + Lighthouse |
| **发布** | Push 到 main/master | 完整 CI/CD + 生产部署 |
| **手动** | Actions 页面触发 | 可选测试类型 |

---

## 📁 关键文件位置

```
.github/workflows/
├── ci-cd-complete.yml    # ⭐ 主 Workflow (推荐)
├── test-automation.yml   # 专项测试
└── deploy.yml            # 简化部署

scripts/ci/
├── validate-coverage.js  # 覆盖率验证
└── generate-test-report.js # 测试报告生成

tests/
├── unit/                # 单元测试
├── integration/         # 集成测试
└── e2e/                # E2E 测试
```

---

## 🔑 必需的 GitHub Secrets

```bash
VERCEL_TOKEN          # Vercel 部署
VERCEL_ORG_ID         # Vercel 组织
VERCEL_PROJECT_ID     # Vercel 项目
SENTRY_AUTH_TOKEN     # Sentry 错误追踪
```

**配置位置**: GitHub → Settings → Secrets and variables → Actions

---

## 🐛 故障排查

### Workflow 失败？

1. **查看日志**: GitHub Actions → 选择运行记录 → 查看失败步骤
2. **本地复现**: 在本地运行相同命令
3. **重新运行**: 点击 "Re-run jobs" 按钮

### 覆盖率不达标？

```bash
# 查看哪些文件覆盖率低
cat coverage/coverage-summary.json

# 针对性添加测试
npm run test:watch
```

### 依赖问题？

```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## 📖 详细文档

- **完整 SOP**: [WORKFLOW-SOP.md](WORKFLOW-SOP.md)
- **Workflow 说明**: [.github/workflows/README.md](.github/workflows/README.md)
- **Jest 配置**: [jest.config.js](jest.config.js)

---

## 💡 最佳实践

### ✅ Do's

- 提交前本地运行 `npm run lint && npm test && npm run build`
- 保持测试覆盖率 ≥ 80%
- 及时修复 `npm audit` 报告的安全漏洞
- 使用有意义的提交信息

### ❌ Don'ts

- 不要绕过 CI/CD 直接部署
- 不要降低覆盖率阈值 (需团队讨论)
- 不要在 main 分支直接提交 (走 PR 流程)
- 不要忽略失败的测试

---

## 🎓 学习资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vercel 部署指南](https://vercel.com/docs)
- [Jest 最佳实践](https://jestjs.io/docs/best-practices)
- [Next.js CI/CD](https://nextjs.org/docs/deployment)

---

**维护者**: 小龙虾 🦞  
**更新时间**: 2026-04-12  
**状态**: ✅ 生产就绪
