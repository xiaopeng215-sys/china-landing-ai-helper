# 🧪 自动化测试 Workflow 文档

**版本**: 1.0.0  
**创建时间**: 2024-04-12  
**项目**: China Landing AI Helper PWA

---

## 📋 目录

1. [概述](#概述)
2. [测试框架结构](#测试框架结构)
3. [CI/CD 流程](#cicd-流程)
4. [测试脚本说明](#测试脚本说明)
5. [配置说明](#配置说明)
6. [使用指南](#使用指南)
7. [最佳实践](#最佳实践)

---

## 概述

本项目实现了完整的自动化测试 Workflow，支持：

- ✅ **单元测试** - Jest + React Testing Library
- ✅ **集成测试** - API 和数据库集成测试
- ✅ **E2E 冒烟测试** - 关键用户流程测试
- ✅ **代码覆盖率** - 自动收集和阈值验证
- ✅ **CI/CD 集成** - GitHub Actions 自动化
- ✅ **测试报告** - HTML 和 JSON 格式报告生成

### 质量门禁

| 指标 | 阈值 | 说明 |
|------|------|------|
| 全局代码覆盖率 | ≥ 80% | 所有代码的平均覆盖率 |
| Hooks 覆盖率 | ≥ 75% | React Hooks 特定要求 |
| ESLint | 0 错误 | 代码规范检查 |
| TypeScript | 0 错误 | 类型检查 |
| 安全漏洞 | 0 高危 | npm audit 检查 |

---

## 测试框架结构

```
products/china-landing-ai-helper/pwa/
├── tests/
│   ├── unit/                    # 单元测试
│   │   └── example.test.ts
│   ├── integration/             # 集成测试
│   │   └── api.test.ts
│   └── e2e/                     # E2E 测试
│       └── smoke.test.ts
├── scripts/ci/
│   ├── generate-test-report.js  # 报告生成脚本
│   └── validate-coverage.js     # 覆盖率验证脚本
├── .github/workflows/
│   ├── test-automation.yml      # 自动化测试 Workflow
│   └── ci-cd-complete.yml       # 完整 CI/CD Pipeline
├── coverage/                    # 覆盖率报告 (自动生成)
└── test-reports/                # 测试报告 (自动生成)
```

### 测试文件命名规范

- 单元测试：`*.test.ts` 或 `*.test.tsx`
- 集成测试：`tests/integration/*.test.ts`
- E2E 测试：`tests/e2e/*.test.ts`
- 测试工具：`tests/utils/*.ts`

---

## CI/CD 流程

### 流程图

```
代码提交 → Lint 检查 → 单元测试 → 集成测试 → 构建 → 部署
              ↓           ↓           ↓         ↓       ↓
           ESLint     Jest       API 测试   验证    Vercel
           TypeScript  覆盖率     E2E 测试   Lighthouse
           安全扫描              性能测试
```

### Workflow 触发条件

| 事件 | 触发分支 | 执行的 Workflow |
|------|----------|----------------|
| Push | main/master/develop | 完整 CI/CD |
| Pull Request | main/master/develop | 测试 + 预览部署 |
| Release | N/A | 生产部署 |
| Manual | 任意 | 可选测试类型 |

### Job 依赖关系

```
lint ─┬─> test ─┬─> build ─> lighthouse ─> deploy-production
      │         │
      │         └─> security ─┘
      │
      └─> deploy-preview
```

---

## 测试脚本说明

### 1. 单元测试 (`tests/unit/`)

**目的**: 测试独立函数、组件和工具

**示例**:
```typescript
describe('Utility Function Tests', () => {
  it('should calculate discount correctly', () => {
    expect(calculateDiscount(100, 10)).toBe(90);
  });
});
```

**运行命令**:
```bash
npm test -- --testPathPattern=tests/unit
```

### 2. 集成测试 (`tests/integration/`)

**目的**: 测试 API 端点和数据库交互

**示例**:
```typescript
describe('API Integration Tests', () => {
  it('should handle login request', async () => {
    const response = await api.login(credentials);
    expect(response.status).toBe(200);
  });
});
```

**运行命令**:
```bash
npm test -- --testPathPattern=tests/integration
```

### 3. E2E 冒烟测试 (`tests/e2e/`)

**目的**: 测试关键用户流程

**示例**:
```typescript
describe('User Authentication Flow', () => {
  it('should complete login flow', async () => {
    // 模拟完整登录流程
    expect(flow.success).toBe(true);
  });
});
```

**运行命令**:
```bash
npm test -- --testPathPattern=tests/e2e
```

### 4. 覆盖率验证脚本

**位置**: `scripts/ci/validate-coverage.js`

**功能**:
- 验证全局覆盖率 ≥ 80%
- 验证 Hooks 覆盖率 ≥ 75%
- 输出低覆盖率文件列表
- CI/CD 失败时阻断合并

**运行命令**:
```bash
node scripts/ci/validate-coverage.js
```

### 5. 测试报告生成脚本

**位置**: `scripts/ci/generate-test-report.js`

**功能**:
- 生成 HTML 可视化报告
- 生成 JSON 机器可读报告
- 包含覆盖率统计和趋势
- 支持自定义阈值

**输出**:
- `test-reports/test-report-YYYY-MM-DD.html`
- `test-reports/test-report-YYYY-MM-DD.json`

---

## 配置说明

### Jest 配置 (`jest.config.js`)

```javascript
{
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  collectCoverageFrom: [
    'src/hooks/**/*.{ts,tsx}',
    'src/lib/api-client.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 70,
      lines: 60,
      statements: 60,
    },
  },
}
```

### GitHub Actions 环境变量

```yaml
env:
  NODE_VERSION: '20'
  CI: true
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### 必需的 Secrets

| 名称 | 用途 | 配置位置 |
|------|------|----------|
| `VERCEL_TOKEN` | Vercel 部署 | GitHub Settings |
| `VERCEL_ORG_ID` | Vercel 组织 ID | GitHub Settings |
| `VERCEL_PROJECT_ID` | Vercel 项目 ID | GitHub Settings |
| `SENTRY_AUTH_TOKEN` | Sentry 错误追踪 | GitHub Settings |
| `SNYK_TOKEN` | Snyk 安全扫描 | GitHub Settings (可选) |
| `LHCI_GITHUB_APP_TOKEN` | Lighthouse CI | GitHub Settings (可选) |

---

## 使用指南

### 本地开发

#### 运行所有测试
```bash
npm test
```

#### 运行测试并生成覆盖率
```bash
npm run test:coverage
```

#### 监听模式 (开发时)
```bash
npm run test:watch
```

#### 运行特定测试文件
```bash
npm test -- tests/unit/example.test.ts
```

#### 运行匹配的测试
```bash
npm test -- -t "should handle login"
```

### CI/CD 集成

#### 手动触发 Workflow
1. 进入 GitHub Actions
2. 选择 "🧪 Automated Testing Workflow"
3. 点击 "Run workflow"
4. 选择测试类型和覆盖率阈值
5. 点击 "Run workflow"

#### 查看测试报告
1. Workflow 完成后，进入 "Artifacts"
2. 下载 `test-reports` 压缩包
3. 打开 HTML 报告查看可视化结果

#### 检查覆盖率
```bash
# 本地验证
node scripts/ci/validate-coverage.js

# 查看 HTML 报告
open coverage/lcov-report/index.html
```

### 调试测试

#### 详细输出
```bash
npm test -- --verbose
```

#### 单步调试
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

#### 失败时打开调试器
```bash
npm test -- --detectOpenHandles
```

---

## 最佳实践

### 编写测试

✅ **推荐**:
```typescript
describe('UserService', () => {
  beforeEach(() => {
    // 每个测试前重置状态
    mockDb.reset();
  });

  it('should create user with valid data', async () => {
    const user = await createUser(validData);
    expect(user.id).toBeDefined();
    expect(user.email).toBe(validData.email);
  });

  it('should reject invalid email', async () => {
    await expect(createUser({ email: 'invalid' }))
      .rejects.toThrow('Invalid email');
  });
});
```

❌ **避免**:
```typescript
// 测试之间有依赖
it('test 1', () => { /* ... */ });
it('test 2', () => { /* 依赖 test 1 的结果 */ });

// 硬编码超时
setTimeout(() => { /* ... */ }, 5000);

// 测试实现细节而非行为
expect(mockFn).toHaveBeenCalledWith('exact', 'internal', 'values');
```

### 测试覆盖率

- **目标**: 80%+ 覆盖率
- **重点**: 业务逻辑、API 调用、工具函数
- **不必**: 100% 覆盖率 (收益递减)

### CI/CD 优化

1. **缓存依赖**
   ```yaml
   cache: 'npm'
   cache-dependency-path: package-lock.json
   ```

2. **并行执行**
   ```yaml
   strategy:
     matrix:
       test-type: [unit, integration, e2e]
   ```

3. **失败快速**
   ```yaml
   fail-fast: true
   ```

### 报告和分析

1. **定期审查** 低覆盖率文件
2. **追踪趋势** 使用 Codecov 或类似工具
3. **设置警报** 覆盖率下降时通知

---

## 故障排除

### 常见问题

#### 1. 测试失败但本地通过
**原因**: CI 环境变量不同  
**解决**: 
```bash
# 本地模拟 CI 环境
CI=true npm test
```

#### 2. 覆盖率不达标
**原因**: 新增代码未测试  
**解决**:
```bash
# 查看未覆盖的代码
open coverage/lcov-report/index.html
# 针对性添加测试
```

#### 3. Workflow 运行缓慢
**原因**: 依赖安装耗时  
**解决**: 确保正确配置缓存

#### 4. 内存不足
**原因**: Jest 占用过多内存  
**解决**:
```bash
# 限制 worker 数量
npm test -- --maxWorkers=2
```

### 日志位置

- GitHub Actions: `Actions` → 选择 Workflow → 查看日志
- 本地测试：终端输出
- 覆盖率报告：`coverage/lcov-report/index.html`

---

## 维护和更新

### 添加新测试类型

1. 在 `tests/` 下创建对应目录
2. 编写测试文件
3. 在 Workflow 中添加新 Job
4. 更新本文档

### 调整覆盖率阈值

1. 修改 `scripts/ci/validate-coverage.js`
2. 更新 `jest.config.js`
3. 更新本文档

### 升级依赖

```bash
# 检查可升级的依赖
npm outdated

# 升级 Jest
npm install --save-dev jest@latest

# 运行测试确保兼容
npm test
```

---

## 参考资源

- [Jest 文档](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vercel Deployment](https://vercel.com/docs/deployments/github)

---

## 更新日志

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0.0 | 2024-04-12 | 初始版本 |

---

**维护者**: AI Development Team  
**最后更新**: 2024-04-12
