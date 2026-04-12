# 🧪 自动化测试快速开始指南

## ✅ 已完成的配置

### 1. 测试框架结构

```
products/china-landing-ai-helper/pwa/
├── tests/
│   ├── unit/              ✅ 单元测试 (18 个测试)
│   ├── integration/       ✅ 集成测试 (13 个测试)
│   └── e2e/              ✅ E2E 冒烟测试 (17 个测试)
├── scripts/ci/
│   ├── generate-test-report.js  ✅ 报告生成
│   └── validate-coverage.js     ✅ 覆盖率验证
├── .github/workflows/
│   ├── test-automation.yml     ✅ 自动化测试 Workflow
│   └── ci-cd-complete.yml      ✅ 完整 CI/CD Pipeline
└── docs/
    └── AUTOMATED-TESTING-WORKFLOW.md  ✅ 完整文档
```

### 2. 测试结果

| 测试类型 | 测试数量 | 状态 |
|---------|---------|------|
| 单元测试 | 18 | ✅ 通过 |
| 集成测试 | 13 | ✅ 通过 |
| E2E 测试 | 17 | ✅ 通过 |
| **总计** | **48** | **✅ 全部通过** |

### 3. 当前覆盖率

| 指标 | 当前 | 目标 | 状态 |
|------|------|------|------|
| 全局覆盖率 | 22.0% | 80% | ⚠️ 需提升 |
| Hooks 覆盖率 | 20.9% | 75% | ⚠️ 需提升 |

**说明**: 覆盖率较低是因为项目中有很多现有代码尚未添加测试。测试框架已完全建立，可以开始编写新测试。

---

## 🚀 立即开始

### 运行所有测试

```bash
cd products/china-landing-ai-helper/pwa
npm test
```

### 运行测试并生成覆盖率

```bash
npm run test:coverage
```

### 查看覆盖率报告

```bash
# 在浏览器中打开 HTML 报告
open coverage/lcov-report/index.html
```

### 运行特定测试

```bash
# 单元测试
npm test -- --testPathPattern=tests/unit

# 集成测试
npm test -- --testPathPattern=tests/integration

# E2E 测试
npm test -- --testPathPattern=tests/e2e
```

### 验证覆盖率阈值

```bash
node scripts/ci/validate-coverage.js
```

### 生成测试报告

```bash
node scripts/ci/generate-test-report.js
```

---

## 📝 下一步行动

### 1. 提升覆盖率 (优先级：高)

需要为以下文件添加测试：

```
❌ src/hooks/useChatData.ts (0%)
❌ src/hooks/useRealtimeChat.ts (0%)
❌ src/hooks/useRealtimeQuery.ts (0%)
❌ src/hooks/useRealtimeTrips.ts (0%)
❌ src/hooks/useTripGeneration.ts (0%)
⚠️  src/lib/api-client.ts (21.7%)
```

**目标**: 达到 80% 覆盖率

### 2. CI/CD 集成 (优先级：中)

在 GitHub 仓库中配置以下 Secrets：

- `VERCEL_TOKEN` - Vercel 部署
- `VERCEL_ORG_ID` - Vercel 组织 ID
- `VERCEL_PROJECT_ID` - Vercel 项目 ID
- `SENTRY_AUTH_TOKEN` - Sentry 错误追踪

### 3. 添加更多测试 (优先级：持续)

参考 `tests/unit/example.test.ts` 的格式，为新功能添加测试。

---

## 🔧 常用命令

```bash
# 开发模式 - 监听文件变化
npm run test:watch

# 生成覆盖率报告
npm run test:coverage

# 运行单个测试文件
npm test -- tests/unit/example.test.ts

# 运行匹配的测试
npm test -- -t "should handle login"

# 详细输出
npm test -- --verbose

# 更新快照
npm test -- -u
```

---

## 📊 CI/CD 流程

### 触发条件

- **Push** → 完整 CI/CD (测试 + 构建 + 部署)
- **Pull Request** → 测试 + 预览部署
- **Release** → 生产部署
- **Manual** → 可选测试类型

### 质量门禁

```
✅ Lint 检查 (0 错误)
✅ TypeScript 检查 (0 错误)
✅ 单元测试 (全部通过)
✅ 集成测试 (全部通过)
✅ 代码覆盖率 (≥ 80%)
✅ 安全扫描 (0 高危)
✅ 构建成功
```

---

## 📖 完整文档

详细文档请查看：

- **自动化测试 Workflow**: [`docs/AUTOMATED-TESTING-WORKFLOW.md`](docs/AUTOMATED-TESTING-WORKFLOW.md)
- **CI/CD 配置**: [`.github/workflows/ci-cd-complete.yml`](.github/workflows/ci-cd-complete.yml)
- **测试框架**: [`jest.config.js`](jest.config.js)

---

## 🆘 故障排除

### 测试失败但本地通过

```bash
# 模拟 CI 环境
CI=true npm test
```

### 覆盖率不达标

```bash
# 查看未覆盖的代码
open coverage/lcov-report/index.html

# 针对性添加测试
```

### Workflow 运行缓慢

确保正确配置了 npm 缓存：

```yaml
cache: 'npm'
cache-dependency-path: package-lock.json
```

---

## ✨ 示例测试

### 单元测试示例

```typescript
// tests/unit/my-feature.test.ts
describe('MyFeature', () => {
  it('should do something', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });
});
```

### 集成测试示例

```typescript
// tests/integration/my-api.test.ts
describe('My API', () => {
  it('should return data', async () => {
    const response = await api.get('/endpoint');
    expect(response.status).toBe(200);
  });
});
```

### E2E 测试示例

```typescript
// tests/e2e/my-flow.test.ts
describe('User Flow', () => {
  it('should complete flow', async () => {
    // 模拟用户操作流程
    expect(flow.success).toBe(true);
  });
});
```

---

**创建时间**: 2024-04-12  
**状态**: ✅ 框架完成，待提升覆盖率  
**维护者**: AI Development Team
