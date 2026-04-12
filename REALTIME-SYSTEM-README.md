# 🔥 实时内容更新系统

完整的实时数据同步架构，支持 WebSocket/SSE、离线同步、缓存优化和实时更新 UI。

## 📦 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                     客户端 (PWA)                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  WebSocket  │  │  SSE Client  │  │  Offline Sync    │   │
│  │  Manager    │  │              │  │  Manager         │   │
│  └──────┬──────┘  └──────┬───────┘  └────────┬─────────┘   │
│         │                │                    │             │
│         └────────────────┼────────────────────┘             │
│                          │                                  │
│                 ┌────────▼────────┐                         │
│                 │ useRealtimeQuery│                         │
│                 │     Hook        │                         │
│                 └────────┬────────┘                         │
│                          │                                  │
│         ┌────────────────┼────────────────┐                │
│         │                │                │                │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐        │
│  │  ChatView   │  │  TripsView  │  │  FoodView   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ WebSocket / SSE
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     服务器端                                 │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  WebSocket  │  │  SSE Route   │  │  API Routes      │   │
│  │  Server     │  │  /api/stream │  │  /api/*          │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 快速开始

### 1. 安装依赖

```bash
# WebSocket 客户端已内置，如需独立服务器：
npm install ws
```

### 2. 配置环境变量

```bash
# .env.local
NEXT_PUBLIC_WS_URL=ws://localhost:3001/ws
NEXT_PUBLIC_SSE_URL=/api/stream
```

### 3. 初始化 RealtimeProvider

在 `src/app/layout.tsx` 或根组件中：

```tsx
import { RealtimeProvider } from '@/components/realtime/RealtimeProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <RealtimeProvider
          showStatusIndicator={true}
          enableOfflineSync={true}
        >
          {children}
        </RealtimeProvider>
      </body>
    </html>
  );
}
```

### 4. 使用实时 Hooks

```tsx
'use client';

import { useRealtimeChat } from '@/hooks';

export default function ChatPage() {
  const {
    messages,
    loading,
    sendMessage,
    refresh,
  } = useRealtimeChat({
    pollInterval: 30000, // 30 秒轮询
    realtime: true,      // 启用 WebSocket 更新
    sessionId: 'user-123',
  });

  return (
    <div>
      {loading ? (
        <p>加载中...</p>
      ) : (
        messages.map((msg) => <div key={msg.id}>{msg.content}</div>)
      )}
      <button onClick={() => sendMessage('Hello')}>发送</button>
    </div>
  );
}
```

## 📚 核心组件

### WebSocketManager

完整的 WebSocket 连接管理，支持：
- ✅ 自动重连（指数退避）
- ✅ 心跳检测
- ✅ 消息队列
- ✅ 频道订阅
- ✅ 状态监听

```typescript
import { getWebSocketManager } from '@/lib/realtime';

const ws = getWebSocketManager();

// 订阅频道
const unsubscribe = ws.subscribe('chat:user-123', (data) => {
  console.log('收到消息:', data);
});

// 发送消息
ws.send({ type: 'message', content: 'Hello' }, 'chat:user-123');

// 监听状态变化
ws.onStatusChange((status) => {
  console.log('WebSocket 状态:', status);
  // 'connecting' | 'connected' | 'disconnected' | 'reconnecting'
});
```

### SSEClient

Server-Sent Events 客户端，适用于单向推送：

```typescript
import { getSSEClient } from '@/lib/realtime';

const sse = getSSEClient();

// 订阅事件
sse.subscribe('content-update', (event) => {
  console.log('内容更新:', event.data);
});

// 监听连接状态
sse.onStatusChange((status) => {
  console.log('SSE 状态:', status);
});
```

### OfflineSyncManager

离线数据同步管理：

```typescript
import { getOfflineSyncManager } from '@/lib/realtime';

const sync = getOfflineSyncManager();

// 缓存数据
await sync.cacheData('trips:user-123', tripsData, 'trips');

// 从缓存读取
const cached = await sync.getFromCache('trips:user-123');

// 加入同步队列
await sync.enqueueOperation('create', 'trips', {
  name: '新行程',
  date: '2024-01-01',
});

// 设置同步处理器
sync.setSyncHandler('trips', async (operation) => {
  // 实际发送到服务器的逻辑
  await fetch('/api/trips', {
    method: 'POST',
    body: JSON.stringify(operation.data),
  });
});
```

### useRealtimeQuery

类似 SWR/React Query 的实时查询 Hook：

```typescript
import { useRealtimeQuery } from '@/hooks';

const {
  data,
  loading,
  error,
  isValidating,
  isStale,
  mutate,
  optimisticMutate,
} = useRealtimeQuery<UserData>(
  'user:profile',
  async () => {
    const res = await fetch('/api/user/profile');
    return res.json();
  },
  {
    pollInterval: 60000,        // 1 分钟轮询
    realtime: true,             // 启用 WebSocket 更新
    channel: 'user:profile',    // WebSocket 频道
    cacheTTL: 300000,           // 5 分钟缓存
    optimisticUpdates: true,    // 乐观更新
  }
);

// 手动刷新
await mutate();

// 乐观更新
optimisticMutate((prev) => ({
  ...prev,
  name: '新名字',
}));
```

## 🎯 使用场景

### 1. 实时聊天

```tsx
import { useRealtimeChat } from '@/hooks';

function ChatRoom({ sessionId }) {
  const {
    messages,
    loading,
    sendMessage,
    isStale,
  } = useRealtimeChat({
    sessionId,
    pollInterval: 30000,
    realtime: true,
  });

  return (
    <div>
      {isStale && <div className="stale-indicator">数据可能已过时</div>}
      {/* 聊天界面 */}
    </div>
  );
}
```

### 2. 行程实时更新

```tsx
import { useRealtimeTrips } from '@/hooks';

function TripList() {
  const {
    trips,
    createTrip,
    updateTrip,
    deleteTrip,
    loading,
  } = useRealtimeTrips({
    userId: 'current-user',
    realtime: true,
  });

  return (
    <div>
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          trip={trip}
          onUpdate={(updates) => updateTrip(trip.id, updates)}
          onDelete={() => deleteTrip(trip.id)}
        />
      ))}
    </div>
  );
}
```

### 3. 内容推送通知

```tsx
import { useEffect } from 'react';
import { getWebSocketManager } from '@/lib/realtime';

function NotificationBadge() {
  useEffect(() => {
    const ws = getWebSocketManager();
    
    const unsubscribe = ws.subscribe('notifications', (data) => {
      // 显示通知
      showNotification(data.title, data.message);
    });

    return unsubscribe;
  }, []);

  return <div>🔔</div>;
}
```

## 🔧 独立 WebSocket 服务器

Next.js 不原生支持 WebSocket，需要独立部署：

```javascript
// separate-websocket-server.js
const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server, path: '/ws' });

const clients = new Map();

wss.on('connection', (ws) => {
  const clientId = `client_${Date.now()}`;
  clients.set(clientId, ws);

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    // 心跳
    if (data.type === 'ping') {
      ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
      return;
    }

    // 广播
    if (data.broadcast) {
      clients.forEach((client, id) => {
        if (id !== clientId && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  });

  ws.on('close', () => clients.delete(clientId));
});

server.listen(3001, () => {
  console.log('WebSocket server on port 3001');
});
```

运行：
```bash
node separate-websocket-server.js
```

## 📊 性能优化

### 1. 缓存策略

```typescript
// 智能缓存 TTL
const cacheTTL = isMobile ? 10 * 60 * 1000 : 2 * 60 * 1000;

// 静默刷新
useRealtimeQuery(key, fetcher, {
  pollInterval: 60000,
  onSuccess: (data) => {
    // 只在首次加载时显示 loading
  },
});
```

### 2. 乐观更新

```typescript
// 立即更新 UI，后台同步
optimisticMutate((prev) => ({
  ...prev,
  items: [...prev.items, newItem],
}));

// 如果失败，自动回滚
// Hook 内部处理
```

### 3. 批量操作

```typescript
// 批量更新减少请求
const { mutate } = useRealtimeQueries({
  trips: { key: 'trips', fetcher: fetchTrips },
  foods: { key: 'foods', fetcher: fetchFoods },
  attractions: { key: 'attractions', fetcher: fetchAttractions },
});
```

## 🧪 测试

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useRealtimeQuery } from '@/hooks';

test('useRealtimeQuery loads data', async () => {
  const { result } = renderHook(() =>
    useRealtimeQuery('test', async () => ({ id: 1 }))
  );

  expect(result.current.loading).toBe(true);

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.data).toEqual({ id: 1 });
});
```

## 📈 监控指标

系统内置监控：

- **连接状态**: WebSocket/SSE 连接健康度
- **同步延迟**: 离线操作同步时间
- **缓存命中率**: Cache HIT/MISS 比率
- **消息队列**: 待发送消息数量

通过 `RealtimeStatus` 组件可视化显示。

## 🔐 安全考虑

1. **认证**: WebSocket 连接需要 token 认证
2. **授权**: 频道订阅需要权限验证
3. **限流**: 消息发送频率限制
4. **加密**: 生产环境使用 WSS (WebSocket Secure)

## 📝 API 参考

详细类型定义和参数说明，请查看各文件的 TypeScript 注释。

## 🤝 贡献

提交 Issue 或 Pull Request 到项目仓库。

---

**版本**: 1.0.0  
**最后更新**: 2024-04-12  
**维护者**: 小龙虾 🦞
