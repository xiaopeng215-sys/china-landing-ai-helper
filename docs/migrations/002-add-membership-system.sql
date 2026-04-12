-- Migration: Add Membership System
-- 创建时间：2026-04-12
-- 描述：添加会员等级系统

-- ============================================
-- 会员等级表
-- ============================================
CREATE TABLE IF NOT EXISTS membership_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL UNIQUE,
  name_zh VARCHAR(50) NOT NULL,
  level INTEGER NOT NULL UNIQUE,
  icon VARCHAR(50) NOT NULL,
  color VARCHAR(50) NOT NULL,
  benefits TEXT[] DEFAULT '{}',
  price_monthly DECIMAL(10,2) DEFAULT 0,
  price_yearly DECIMAL(10,2) DEFAULT 0,
  max_daily_queries INTEGER DEFAULT 10,
  max_concurrent_sessions INTEGER DEFAULT 1,
  priority_support BOOLEAN DEFAULT FALSE,
  custom_themes BOOLEAN DEFAULT FALSE,
  data_export BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_membership_tiers_level ON membership_tiers(level);

-- ============================================
-- 用户会员表
-- ============================================
CREATE TABLE IF NOT EXISTS user_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES membership_tiers(id),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'trial')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  payment_method VARCHAR(50),
  auto_renew BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_memberships_user_id ON user_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_user_memberships_status ON user_memberships(status);
CREATE INDEX IF NOT EXISTS idx_user_memberships_expires_at ON user_memberships(expires_at);

-- ============================================
-- 会员积分表
-- ============================================
CREATE TABLE IF NOT EXISTS membership_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  lifetime_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_membership_points_user_id ON membership_points(user_id);

-- ============================================
-- 积分流水表
-- ============================================
CREATE TABLE IF NOT EXISTS points_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  points_change INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('earn', 'spend', 'bonus', 'refund', 'adjustment')),
  reason VARCHAR(255) NOT NULL,
  reference_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_points_transactions_user_id ON points_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_created_at ON points_transactions(created_at DESC);

-- ============================================
-- 插入默认会员等级数据
-- ============================================
INSERT INTO membership_tiers (name, name_zh, level, icon, color, benefits, price_monthly, price_yearly, max_daily_queries, max_concurrent_sessions, priority_support, custom_themes, data_export) VALUES
  ('free', '免费版', 1, '🆓', '#767676', 
   ARRAY['每日 10 次查询', '基础行程规划', '标准响应速度', '基础收藏功能'], 
   0, 0, 10, 1, FALSE, FALSE, FALSE),
  
  ('basic', '基础版', 2, '🥉', '#cd7f32', 
   ARRAY['每日 50 次查询', '智能行程优化', '优先响应', '无限收藏', '行程历史'], 
   19.9, 199, 50, 2, FALSE, FALSE, TRUE),
  
  ('premium', '高级版', 3, '🥈', '#c0c0c0', 
   ARRAY['每日 200 次查询', 'AI 深度规划', '快速响应', '多设备同步', '主题定制', '优先支持'], 
   49.9, 499, 200, 5, TRUE, TRUE, TRUE),
  
  ('vip', '尊享版', 4, '🥇', '#ffd700', 
   ARRAY['无限查询', '专属 AI 助理', 'VIP 专属通道', '人工客服', '定制主题', '数据导出', '抢先体验新功能'], 
   99.9, 999, 9999, 99, TRUE, TRUE, TRUE)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 更新 users 表添加会员相关字段
-- ============================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS membership_tier VARCHAR(50) DEFAULT 'free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS membership_points INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_users_membership_tier ON users(membership_tier);

-- ============================================
-- 为 user_memberships 添加触发器
-- ============================================
CREATE TRIGGER update_user_memberships_updated_at
  BEFORE UPDATE ON user_memberships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_membership_points_updated_at
  BEFORE UPDATE ON membership_points
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security Policies
-- ============================================

ALTER TABLE membership_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;

-- Membership Tiers: 所有人可读
CREATE POLICY "Everyone can view membership tiers"
  ON membership_tiers FOR SELECT
  USING (TRUE);

-- User Memberships: 用户只能查看自己的会员信息
CREATE POLICY "Users can view own membership"
  ON user_memberships FOR SELECT
  USING (auth.uid() = user_id);

-- Membership Points: 用户只能查看自己的积分
CREATE POLICY "Users can view own points"
  ON membership_points FOR SELECT
  USING (auth.uid() = user_id);

-- Points Transactions: 用户只能查看自己的积分流水
CREATE POLICY "Users can view own points transactions"
  ON points_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- 创建视图：用户会员信息
-- ============================================
CREATE OR REPLACE VIEW user_membership_view AS
SELECT 
  u.id as user_id,
  u.email,
  u.name,
  u.membership_tier,
  u.membership_points,
  u.is_premium,
  mt.name as tier_name,
  mt.name_zh as tier_name_zh,
  mt.level as tier_level,
  mt.icon as tier_icon,
  mt.color as tier_color,
  mt.benefits as tier_benefits,
  um.status as membership_status,
  um.started_at,
  um.expires_at,
  um.auto_renew
FROM users u
LEFT JOIN user_memberships um ON u.id = um.user_id AND um.status = 'active'
LEFT JOIN membership_tiers mt ON um.tier_id = mt.id;
