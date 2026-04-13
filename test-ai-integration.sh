#!/bin/bash

# AI 集成测试脚本
# 用于验证 AI API 是否正常工作

echo "🔍 测试 AI 集成..."
echo ""

# 测试本地 API
echo "📍 测试本地 API 端点..."
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "你好，帮我介绍一下上海"}' \
  2>/dev/null | jq '.' || echo "⚠️ 本地服务未运行，跳过本地测试"

echo ""

# 测试生产环境 API
echo "📍 测试生产环境 API..."
RESPONSE=$(curl -s -X POST https://www.travelerlocal.ai/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "你好，帮我介绍一下上海"}')

echo "$RESPONSE" | jq '.' 2>/dev/null || echo "⚠️ 生产环境 API 测试失败"

echo ""

# 测试健康检查
echo "📍 测试健康检查端点..."
curl -s https://www.travelerlocal.ai/api/health/ready | jq '.'

echo ""
echo "✅ AI 集成测试完成！"
