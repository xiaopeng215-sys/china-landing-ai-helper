#!/bin/bash
# PWA 图标生成脚本

# 使用 ImageMagick 生成图标
# 如果没有安装，先安装：brew install imagemagick

# 创建基础图标 (简单的带文字图标)
convert -size 192x192 xc:'#10B981' \
  -gravity center \
  -pointsize 80 \
  -fill white \
  -annotate 0 '🇨🇳' \
  icon-192.png

convert -size 512x512 xc:'#10B981' \
  -gravity center \
  -pointsize 200 \
  -fill white \
  -annotate 0 '🇨🇳' \
  icon-512.png

# 创建 apple-touch-icon
convert -size 180x180 xc:'#10B981' \
  -gravity center \
  -pointsize 70 \
  -fill white \
  -annotate 0 '🇨🇳' \
  ../apple-touch-icon.png

echo "图标生成完成！"
ls -la
