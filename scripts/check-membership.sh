#!/bin/bash

# 会员系统检查脚本
# 用于验证数据库迁移和系统完整性

set -e

echo "🦞 会员系统检查脚本"
echo "================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查项计数
PASSED=0
FAILED=0
WARNINGS=0

# 检查函数
check_file() {
    local file=$1
    local desc=$2
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $desc"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $desc"
        ((FAILED++))
    fi
}

check_dir() {
    local dir=$1
    local desc=$2
    
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $desc"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $desc"
        ((FAILED++))
    fi
}

check_content() {
    local file=$1
    local pattern=$2
    local desc=$3
    
    if grep -q "$pattern" "$file" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $desc"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $desc"
        ((FAILED++))
    fi
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "📁 检查文件结构..."
echo "--------------------------------"

check_file "$PROJECT_ROOT/docs/migrations/002-add-membership-system.sql" "会员系统迁移文件"
check_file "$PROJECT_ROOT/docs/MEMBERSHIP-SYSTEM.md" "会员系统文档"
check_file "$PROJECT_ROOT/src/lib/database.ts" "数据库客户端"
check_file "$PROJECT_ROOT/src/app/profile/page.tsx" "Profile 页面"
check_file "$PROJECT_ROOT/tests/membership.test.ts" "会员系统测试"

echo ""
echo "📋 检查数据库迁移内容..."
echo "--------------------------------"

MIGRATION_FILE="$PROJECT_ROOT/docs/migrations/002-add-membership-system.sql"

check_content "$MIGRATION_FILE" "CREATE TABLE IF NOT EXISTS membership_tiers" "会员等级表定义"
check_content "$MIGRATION_FILE" "CREATE TABLE IF NOT EXISTS user_memberships" "用户会员表定义"
check_content "$MIGRATION_FILE" "CREATE TABLE IF NOT EXISTS membership_points" "会员积分表定义"
check_content "$MIGRATION_FILE" "CREATE TABLE IF NOT EXISTS points_transactions" "积分流水表定义"
check_content "$MIGRATION_FILE" "INSERT INTO membership_tiers" "默认会员等级数据"
check_content "$MIGRATION_FILE" "ALTER TABLE users ADD COLUMN IF NOT EXISTS membership_tier" "用户表会员字段"
check_content "$MIGRATION_FILE" "ENABLE ROW LEVEL SECURITY" "RLS 安全策略"

echo ""
echo "💾 检查数据库函数..."
echo "--------------------------------"

DB_FILE="$PROJECT_ROOT/src/lib/database.ts"

check_content "$DB_FILE" "export interface MembershipTier" "会员等级接口"
check_content "$DB_FILE" "export interface UserMembership" "用户会员接口"
check_content "$DB_FILE" "export interface MembershipPoints" "会员积分接口"
check_content "$DB_FILE" "export async function getMembershipTiers" "获取会员等级函数"
check_content "$DB_FILE" "export async function getUserMembership" "获取用户会员函数"
check_content "$DB_FILE" "export async function getUserMembershipPoints" "获取用户积分函数"
check_content "$DB_FILE" "export async function addPoints" "添加积分函数"
check_content "$DB_FILE" "export async function getCompleteUserProfile" "完整用户资料函数"

echo ""
echo "🎨 检查 Profile 页面功能..."
echo "--------------------------------"

PROFILE_FILE="$PROJECT_ROOT/src/app/profile/page.tsx"

check_content "$PROFILE_FILE" "activeTab.*membership" "会员中心 Tab"
check_content "$PROFILE_FILE" "activeTab.*itineraries" "行程历史 Tab"
check_content "$PROFILE_FILE" "activeTab.*favorites" "收藏夹 Tab"
check_content "$PROFILE_FILE" "getMembershipTiers" "会员等级加载"
check_content "$PROFILE_FILE" "getUserMembership" "用户会员加载"
check_content "$PROFILE_FILE" "membershipPoints" "积分显示"
check_content "$PROFILE_FILE" "currentTier" "当前等级显示"

echo ""
echo "🧪 检查测试文件..."
echo "--------------------------------"

TEST_FILE="$PROJECT_ROOT/tests/membership.test.ts"

check_content "$TEST_FILE" "describe.*Membership Tiers" "会员等级测试"
check_content "$TEST_FILE" "describe.*User Membership" "用户会员测试"
check_content "$TEST_FILE" "describe.*Membership Points" "会员积分测试"
check_content "$TEST_FILE" "describe.*Integration Tests" "集成测试"

echo ""
echo "📊 检查结果汇总"
echo "================================"
echo -e "${GREEN}通过：$PASSED${NC}"
echo -e "${RED}失败：$FAILED${NC}"
echo -e "${YELLOW}警告：$WARNINGS${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ 所有检查通过！${NC}"
    echo ""
    echo "下一步操作："
    echo "1. 在 Supabase 中执行数据库迁移："
    echo "   psql -h <host> -U postgres -d <database> -f docs/migrations/002-add-membership-system.sql"
    echo ""
    echo "2. 验证数据："
    echo "   SELECT * FROM membership_tiers ORDER BY level;"
    echo ""
    echo "3. 运行测试："
    echo "   npm test -- membership.test.ts"
    echo ""
    echo "4. 访问 Profile 页面测试功能："
    echo "   http://localhost:3000/profile"
    exit 0
else
    echo -e "${RED}❌ 检查失败，请修复上述问题${NC}"
    exit 1
fi
