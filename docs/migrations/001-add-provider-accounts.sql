-- Migration: Add provider_accounts column to users table
-- 创建时间：2026-04-12
-- 描述：支持多 OAuth 账号关联到同一用户

-- ============================================
-- 1. 添加 provider_accounts 列
-- ============================================
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS provider_accounts JSONB DEFAULT '[]'::jsonb;

-- 添加注释
COMMENT ON COLUMN users.provider_accounts IS '关联的第三方登录账号列表，格式：[{provider, provider_account_id, linked_at}]';

-- ============================================
-- 2. 添加索引以支持快速查询
-- ============================================
-- 创建 GIN 索引用于 JSONB 查询
CREATE INDEX IF NOT EXISTS idx_users_provider_accounts 
ON users USING GIN (provider_accounts);

-- ============================================
-- 3. 添加辅助函数用于查询关联账号
-- ============================================
-- 函数：检查某个 provider_account 是否已关联
CREATE OR REPLACE FUNCTION user_has_provider_account(
  user_id UUID,
  provider_name TEXT,
  account_id TEXT
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = user_id
    AND provider_accounts @> jsonb_build_array(
      jsonb_build_object(
        'provider', provider_name,
        'provider_account_id', account_id
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 4. 示例数据更新（可选）
-- ============================================
-- 如果需要为现有用户初始化空数组，可以取消注释以下语句：
-- UPDATE users SET provider_accounts = '[]' WHERE provider_accounts IS NULL;

-- ============================================
-- 5. 回滚脚本（用于需要时）
-- ============================================
-- 回滚方法：
-- ALTER TABLE users DROP COLUMN IF EXISTS provider_accounts;
-- DROP INDEX IF EXISTS idx_users_provider_accounts;
-- DROP FUNCTION IF EXISTS user_has_provider_account;

-- ============================================
-- 使用说明
-- ============================================
-- 1. 在 Supabase SQL Editor 中运行此脚本
-- 2. 或者使用 Supabase CLI: supabase db push
-- 3. 验证：SELECT id, email, provider_accounts FROM users LIMIT 5;
