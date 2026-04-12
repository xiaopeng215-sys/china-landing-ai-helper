-- Supabase Schema for China Landing AI Helper
-- 创建时间：2026-04-12

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 用户表
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  avatar TEXT,
  language VARCHAR(10) DEFAULT 'zh-CN',
  budget_range VARCHAR(50) DEFAULT 'medium',
  interests TEXT[] DEFAULT '{}',
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- 浏览历史表
-- ============================================
CREATE TABLE IF NOT EXISTS browse_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  page_type VARCHAR(50) NOT NULL,
  page_id VARCHAR(255) NOT NULL,
  page_title TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_browse_history_user_id ON browse_history(user_id);
CREATE INDEX IF NOT EXISTS idx_browse_history_viewed_at ON browse_history(viewed_at DESC);

-- ============================================
-- 收藏表
-- ============================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  item_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_type ON favorites(type);

-- ============================================
-- 行程表
-- ============================================
CREATE TABLE IF NOT EXISTS itineraries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  destination VARCHAR(255),
  days INTEGER DEFAULT 1,
  budget DECIMAL(10,2),
  days_plan JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_itineraries_user_id ON itineraries(user_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_created_at ON itineraries(created_at DESC);

-- ============================================
-- 聊天会话表
-- ============================================
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT DEFAULT '新对话',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated_at ON chat_sessions(updated_at DESC);

-- ============================================
-- 消息表
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  tokens INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at ASC);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- 启用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE browse_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users: 用户只能查看自己的数据
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Browse History: 用户只能管理自己的浏览历史
CREATE POLICY "Users can view own browse history"
  ON browse_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own browse history"
  ON browse_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own browse history"
  ON browse_history FOR DELETE
  USING (auth.uid() = user_id);

-- Favorites: 用户只能管理自己的收藏
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Itineraries: 用户只能管理自己的行程
CREATE POLICY "Users can view own itineraries"
  ON itineraries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own itineraries"
  ON itineraries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own itineraries"
  ON itineraries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own itineraries"
  ON itineraries FOR DELETE
  USING (auth.uid() = user_id);

-- Chat Sessions: 用户只能管理自己的会话
CREATE POLICY "Users can view own chat sessions"
  ON chat_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat sessions"
  ON chat_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat sessions"
  ON chat_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Messages: 用户只能管理自己的消息
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages"
  ON messages FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 自动更新时间触发器
-- ============================================

-- 创建函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为用户表添加触发器
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 为行程表添加触发器
CREATE TRIGGER update_itineraries_updated_at
  BEFORE UPDATE ON itineraries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 为聊天会话表添加触发器
CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 初始数据 (可选)
-- ============================================

-- 示例：插入测试用户 (密码：Test1234)
-- 注意：实际使用时应该通过注册 API 创建用户
-- INSERT INTO users (email, password_hash, name, language)
-- VALUES (
--   'test@example.com',
--   '$2a$10$...', -- bcrypt hash of 'Test1234'
--   'Test User',
--   'zh-CN'
-- );
