# UI 组件使用指南

本文档说明新增的视觉设计组件使用方法。

---

## 📦 Loading 骨架屏组件

### 基础用法

```tsx
import { SkeletonEnhanced } from '@/components/ui';

// 基础骨架
<SkeletonEnhanced width="100%" height="1rem" />

// 带动画
<SkeletonEnhanced animation="wave" />  // pulse | shine | wave | none

// 圆形头像
<SkeletonEnhanced variant="circular" width="3rem" height="3rem" />
```

### 预定义组件

```tsx
import {
  CardSkeleton,
  ListSkeleton,
  AvatarSkeleton,
  TextLinesSkeleton,
  ChartSkeleton,
  TableSkeleton,
  GallerySkeleton,
  ChatBubbleSkeleton,
  PriceSkeleton,
  ProgressSkeleton,
} from '@/components/ui';

// 卡片骨架
<CardSkeleton />

// 列表骨架（5 项）
<ListSkeleton count={5} />

// 头像骨架（sm | md | lg | xl）
<AvatarSkeleton size="lg" />

// 文本行骨架
<TextLinesSkeleton lines={4} lastLineWidth="60%" />

// 图表骨架
<ChartSkeleton height="250px" />

// 表格骨架
<TableSkeleton rows={5} columns={4} />

// 图片画廊
<GallerySkeleton columns={3} rows={2} aspectRatio="square" />

// 聊天对话
<ChatBubbleSkeleton align="left" count={5} />

// 价格标签
<PriceSkeleton size="lg" />

// 进度条
<ProgressSkeleton segments={4} />
```

### 使用场景

```tsx
// 页面加载状态
function TripsPage() {
  const { data, isLoading } = useTrips();

  if (isLoading) {
    return <ListSkeleton count={5} />;
  }

  return (
    <div>
      {data.map(trip => <TripCard key={trip.id} {...trip} />)}
    </div>
  );
}

// 聊天加载
function ChatPage() {
  const { messages, isLoading } = useMessages();

  if (isLoading) {
    return <ChatBubbleSkeleton count={5} />;
  }

  return (
    <div>
      {messages.map(msg => <MessageBubble key={msg.id} {...msg} />)}
    </div>
  );
}
```

---

## ⚠️ 错误提示 UI 组件

### 基础用法

```tsx
import { ErrorDisplay } from '@/components/ui';

<ErrorDisplay
  title="出错了"
  message="网络连接失败，请检查后重试"
  code={404}
  icon="network"  // error | warning | info | network | server | notfound
  variant="inline"  // inline | banner | modal | toast
  onRetry={() => refetch()}
  onDismiss={() => setError(null)}
/>
```

### 快捷组件

```tsx
import { 
  NetworkError, 
  ServerError, 
  NotFoundError, 
  ErrorToast 
} from '@/components/ui';

// 网络错误
<NetworkError onRetry={refetch} />

// 服务器错误
<ServerError onRetry={refetch} />

// 404 错误
<NotFoundError onBack={() => router.push('/')} />

// Toast 通知（5 秒自动消失）
<ErrorToast 
  message="操作失败" 
  onDismiss={() => setError(null)}
  autoDismiss={5000}
/>
```

### 变体说明

| 变体 | 使用场景 |
|------|----------|
| `inline` | 内联显示，用于表单验证、局部错误 |
| `banner` | 横幅显示，用于页面级错误 |
| `modal` | 弹窗显示，用于阻断性错误 |
| `toast` | 通知显示，用于轻量级错误提示 |

### 使用场景

```tsx
// 错误边界
import { ErrorFallback } from '@/components/ui';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  componentDidCatch(error: Error) {
    this.setState({ hasError: true, error });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onRetry={this.retry} />;
    }
    return this.props.children;
  }
}

// API 错误处理
function UserProfile() {
  const { data, error, isLoading } = useUser();

  if (error) {
    return (
      <ErrorDisplay
        icon="server"
        title="加载失败"
        message={error.message}
        onRetry={() => refetch()}
        variant="banner"
      />
    );
  }

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return <Profile data={data} />;
}
```

---

## 📭 空状态组件

### 基础用法

```tsx
import { EmptyStateEnhanced } from '@/components/empty';

<EmptyStateEnhanced
  title="还没有收藏"
  description="看到喜欢的内容就收藏起来，方便随时查看"
  illustration="heart"  // explore | search | heart | message | bell | wifi | folder | calendar | star | clock | lock | sparkles
  primaryAction={{
    label: '去探索',
    onClick: () => router.push('/explore'),
  }}
  secondaryAction={{
    label: '清除筛选',
    onClick: clearFilters,
  }}
  recommendations={[
    { label: '热门推荐', onClick: () => router.push('/hot') },
    { label: '最新内容', onClick: () => router.push('/new') },
  ]}
/>
```

### 快捷组件

```tsx
import {
  NoData,
  NoHistory,
  NoFavorites,
  NoResults,
  Offline,
  FirstTime,
} from '@/components/empty';

// 无数据
<NoData onRefresh={refresh} />

// 无历史记录
<NoHistory onExplore={() => router.push('/explore')} />

// 无收藏
<NoFavorites onExplore={() => router.push('/explore')} />

// 搜索无结果
<NoResults 
  onBrowse={() => router.push('/hot')}
  onClear={clearFilters}
/>

// 离线状态
<Offline onRetry={reconnect} />

// 首次使用
<FirstTime onStart={() => router.push('/onboarding')} />
```

### 预设配置

```tsx
import { emptyStatePresets, EmptyStateEnhanced } from '@/components/empty';

// 使用预设
<EmptyStateEnhanced
  {...emptyStatePresets.noFavorites}
  primaryAction={{ label: '去探索', onClick: explore }}
/>
```

### 预设列表

| 预设 | 类型 | 插图 | 标题 |
|------|------|------|------|
| `noData` | 无数据 | folder | 暂无数据 |
| `noHistory` | 无历史 | clock | 还没有浏览历史 |
| `noFavorites` | 无收藏 | heart | 还没有收藏 |
| `noResults` | 无结果 | search | 没有找到匹配结果 |
| `noMessages` | 无消息 | message | 还没有消息 |
| `noNotifications` | 无通知 | bell | 还没有通知 |
| `offline` | 离线 | wifi | 网络连接已断开 |
| `firstTime` | 首次 | sparkles | 欢迎开始你的中国之旅 |
| `permissionDenied` | 无权限 | lock | 暂无权限 |
| `expired` | 已过期 | clock | 内容已过期 |

### 使用场景

```tsx
// 列表空状态
function FavoritesPage() {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <NoFavorites onExplore={() => router.push('/explore')} />
    );
  }

  return (
    <div>
      {favorites.map(item => <FavoriteCard key={item.id} {...item} />)}
    </div>
  );
}

// 搜索空状态
function SearchResults() {
  const { results, query, filters } = useSearch();

  if (results.length === 0 && query) {
    return (
      <NoResults 
        onBrowse={() => router.push('/hot')}
        onClear={clearFilters}
      />
    );
  }

  return <ResultsList results={results} />;
}
```

---

## 🌐 国际化文案

### 使用方式

```tsx
// 使用 next-intl 或类似库
import { useTranslations } from 'next-intl';

function Component() {
  const t = useTranslations();

  return (
    <div>
      <h1>{t('HomePage.title')}</h1>
      <p>{t('Errors.networkError')}</p>
    </div>
  );
}
```

### 文案分类

- `HomePage` - 首页文案
- `NavBar` - 导航栏文案
- `ChatPage` - 聊天页面文案
- `ProfilePage` - 个人中心文案
- `AuthPage` - 认证页面文案
- `TripsPage` - 行程页面文案
- `Common` - 通用文案
- `Errors` - 错误文案
- `Loading` - 加载文案
- `EmptyStates` - 空状态文案
- `Actions` - 操作按钮文案
- `Footer` - 页脚文案
- `Notifications` - 通知文案
- `Validation` - 验证文案
- `Time` - 时间文案
- `Accessibility` - 无障碍文案

---

## 🎨 设计原则

1. **一致性**: 所有组件使用统一的设计语言和动画效果
2. **无障碍**: 支持 `prefers-reduced-motion` 和深色模式
3. **响应式**: 针对移动端优化，支持各种屏幕尺寸
4. **性能**: 使用 CSS 动画而非 JS，减少重绘
5. **可定制**: 提供丰富的 props 和 CSS 变量

---

## 📝 注意事项

1. 骨架屏动画在 `prefers-reduced-motion` 下会自动禁用
2. 错误组件的 toast 模式会自动消失（默认 5 秒）
3. 空状态组件支持自定义插图
4. 所有组件都支持深色模式
5. 文案文件位于 `src/messages/` 目录
