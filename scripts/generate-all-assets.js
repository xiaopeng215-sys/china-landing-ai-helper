/**
 * PWA 所有资源生成脚本
 * 生成图标、maskable 图标和截图占位符
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const ICONS_DIR = path.join(PUBLIC_DIR, 'icons');
const SCREENSHOTS_DIR = path.join(PUBLIC_DIR, 'screenshots');

// 确保目录存在
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// 图标尺寸配置
const ICON_SIZES = [
  { size: 72, name: 'icon-72.png' },
  { size: 96, name: 'icon-96.png' },
  { size: 128, name: 'icon-128.png' },
  { size: 144, name: 'icon-144.png' },
  { size: 152, name: 'icon-152.png' },
  { size: 192, name: 'icon-192.png' },
  { size: 384, name: 'icon-384.png' },
  { size: 512, name: 'icon-512.png' },
];

const MASKABLE_SIZES = [
  { size: 192, name: 'icon-maskable-192.png' },
  { size: 512, name: 'icon-maskable-512.png' },
];

const APPLE_SIZE = 180;

// 颜色配置
const PRIMARY_COLOR = '#ff5a5f';
const BACKGROUND_COLOR = '#ffffff';

async function createBaseIcon(size) {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${PRIMARY_COLOR}"/>
      <circle cx="${size/2}" cy="${size/2}" r="${size * 0.35}" fill="${BACKGROUND_COLOR}" opacity="0.2"/>
      <text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" font-size="${size * 0.45}" font-weight="bold" font-family="Arial, sans-serif" fill="${BACKGROUND_COLOR}">AI</text>
    </svg>
  `;
  return await sharp(Buffer.from(svg)).png().toBuffer();
}

async function createMaskableIcon(size) {
  const padding = Math.floor(size * 0.2);
  const iconSize = size - padding * 2;
  const radius = iconSize * 0.2;
  
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${BACKGROUND_COLOR}"/>
      <rect x="${padding}" y="${padding}" width="${iconSize}" height="${iconSize}" rx="${radius}" fill="${PRIMARY_COLOR}"/>
      <text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" font-size="${size * 0.3}" font-weight="bold" font-family="Arial, sans-serif" fill="${BACKGROUND_COLOR}">AI</text>
    </svg>
  `;
  return await sharp(Buffer.from(svg)).png().toBuffer();
}

async function createScreenshot(width, height, title) {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#f9fafb;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f3f4f6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad)"/>
      <rect width="${width}" height="44" fill="#ffffff"/>
      <text x="20" y="28" font-size="16" font-family="Arial, sans-serif">9:41</text>
      <text x="${width/2}" y="100" text-anchor="middle" font-size="32" font-weight="bold" font-family="Arial, sans-serif" fill="${PRIMARY_COLOR}">China Landing AI Helper</text>
      <text x="${width/2}" y="140" text-anchor="middle" font-size="20" font-family="Arial, sans-serif" fill="#767676">${title}</text>
      <rect x="40" y="200" width="${width - 80}" height="${height - 400}" rx="12" fill="#ffffff" opacity="0.8"/>
      <circle cx="${width/2}" cy="${height/2 - 40}" r="80" fill="${PRIMARY_COLOR}" opacity="0.1"/>
      <text x="${width/2}" y="${height/2}" text-anchor="middle" font-size="80" font-weight="bold" font-family="Arial, sans-serif" fill="${PRIMARY_COLOR}">AI</text>
      <rect x="80" y="${height/2 + 80}" width="${width - 160}" height="60" rx="30" fill="#ff5a5f" opacity="0.9"/>
      <text x="${width/2}" y="${height/2 + 118}" text-anchor="middle" font-size="18" font-family="Arial, sans-serif" fill="#ffffff">你好！我是你的 AI 旅行助手</text>
      <rect width="${width}" height="80" y="${height - 80}" fill="#ffffff"/>
      <rect width="${width}" height="1" y="${height - 80}" fill="#e5e7eb"/>
    </svg>
  `;
  return await sharp(Buffer.from(svg)).png().toBuffer();
}

async function generateAllAssets() {
  console.log('🎨 开始生成 PWA 资源...\n');
  
  console.log('📱 生成标准图标...');
  for (const { size, name } of ICON_SIZES) {
    const outputPath = path.join(ICONS_DIR, name);
    const buffer = await createBaseIcon(size);
    await sharp(buffer).toFile(outputPath);
    console.log(`  ✅ ${name} (${size}x${size})`);
  }
  
  console.log('\n🎭 生成 Maskable 图标...');
  for (const { size, name } of MASKABLE_SIZES) {
    const outputPath = path.join(ICONS_DIR, name);
    const buffer = await createMaskableIcon(size);
    await sharp(buffer).toFile(outputPath);
    console.log(`  ✅ ${name} (${size}x${size})`);
  }
  
  console.log('\n🍎 生成 Apple Touch Icon...');
  const appleTouchPath = path.join(PUBLIC_DIR, 'apple-touch-icon.png');
  const appleBuffer = await createBaseIcon(APPLE_SIZE);
  await sharp(appleBuffer).toFile(appleTouchPath);
  console.log(`  ✅ apple-touch-icon.png (${APPLE_SIZE}x${APPLE_SIZE})`);
  
  console.log('\n📸 生成 PWA 截图...');
  const screenshots = [
    { name: 'home', title: '首页 - AI 对话' },
    { name: 'chat', title: 'AI 聊天界面' },
    { name: 'trips', title: '行程规划' },
    { name: 'food', title: '美食推荐' },
    { name: 'transport', title: '交通指南' },
  ];
  
  for (const { name, title } of screenshots) {
    const outputPath = path.join(SCREENSHOTS_DIR, `${name}.png`);
    const buffer = await createScreenshot(1080, 1920, title);
    await sharp(buffer).toFile(outputPath);
    console.log(`  ✅ ${name}.png - ${title}`);
  }
  
  console.log('\n📝 更新 manifest.json...');
  const manifestPath = path.join(PUBLIC_DIR, 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    manifest.icons = [
      ...ICON_SIZES.map(({ size, name }) => ({
        src: `/icons/${name}`,
        sizes: `${size}x${size}`,
        type: 'image/png',
        purpose: 'any',
      })),
      ...MASKABLE_SIZES.map(({ size, name }) => ({
        src: `/icons/${name}`,
        sizes: `${size}x${size}`,
        type: 'image/png',
        purpose: 'maskable',
      })),
    ];
    
    manifest.screenshots = screenshots.map(({ name }) => ({
      src: `/screenshots/${name}.png`,
      sizes: '1080x1920',
      type: 'image/png',
      form_factor: 'narrow',
      label: name.charAt(0).toUpperCase() + name.slice(1),
    }));
    
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('  ✅ manifest.json 已更新');
  }
  
  console.log('\n✅ 所有 PWA 资源生成完成！\n');
}

generateAllAssets().catch(error => {
  console.error('❌ 生成资源失败:', error);
  process.exit(1);
});
