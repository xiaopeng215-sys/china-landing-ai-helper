# 测试用例文档

China Landing AI Helper PWA - 测试套件说明

---

## 目录结构

```
src/__tests__/
├── README.md              # 本文档
├── api-client.test.ts     # API 客户端测试
├── hooks.test.ts          # React Hooks 测试
├── components/            # 组件测试（待补充）
│   ├── Card.test.tsx
│   ├── Button.test.tsx
│   └── Skeleton.test.tsx
└── pages/                 # 页面测试（待补充）
    ├── HomePage.test.tsx
    └── NotFoundPage.test.tsx
```

---

## 测试框架

- **Jest**: 测试运行器
- **React Testing Library**: React 组件测试
- **@testing-library/jest-dom**: DOM 匹配器

---

## 如何运行测试

### 运行所有测试

```bash
npm test
```

### 监听模式（开发时）

```bash
npm run test:watch
```

### 生成覆盖率报告

```bash
npm run test:coverage
```

覆盖率报告将生成在 `coverage/` 目录下。

### 运行特定测试文件

```bash
npm test -- api-client.test.ts
npm test -- hooks.test.ts
```

### 运行匹配的测试

```bash
npm test -- -t "useTripData"
```

---

## 测试用例清单

### 1. API 客户端测试 (`api-client.test.ts`)

| 测试用例 | 描述 | 状态 |
|----------|------|------|
| `ApiClient - get - success` | 成功获取数据 | ✅ |
| `ApiClient - get - error` | 处理 GET 请求错误 | ✅ |
| `ApiClient - post - success` | 成功提交数据 | ✅ |
| `ApiClient - post - validation error` | 处理验证错误 | ✅ |
| `ApiClient - timeout` | 处理请求超时 | ✅ |
| `ApiClient - retry logic` | 自动重试机制 | ✅ |

---

### 2. Hooks 测试 (`hooks.test.ts`)

#### useTripData

| 测试用例 | 描述 | 状态 |
|----------|------|------|
| `useTripData - initial state` | 初始状态正确 | ✅ |
| `useTripData - fetch trip` | 获取行程数据 | ✅ |
| `useTripData - loading state` | 加载状态管理 | ✅ |
| `useTripData - error handling` | 错误处理 | ✅ |
| `useTripData - update trip` | 更新行程 | ✅ |

#### useAttractionData

| 测试用例 | 描述 | 状态 |
|----------|------|------|
| `useAttractionData - fetch list` | 获取景点列表 | ✅ |
| `useAttractionData - fetch detail` | 获取景点详情 | ✅ |
| `useAttractionData - filter` | 筛选功能 | ✅ |

#### useFoodData

| 测试用例 | 描述 | 状态 |
|----------|------|------|
| `useFoodData - fetch restaurants` | 获取餐厅列表 | ✅ |
| `useFoodData - filter by cuisine` | 按菜系筛选 | ✅ |

#### useTransportData

| 测试用例 | 描述 | 状态 |
|----------|------|------|
| `useTransportData - route query` | 查询路线 | ✅ |
| `useTransportData - multiple modes` | 多种交通方式 | ✅ |

---

### 3. 组件测试（待补充）

#### Card 组件

| 测试用例 | 描述 | 状态 |
|----------|------|------|
| `Card - renders content` | 正确渲染内容 | ⏳ |
| `Card - click handler` | 点击事件处理 | ⏳ |
| `Card - loading state` | 加载状态显示 | ⏳ |

#### Button 组件

| 测试用例 | 描述 | 状态 |
|----------|------|------|
| `Button - renders text` | 正确显示文本 | ⏳ |
| `Button - disabled state` | 禁用状态 | ⏳ |
| `Button - click event` | 点击事件 | ⏳ |

#### Skeleton 组件

| 测试用例 | 描述 | 状态 |
|----------|------|------|
| `Skeleton - renders with dimensions` | 正确渲染尺寸 | ⏳ |
| `Skeleton - animation` | 动画效果 | ⏳ |
| `CardSkeleton - layout` | 卡片骨架屏布局 | ⏳ |

#### UndoButton 组件

| 测试用例 | 描述 | 状态 |
|----------|------|------|
| `UndoButton - renders` | 渲染按钮 | ⏳ |
| `UndoButton - keyboard shortcut` | Ctrl+Z 快捷键 | ⏳ |
| `UndoButton - disabled when empty` | 无历史时禁用 | ⏳ |
| `UndoButton - undo action` | 撤销操作 | ⏳ |

#### EstimatedTime 组件

| 测试用例 | 描述 | 状态 |
|----------|------|------|
| `EstimatedTime - countdown` | 倒计时功能 | ⏳ |
| `EstimatedTime - progress bar` | 进度条显示 | ⏳ |
| `EstimatedTime - stage changes` | 阶段变化 | ⏳ |
| `EstimatedTime - complete callback` | 完成回调 | ⏳ |

---

### 4. 页面测试（待补充）

#### HomePage

| 测试用例 | 描述 | 状态 |
|----------|------|------|
| `HomePage - renders` | 页面渲染 | ⏳ |
| `HomePage - loads trips` | 加载行程列表 | ⏳ |
| `HomePage - navigation` | 导航功能 | ⏳ |

#### NotFoundPage

| 测试用例 | 描述 | 状态 |
|----------|------|------|
| `NotFoundPage - renders` | 404 页面渲染 | ⏳ |
| `NotFoundPage - back button` | 返回按钮 | ⏳ |

---

## 测试覆盖目标

| 类型 | 目标覆盖率 | 当前覆盖率 |
|------|------------|------------|
| 语句覆盖 | 80% | 65% |
| 分支覆盖 | 75% | 58% |
| 函数覆盖 | 85% | 72% |
| 行覆盖 | 80% | 67% |

---

## 编写测试的最佳实践

### 1. 测试命名

```typescript
// ✅ 好的命名
it('should fetch trip data when component mounts', () => { ... });
it('should display error message when API fails', () => { ... });

// ❌ 避免的命名
it('test 1', () => { ... });
it('works', () => { ... });
```

### 2. Arrange-Act-Assert 模式

```typescript
it('should update state on fetch', async () => {
  // Arrange
  const mockData = { id: '1', name: 'Test' };
  mockFetch.mockResolvedValue(mockData);

  // Act
  const { result } = renderHook(() => useTripData());
  await result.current.fetchTrip('1');

  // Assert
  expect(result.current.trip).toEqual(mockData);
  expect(result.current.loading).toBe(false);
});
```

### 3. 清理副作用

```typescript
afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});
```

### 4. 异步测试

```typescript
it('should handle async operation', async () => {
  await act(async () => {
    // 异步操作
  });
  // 断言
});
```

---

## 持续集成

测试将在以下场景自动运行：

1. **Pull Request**: 所有 PR 必须通过测试
2. **CI Pipeline**: 每次 push 到 main 分支
3. **Pre-commit Hook**: 本地提交前运行相关测试

### CI 配置

见 `.github/workflows/test.yml`

---

## 常见问题

### Q: 测试运行缓慢怎么办？

A: 使用 `--testPathPattern` 运行特定测试，或使用 `--maxWorkers` 限制并发数。

### Q: 如何调试测试？

A: 在测试前添加 `debugger`，然后使用 `node --inspect` 运行。

### Q: Mock 数据在哪里定义？

A: 在测试文件中使用 `jest.mock()` 或在 `__mocks__/` 目录中定义。

---

## 待办事项

- [ ] 补充所有组件的单元测试
- [ ] 添加集成测试
- [ ] 添加 E2E 测试（使用 Playwright）
- [ ] 提升测试覆盖率至 80%+
- [ ] 添加视觉回归测试

---

## 参考资源

- [Jest 文档](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles)
