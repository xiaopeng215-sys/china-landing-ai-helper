#!/bin/bash
# 语言支持修复验证脚本

echo "🔍 验证语言支持修复..."
echo ""

# 1. 检查 i18n 配置
echo "1️⃣  检查 i18n 配置..."
if grep -q "zh-CN" src/lib/i18n/config.ts && grep -q "defaultLocale: Locale = 'zh-CN'" src/lib/i18n/config.ts; then
  echo "   ✅ i18n 配置已更新 (zh-CN 为默认)"
else
  echo "   ❌ i18n 配置未正确更新"
fi

# 2. 检查 middleware
echo "2️⃣  检查 middleware 配置..."
if grep -q "zh-CN" middleware.ts && grep -q "defaultLocale = 'zh-CN'" middleware.ts; then
  echo "   ✅ middleware 已更新 (支持中文路由)"
else
  echo "   ❌ middleware 未正确更新"
fi

# 3. 检查语言检测中间件
echo "3️⃣  检查语言检测中间件..."
if [ -f "src/app/api/middleware/language-detector.ts" ]; then
  echo "   ✅ 语言检测中间件已创建"
else
  echo "   ❌ 语言检测中间件未创建"
fi

# 4. 检查 AI 客户端
echo "4️⃣  检查 AI 客户端 Prompt..."
if grep -q "始终使用简体中文回复" src/lib/ai-client.ts; then
  echo "   ✅ AI Prompt 已更新 (强制中文)"
else
  echo "   ❌ AI Prompt 未正确更新"
fi

# 5. 检查 Chat API
echo "5️⃣  检查 Chat API 语言检测..."
if grep -q "detectMessageLanguage" src/app/api/chat/route.ts; then
  echo "   ✅ Chat API 已集成语言检测"
else
  echo "   ❌ Chat API 未集成语言检测"
fi

# 6. 检查翻译文件
echo "6️⃣  检查翻译文件..."
if [ -f "src/messages/zh-CN.json" ]; then
  echo "   ✅ 中文翻译文件存在"
else
  echo "   ❌ 中文翻译文件缺失"
fi

# 7. 检查语言切换组件
echo "7️⃣  检查语言切换组件..."
if [ -f "src/components/LocaleSwitcher.tsx" ]; then
  echo "   ✅ 语言切换组件存在"
else
  echo "   ❌ 语言切换组件缺失"
fi

echo ""
echo "📊 验证完成!"
echo ""
echo "📁 修改文件列表:"
echo "   - src/lib/i18n/config.ts"
echo "   - middleware.ts"
echo "   - src/lib/ai-client.ts"
echo "   - src/app/api/chat/route.ts"
echo "   - src/app/api/middleware/language-detector.ts (新增)"
echo "   - src/messages/zh-CN.json (已存在)"
echo "   - src/components/LocaleSwitcher.tsx (已存在)"
echo ""
echo "📖 详细报告：LANGUAGE_FIX_REPORT.md"
