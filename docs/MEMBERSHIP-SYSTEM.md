# 会员系统文档

## 概述

会员系统包含以下核心功能：
- 会员等级制度（免费版、基础版、高级版、尊享版）
- 积分系统
- 用户 Profile 页面
- 收藏功能
- 行程历史

## 数据库表结构

### 1. membership_tiers - 会员等级表

存储所有会员等级信息。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| name | VARCHAR(50) | 等级英文名称 (free/basic/premium/vip) |
| name_zh | VARCHAR(50) | 等级中文名称 |
| level | INTEGER | 等级级别 (1-4) |
| icon | VARCHAR(50) | 等级图标 emoji |
| color | VARCHAR(50) | 等级主题色 |
| benefits | TEXT[] | 权益列表 |
| price_monthly | DECIMAL | 月费价格 |
| price_yearly | DECIMAL | 年费价格 |
| max_daily_queries | INTEGER | 每日最大查询次数 |
| max_concurrent_sessions | INTEGER | 最大并发会话数 |
| priority_support | BOOLEAN | 是否优先支持 |
| custom_themes | BOOLEAN | 是否支持自定义主题 |
| data_export | BOOLEAN | 是否支持数据导出 |

### 2. user_memberships - 用户会员表

存储用户的会员订阅信息。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 用户 ID (外键) |
| tier_id | UUID | 会员等级 ID (外键) |
| status | VARCHAR(20) | 状态 (active/expired/cancelled/trial) |
| started_at | TIMESTAMPTZ | 开始时间 |
| expires_at | TIMESTAMPTZ | 过期时间 |
| cancelled_at | TIMESTAMPTZ | 取消时间 |
| payment_method | VARCHAR(50) | 支付方式 |
| auto_renew | BOOLEAN | 是否自动续费 |

### 3. membership_points - 会员积分表

存储用户积分信息。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 用户 ID (外键) |
| points | INTEGER | 当前积分 |
| lifetime_points | INTEGER | 累计积分 |
| level | INTEGER | 积分等级 |
| last_activity_at | TIMESTAMPTZ | 最后活动时间 |

### 4. points_transactions - 积分流水表

记录所有积分变动。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 用户 ID (外键) |
| points_change | INTEGER | 积分变化量 |
| balance_after | INTEGER | 变化后余额 |
| transaction_type | VARCHAR(50) | 类型 (earn/spend/bonus/refund/adjustment) |
| reason | VARCHAR(255) | 原因 |
| reference_id | VARCHAR(255) | 关联 ID |

## 默认会员等级

### 🆓 免费版 (free)
- 等级：1
- 价格：免费
- 每日查询：10 次
- 并发会话：1 个
- 权益：
  - 每日 10 次查询
  - 基础行程规划
  - 标准响应速度
  - 基础收藏功能

### 🥉 基础版 (basic)
- 等级：2
- 价格：¥19.9/月 或 ¥199/年
- 每日查询：50 次
- 并发会话：2 个
- 权益：
  - 每日 50 次查询
  - 智能行程优化
  - 优先响应
  - 无限收藏
  - 行程历史

### 🥈 高级版 (premium)
- 等级：3
- 价格：¥49.9/月 或 ¥499/年
- 每日查询：200 次
- 并发会话：5 个
- 权益：
  - 每日 200 次查询
  - AI 深度规划
  - 快速响应
  - 多设备同步
  - 主题定制
  - 优先支持

### 🥇 尊享版 (vip)
- 等级：4
- 价格：¥99.9/月 或 ¥999/年
- 每日查询：9999 次（无限）
- 并发会话：99 个
- 权益：
  - 无限查询
  - 专属 AI 助理
  - VIP 专属通道
  - 人工客服
  - 定制主题
  - 数据导出
  - 抢先体验新功能

## API 函数

### 数据库操作函数 (database.ts)

```typescript
// 获取所有会员等级
getMembershipTiers(): Promise<MembershipTier[]>

// 获取用户会员信息
getUserMembership(userId: string): Promise<UserMembership | null>

// 获取用户积分
getUserMembershipPoints(userId: string): Promise<MembershipPoints | null>

// 初始化用户积分
initializeMembershipPoints(userId: string): Promise<boolean>

// 添加积分
addPoints(
  userId: string,
  points: number,
  reason: string,
  referenceId?: string
): Promise<boolean>

// 获取完整用户资料
getCompleteUserProfile(userId: string): Promise<{
  user: User;
  membership: UserMembership | null;
  points: MembershipPoints | null;
  stats: { itineraries: number; favorites: number; history: number };
} | null>

// 获取用户行程数量
getUserItineraryCount(userId: string): Promise<number>
```

## 部署步骤

### 1. 运行数据库迁移

```bash
# 连接到 Supabase
# 在 SQL Editor 中执行迁移脚本

# 执行迁移文件
psql -h <host> -U postgres -d <database> -f docs/migrations/002-add-membership-system.sql
```

### 2. 验证数据

```sql
-- 检查会员等级是否创建成功
SELECT * FROM membership_tiers ORDER BY level;

-- 检查视图是否创建成功
SELECT * FROM user_membership_view LIMIT 10;
```

### 3. 测试会员系统

访问 `/profile` 页面，检查以下功能：

- [ ] 个人资料页面显示正常
- [ ] 会员中心显示当前等级和权益
- [ ] 会员等级列表显示所有等级
- [ ] 积分显示正确
- [ ] 行程历史页面正常
- [ ] 收藏夹功能正常
- [ ] 设置页面正常

## 积分获取方式

建议的积分获取方式：

1. **每日签到**: +10 积分/天
2. **完成行程规划**: +50 积分/次
3. **收藏内容**: +5 积分/次
4. **分享应用**: +100 积分/次
5. **邀请好友**: +200 积分/人
6. **购买会员**: +10 积分/元

## 积分消耗方式

建议的积分消耗方式：

1. **兑换会员天数**: 100 积分 = 1 天会员
2. **优先排队**: 50 积分/次
3. **额外查询次数**: 10 积分/10 次
4. **自定义主题**: 500 积分/个

## 安全注意事项

1. **RLS 策略**: 所有表都已启用行级安全策略
2. **数据隔离**: 用户只能访问自己的数据
3. **积分事务**: 所有积分变动都有流水记录
4. **支付安全**: 支付相关操作需要后端验证

## 后续优化

1. 添加支付集成（支付宝/微信支付）
2. 实现自动续费功能
3. 添加会员试用功能
4. 实现积分商城
5. 添加会员专属内容
6. 实现会员等级升级动画

## 故障排查

### 问题：会员等级不显示

**检查**:
1. 数据库迁移是否成功执行
2. membership_tiers 表是否有数据
3. user_memberships 表是否有用户记录

### 问题：积分不更新

**检查**:
1. membership_points 表是否有用户记录
2. points_transactions 表是否有流水记录
3. 检查 RLS 策略是否阻止了写入

### 问题：Profile 页面加载失败

**检查**:
1. 浏览器控制台是否有错误
2. Supabase 连接配置是否正确
3. 检查网络请求是否成功
