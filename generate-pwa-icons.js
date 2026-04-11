const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// 创建输出目录
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 生成图标的函数
async function generateIcon(size, outputPath) {
  // 创建基础绿色背景
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#10B981"/>
      <text x="50%" y="50%" font-size="${size * 0.4}" text-anchor="middle" dominant-baseline="middle">🇨🇳</text>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(outputPath);
  
  console.log(`✅ 生成 ${size}x${size} 图标：${outputPath}`);
}

// 生成所有图标
async function main() {
  console.log('🚀 开始生成 PWA 图标...\n');
  
  try {
    // 生成 192x192 图标
    await generateIcon(192, path.join(iconsDir, 'icon-192.png'));
    
    // 生成 512x512 图标
    await generateIcon(512, path.join(iconsDir, 'icon-512.png'));
    
    // 生成 apple-touch-icon (180x180)
    await generateIcon(180, path.join(__dirname, 'public', 'apple-touch-icon.png'));
    
    console.log('\n✅ 所有图标生成完成！');
    console.log('\n生成的文件:');
    console.log('- public/icons/icon-192.png');
    console.log('- public/icons/icon-512.png');
    console.log('- public/apple-touch-icon.png');
  } catch (error) {
    console.error('❌ 生成图标时出错:', error.message);
    process.exit(1);
  }
}

main();
