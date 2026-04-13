# 虚拟测试数据使用指南

## 📋 概述

为了便于测试收藏、行程、聊天等功能，我们创建了 3 个虚拟会员账号及完整的测试数据。

## 🎯 测试账号

| 会员等级 | 姓名 | 邮箱 | 密码 | 特点 |
|---------|------|------|------|------|
| 🥈 Premium | 张三 | `zhangsan.test@example.com` | `Test1234` | 2 个行程，4 个收藏，3 个会话 |
| 🥉 Basic | 李四 | `lisi.test@example.com` | `Test1234` | 1 个行程，2 个收藏，2 个会话 |
| 🥇 VIP | 王五 | `wangwu.test@example.com` | `Test1234` | 2 个行程，5 个收藏，3 个会话，8500 积分 |

## 📊 数据概览

### 会员等级
- **免费版 (Free)**: 每日 10 次查询，基础功能
- **基础版 (Basic)**: 每日 50 次查询，优先支持，¥29/月
- **高级版 (Premium)**: 每日 200 次查询，专属客服，¥69/月
- **至尊版 (VIP)**: 无限查询，24/7 VIP 支持，¥199/月

### 测试数据包含
- ✅ 3 个会员账号（不同等级）
- ✅ 5 个完整行程（上海、北京、桂林、西安、成都）
- ✅ 11 个收藏项目（行程、美食、景点）
- ✅ 8 个聊天会话
- ✅ 16 条聊天消息（示例对话）
- ✅ 14 条浏览历史记录
- ✅ 17 条积分流水记录

## 🚀 使用方法

### 方法 1: SQL 脚本（推荐 - 生产/测试环境）

适用于已连接 Supabase 数据库的环境。

```bash
# 1. 登录 Supabase 控制台
# 2. 打开 SQL Editor
# 3. 复制并执行 pwa/docs/seed-test-data.sql 文件内容
```

或者使用 Supabase CLI：

```bash
cd products/china-landing-ai-helper/pwa
psql -h <host> -U postgres -d postgres -f docs/seed-test-data.sql
```

### 方法 2: TypeScript 脚本（开发/内存模式）

适用于本地开发环境（Supabase 未配置时使用内存存储）。

```typescript
// 在应用中导入
import { seedTestDataInMemory, printTestAccounts } from './src/lib/seed-test-data';

// 打印测试账号信息
printTestAccounts();

// 在内存中创建测试数据
await seedTestDataInMemory();
```

### 方法 3: 自动加载（开发环境）

在开发环境下，测试数据会自动加载到内存存储中。

启动开发服务器后，在控制台会看到：
```
[Seed] 开始在内存存储中创建测试数据...
[Seed] 测试账号:
  - zhangsan.test@example.com / Test1234 (Premium)
  - lisi.test@example.com / Test1234 (Basic)
  - wangwu.test@example.com / Test1234 (VIP)
```

## 🧪 测试场景

### 1. 测试收藏功能
- 登录任意测试账号
- 访问 Profile 页面
- 查看"我的收藏"标签
- 应该看到预设的收藏项目

### 2. 测试行程功能
- 登录测试账号
- 访问"我的行程"页面
- 查看预设的行程数据
- 测试行程详情、编辑、删除功能

### 3. 测试聊天功能
- 登录测试账号
- 查看聊天历史列表
- 应该看到预设的会话
- 点击进入会话查看历史消息

### 4. 测试会员功能
- 登录不同等级的账号
- 验证会员权益显示
- 测试积分查询和使用
- 验证会员等级标识

### 5. 测试浏览历史
- 访问 Profile 页面
- 查看"浏览历史"标签
- 验证历史记录显示

## 📝 数据说明

### 张三 (Premium 会员)
- **兴趣**: 美食、文化、摄影
- **行程**: 上海 4 天深度游、北京 3 天文化游
- **收藏**: 2 个行程 + 1 个美食 + 1 个景点
- **积分**: 2500 分
- **聊天**: 3 个会话（上海行程、北京美食、交通咨询）

### 李四 (Basic 会员)
- **兴趣**: 购物、自然、徒步
- **行程**: 桂林 3 天山水游
- **收藏**: 1 个行程 + 1 个景点
- **积分**: 800 分
- **聊天**: 2 个会话（桂林行程、阳朔住宿）

### 王五 (VIP 会员)
- **兴趣**: 豪华、美食、历史
- **行程**: 西安 3 天历史游、成都 3 天美食游
- **收藏**: 2 个行程 + 1 个美食 + 2 个景点
- **积分**: 8500 分
- **聊天**: 3 个会话（西安历史、成都美食、VIP 服务）

## ⚠️ 注意事项

1. **测试账号仅用于测试**：不要用于生产环境
2. **密码统一**：所有测试账号密码都是 `Test1234`
3. **内存数据会丢失**：使用内存存储时，重启应用后数据会重置
4. **邮箱格式**：测试账号邮箱都以 `.test@example.com` 结尾，便于识别
5. **数据隔离**：每个测试账号的数据相互独立，可并行测试

## 🔄 重置数据

### Supabase 环境
```sql
-- 删除测试数据（谨慎执行！）
DELETE FROM points_transactions WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE '%test@example.com'
);
DELETE FROM browse_history WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE '%test@example.com'
);
DELETE FROM messages WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE '%test@example.com'
);
DELETE FROM chat_sessions WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE '%test@example.com'
);
DELETE FROM itineraries WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE '%test@example.com'
);
DELETE FROM favorites WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE '%test@example.com'
);
DELETE FROM membership_points WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE '%test@example.com'
);
DELETE FROM user_memberships WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE '%test@example.com'
);
DELETE FROM users WHERE email LIKE '%test@example.com';
```

然后重新执行 `seed-test-data.sql`

### 内存存储环境
重启开发服务器即可重置数据。

## 📁 相关文件

- `docs/seed-test-data.sql` - SQL 种子脚本
- `src/lib/seed-test-data.ts` - TypeScript 种子脚本
- `src/lib/database.ts` - 数据库客户端和类型定义
- `src/lib/types.ts` - 类型定义
- `src/lib/mock-data.ts` - Mock 数据（旧版，已废弃）

## 🆘 常见问题

### Q: 登录后看不到测试数据？
A: 检查：
1. 是否使用了正确的测试账号登录
2. 数据库是否正确执行了种子脚本
3. 如使用内存存储，确认是否在开发模式

### Q: 如何添加更多测试数据？
A: 编辑 `seed-test-data.sql` 或 `seed-test-data.ts`，按照现有格式添加数据。

### Q: 测试数据会影响生产数据吗？
A: 不会。测试账号邮箱都有 `.test@example.com` 后缀，便于区分。但执行 SQL 脚本时仍需谨慎。

## 📞 技术支持

如有问题，请联系开发团队或查看项目文档。

---

**创建时间**: 2026-04-12  
**版本**: 1.0  
**维护者**: China Landing AI Helper Team
