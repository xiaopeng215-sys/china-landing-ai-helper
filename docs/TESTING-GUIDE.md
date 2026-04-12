# 会员系统测试指南

## 前置条件

1. **Supabase 配置**
   - 确保 `.env.local` 文件包含正确的 Supabase 配置
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **数据库迁移**
   ```bash
   # 在 Supabase SQL Editor 中执行
   # 文件位置：docs/migrations/002-add-membership-system.sql
   ```

3. **依赖安装**
   ```bash
   npm install
   ```

## 测试步骤

### 1. 运行检查脚本

```bash
cd products/china-landing-ai-helper/pwa
./scripts/check-membership.sh
```

**预期输出**:
```
🦞 会员系统检查脚本
================================
📁 检查文件结构...
✓ 会员系统迁移文件
✓ 会员系统文档
✓ 数据库客户端
✓ Profile 页面
✓ 会员系统测试
...
✅ 所有检查通过！
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 访问 Profile 页面

打开浏览器访问：`http://localhost:3000/profile`

### 4. 功能测试清单

#### 4.1 个人资料页面 (/profile)

- [ ] **页面加载**
  - 页面正常加载，无错误
  - 用户头像和名称显示正确
  - 会员等级徽章显示（如果有）

- [ ] **统计卡片**
  - 行程数量显示正确
  - 收藏数量显示正确
  - 历史数量显示正确
  - 积分数量显示正确

- [ ] **会员卡片**
  - 会员等级图标显示
  - 等级名称显示
  - 有效期显示（如果有）
  - 每日查询次数显示
  - 并发会话数显示

- [ ] **快捷操作**
  - "安装应用"按钮可点击
  - "导出数据"按钮可点击并下载 JSON 文件

#### 4.2 会员中心 (/profile?tab=membership)

- [ ] **当前会员信息**
  - 会员等级图标和名称
  - 会员状态（active/expired）
  - 有效期进度条
  - 权益列表
  - 当前积分和累计积分

- [ ] **会员等级列表**
  - 免费版显示正确
  - 基础版显示正确（¥19.9/月）
  - 高级版显示正确（¥49.9/月）
  - 尊享版显示正确（¥99.9/月）
  - 当前等级标记正确
  - 升级按钮显示（非当前等级）

#### 4.3 我的行程 (/profile?tab=itineraries)

- [ ] **行程列表**
  - 行程标题显示
  - 目的地显示
  - 天数显示
  - 创建时间显示

- [ ] **空状态**
  - 无行程时显示提示
  - "创建第一个行程"按钮可点击

#### 4.4 浏览历史 (/profile?tab=history)

- [ ] **历史记录**
  - 页面标题显示
  - 查看时间显示
  - 页面类型标签显示

- [ ] **清除功能**
  - "清除历史"按钮可点击
  - 确认后历史记录清空

- [ ] **空状态**
  - 无历史时显示提示

#### 4.5 收藏夹 (/profile?tab=favorites)

- [ ] **收藏列表**
  - 收藏项目显示
  - 收藏类型图标（行程/美食/景点）
  - 移除按钮可点击

- [ ] **空状态**
  - 无收藏时显示提示
  - "去探索"按钮可点击

#### 4.6 设置 (/profile?tab=settings)

- [ ] **账号设置**
  - 邮箱显示（只读）
  - "修改密码"按钮可点击

- [ ] **偏好设置**
  - 语言选择器工作正常
  - 预算选择器工作正常
  - 主题选择器工作正常
  - 通知开关工作正常
  - "保存设置"按钮保存成功

- [ ] **危险区域**
  - "删除账号"按钮显示
  - 删除确认模态框显示
  - 二次确认提示清晰

#### 4.7 模态框

- [ ] **密码修改模态框**
  - 当前密码输入框
  - 新密码输入框
  - 确认密码输入框
  - 密码验证逻辑
  - 取消按钮关闭模态框
  - 确认按钮提交修改

- [ ] **删除账号模态框**
  - 警告图标显示
  - 警告信息清晰
  - 取消按钮关闭模态框
  - 确认按钮执行删除

### 5. 数据库验证

#### 5.1 检查会员等级数据

```sql
SELECT * FROM membership_tiers ORDER BY level;
```

**预期结果**:
```
name    | name_zh | level | icon | color   | price_monthly
--------|---------|-------|------|---------|--------------
free    | 免费版   | 1     | 🆓   | #767676 | 0
basic   | 基础版   | 2     | 🥉   | #cd7f32 | 19.9
premium | 高级版   | 3     | 🥈   | #c0c0c0 | 49.9
vip     | 尊享版   | 4     | 🥇   | #ffd700 | 99.9
```

#### 5.2 检查视图

```sql
SELECT * FROM user_membership_view LIMIT 10;
```

#### 5.3 检查 RLS 策略

```sql
-- 检查会员等级表策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'membership_tiers';

-- 检查用户会员表策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'user_memberships';
```

### 6. API 测试

#### 6.1 测试会员等级查询

```typescript
// 在浏览器控制台执行
const { getMembershipTiers } = await import('@/lib/database');
const tiers = await getMembershipTiers();
console.log('会员等级:', tiers);
```

#### 6.2 测试用户会员查询

```typescript
// 需要先登录获取用户 ID
const { getUserMembership } = await import('@/lib/database');
const membership = await getUserMembership('user-id');
console.log('用户会员:', membership);
```

#### 6.3 测试积分查询

```typescript
const { getUserMembershipPoints } = await import('@/lib/database');
const points = await getUserMembershipPoints('user-id');
console.log('用户积分:', points);
```

### 7. 响应式测试

- [ ] **移动端 (< 640px)**
  - 页面布局正常
  - 触摸反馈正常
  - 导航栏可滚动

- [ ] **平板端 (640px - 1024px)**
  - 页面布局正常
  - 卡片排列合理

- [ ] **桌面端 (> 1024px)**
  - 页面居中显示
  - 最大宽度限制生效

### 8. 性能测试

- [ ] **首次加载**
  - 页面加载时间 < 3 秒
  - 首屏渲染正常

- [ ] **数据加载**
  - 会员数据加载 < 1 秒
  - 加载动画显示正常

- [ ] **交互响应**
  - Tab 切换流畅
  - 按钮点击响应及时

### 9. 兼容性测试

- [ ] **Chrome** - 最新版本
- [ ] **Safari** - 最新版本
- [ ] **Firefox** - 最新版本
- [ ] **Edge** - 最新版本
- [ ] **移动浏览器** - iOS Safari, Chrome Mobile

## 常见问题

### Q: 会员等级不显示
**A**: 检查数据库迁移是否执行成功，验证 membership_tiers 表有数据。

### Q: 积分显示为 0
**A**: 新用户需要初始化积分，调用 `initializeMembershipPoints(userId)`。

### Q: Profile 页面加载失败
**A**: 检查 Supabase 环境变量配置，确保 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY 正确。

### Q: 样式显示异常
**A**: 清除浏览器缓存，重新加载页面。检查 globals.css 是否包含必要的动画类。

## 测试报告模板

```markdown
# 会员系统测试报告

**测试日期**: YYYY-MM-DD
**测试人员**: [姓名]
**测试环境**: [开发/测试/生产]

## 测试结果

| 测试项 | 状态 | 备注 |
|--------|------|------|
| 个人资料页面 | ✅/❌ | |
| 会员中心 | ✅/❌ | |
| 我的行程 | ✅/❌ | |
| 浏览历史 | ✅/❌ | |
| 收藏夹 | ✅/❌ | |
| 设置页面 | ✅/❌ | |

## 发现的问题

1. [问题描述]
   - 严重程度：高/中/低
   - 复现步骤：...
   - 预期结果：...
   - 实际结果：...

## 建议

1. [改进建议]
```

## 下一步

测试完成后：
1. 修复发现的问题
2. 更新测试报告
3. 准备部署到生产环境
4. 监控用户反馈
