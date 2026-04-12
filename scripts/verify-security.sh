#!/bin/bash
# 安全加固验证脚本
# 用途：快速验证 P0 安全修复是否生效

set -e

BASE_URL="${BASE_URL:-http://localhost:3000}"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "🔒 安全加固验证脚本"
echo "=========================================="
echo ""

# 1. 测试速率限制 (注册接口)
echo -e "${YELLOW}[1/4] 测试注册接口速率限制...${NC}"
echo "发送 5 个连续注册请求，预期第 4 个开始返回 429"

for i in {1..5}; do
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/api/auth/register" \
    -H "Content-Type: application/json" \
    -d '{"email":"test'$i'@test.com","password":"Test1234"}')
  
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)
  
  if [ "$HTTP_CODE" = "429" ]; then
    echo -e "  请求 $i: ${GREEN}✓ 429 Too Many Requests (速率限制生效)${NC}"
  elif [ "$HTTP_CODE" = "400" ] || [ "$HTTP_CODE" = "409" ]; then
    echo -e "  请求 $i: ${YELLOW}● $HTTP_CODE (正常业务响应)${NC}"
  else
    echo -e "  请求 $i: ${RED}✗ $HTTP_CODE (异常)${NC}"
  fi
done

echo ""

# 2. 测试 CSP 头
echo -e "${YELLOW}[2/4] 测试 Content-Security-Policy 头...${NC}"
HEADERS=$(curl -s -I "${BASE_URL}" | grep -i "content-security-policy")

if [ -n "$HEADERS" ]; then
  echo -e "${GREEN}✓ CSP 头已配置${NC}"
  echo "  $HEADERS" | head -c 200
  echo "..."
else
  echo -e "${RED}✗ CSP 头未配置${NC}"
fi

echo ""

# 3. 测试 Permissions-Policy 头
echo -e "${YELLOW}[3/4] 测试 Permissions-Policy 头...${NC}"
HEADERS=$(curl -s -I "${BASE_URL}" | grep -i "permissions-policy")

if [ -n "$HEADERS" ]; then
  echo -e "${GREEN}✓ Permissions-Policy 头已配置${NC}"
  echo "  $HEADERS"
else
  echo -e "${RED}✗ Permissions-Policy 头未配置${NC}"
fi

echo ""

# 4. 测试未认证访问 API
echo -e "${YELLOW}[4/4] 测试未认证访问 /api/chat...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "401" ]; then
  echo -e "${GREEN}✓ 未认证访问被拒绝 (401)${NC}"
else
  echo -e "${RED}✗ 未认证访问返回 $HTTP_CODE (应为 401)${NC}"
fi

echo ""
echo "=========================================="
echo "验证完成!"
echo "=========================================="
