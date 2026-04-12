#!/usr/bin/env node
/**
 * PWA 资源生成脚本
 * 生成所有需要的图标和截图
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const ICONS_DIR = path.join(PUBLIC_DIR, 'icons');
const SCREENSHOTS_DIR = path.join(PUBLIC_DIR, 'screenshots');

// 确保目录存在
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
  console.log('✅ 创建 icons 目录');
}

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  console.log('✅ 创建 screenshots 目录');
}

// 图标尺寸配置
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const MASKABLE_SIZES = [192, 512];

// 颜色配置
const PRIMARY_COLOR = '#ff5a5f'; // Airbnb 红
const BACKGROUND_COLOR = '#ffffff';

console.log('🎨 开始生成 PWA 资源...\n');

// 检查 ImageMagick 是否安装
try {
  execSync('convert --version', { stdio: 'ignore' });
  console.log('✅ ImageMagick 已安装');
} catch (error) {
  console.error('❌ ImageMagick 未安装');
  console.error('请运行：brew install imagemagick');
  process.exit(1);
}

// 生成基础图标
console.log('\n📱 生成基础图标...');
ICON_SIZES.forEach(size => {
  const outputFile = path.join(ICONS_DIR, `icon-${size}.png`);
  const fontSize = Math.floor(size * 0.4);
  
  try {
    execSync(`convert -size ${size}x${size} xc:'${PRIMARY_COLOR}' \
      -gravity center \
      -pointsize ${fontSize} \
      -fill white \
      -annotate 0 '🦞' \
      '${outputFile}'`);
    console.log(`  ✅ icon-${size}.png`);
  } catch (error) {
    console.error(`  ❌ icon-${size}.png 生成失败`);
  }
});

// 生成 Maskable 图标 (带安全边距)
console.log('\n🎭 生成 Maskable 图标...');
MASKABLE_SIZES.forEach(size => {
  const outputFile = path.join(ICONS_DIR, `icon-maskable-${size}.png`);
  const fontSize = Math.floor(size * 0.35); // 稍微小一点，留出安全边距
  const padding = Math.floor(size * 0.15); // 15% 安全边距
  
  try {
    // 创建带圆角背景的 maskable 图标
    execSync(`convert -size ${size}x${size} xc:'${BACKGROUND_COLOR}' \
      \( -size ${size}x${size} xc:'${PRIMARY_COLOR}' \
        -gravity center \
        -pointsize ${fontSize} \
        -fill white \
        -annotate 0 '🦞' \) \
      -gravity center \
      -composite \
      '${outputFile}'`);
    console.log(`  ✅ icon-maskable-${size}.png`);
  } catch (error) {
    console.error(`  ❌ icon-maskable-${size}.png 生成失败`);
  }
});

// 生成 Apple Touch Icon
console.log('\n🍎 生成 Apple Touch Icon...');
try {
  const outputFile = path.join(PUBLIC_DIR, 'apple-touch-icon.png');
  const size = 180;
  const fontSize = 70;
  
  execSync(`convert -size ${size}x${size} xc:'${PRIMARY_COLOR}' \
    -gravity center \
    -pointsize ${fontSize} \
    -fill white \
    -annotate 0 '🦞' \
    '${outputFile}'`);
  console.log('  ✅ apple-touch-icon.png');
} catch (error) {
  console.error('  ❌ apple-touch-icon.png 生成失败');
}

// 生成 PWA 截图 (模拟手机界面)
console.log('\n📸 生成 PWA 截图...');

const SCREENSHOT_CONFIGS = [
  {
    name: 'home',
    label: '首页 - AI 对话',
    width: 1080,
    height: 1920,
  },
  {
    name: 'chat',
    label: 'AI 聊天界面',
    width: 1080,
    height: 1920,
  },
  {
    name: 'trips',
    label: '行程规划',
    width: 1080,
    height: 1920,
  },
  {
    name: 'food',
    label: '美食推荐',
    width: 1080,
    height: 1920,
  },
  {
    name: 'transport',
    label: '交通指南',
    width: 1080,
    height: 1920,
  },
];

SCREENSHOT_CONFIGS.forEach(config => {
  const outputFile = path.join(SCREENSHOTS_DIR, `${config.name}.png`);
  
  try {
    // 创建模拟手机界面截图
    execSync(`convert -size ${config.width}x${config.height} xc:'#f9fafb' \
      -fill '#ff5a5f' \
      -gravity north \
      -pointsize 60 \
      -annotate +0+50 'China Landing AI Helper' \
      -fill '#767676' \
      -pointsize 40 \
      -annotate +0+150 '${config.label}' \
      -fill '#ff5a5f' \
      -gravity center \
      -pointsize 150 \
      -annotate 0 '💬' \
      -fill '#d1d5db' \
      -gravity south \
      -pointsize 30 \
      -annotate +0+100 '底部导航栏' \
      '${outputFile}'`);
    console.log(`  ✅ ${config.name}.png (${config.label})`);
  } catch (error) {
    console.error(`  ❌ ${config.name}.png 生成失败`);
  }
});

console.log('\n✅ PWA 资源生成完成！\n');
console.log('生成的文件:');
console.log(`  📁 ${ICONS_DIR}/`);
ICON_SIZES.forEach(size => {
  console.log(`    - icon-${size}.png`);
});
MASKABLE_SIZES.forEach(size => {
  console.log(`    - icon-maskable-${size}.png`);
});
console.log(`  📁 ${SCREENSHOTS_DIR}/`);
SCREENSHOT_CONFIGS.forEach(config => {
  console.log(`    - ${config.name}.png`);
});
console.log('\n请更新 manifest.json 以引用新生成的资源。');
