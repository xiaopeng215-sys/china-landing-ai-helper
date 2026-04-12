/**
 * PWA Icon Generator
 * Generates all required PWA icons from a source image
 * 
 * Usage: node generate-pwa-icons.js [source-image]
 * 
 * Requirements: sharp
 * npm install sharp
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Icon sizes to generate
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

// Maskable icon sizes
const MASKABLE_SIZES = [
  { size: 192, name: 'icon-maskable-192.png' },
  { size: 512, name: 'icon-maskable-512.png' },
];

// Apple touch icon sizes
const APPLE_SIZES = [
  { size: 60, name: 'apple-touch-icon-60x60.png' },
  { size: 76, name: 'apple-touch-icon-76x76.png' },
  { size: 120, name: 'apple-touch-icon-120x120.png' },
  { size: 152, name: 'apple-touch-icon-152x152.png' },
  { size: 167, name: 'apple-touch-icon-167x167.png' },
  { size: 180, name: 'apple-touch-icon-180x180.png' },
];

async function generateIcons(sourceImage, outputDir) {
  try {
    console.log(`📸 Generating icons from: ${sourceImage}`);
    
    // Ensure output directory exists
    const iconsDir = path.join(outputDir, 'icons');
    if (!fs.existsSync(iconsDir)) {
      fs.mkdirSync(iconsDir, { recursive: true });
    }

    // Generate standard icons
    for (const { size, name } of ICON_SIZES) {
      const outputPath = path.join(iconsDir, name);
      await sharp(sourceImage)
        .resize(size, size, { fit: 'cover' })
        .png()
        .toFile(outputPath);
      console.log(`✅ Generated: ${name} (${size}x${size})`);
    }

    // Generate maskable icons (with padding)
    for (const { size, name } of MASKABLE_SIZES) {
      const outputPath = path.join(iconsDir, name);
      // Create a padded version for maskable icons
      const padding = Math.floor(size * 0.2);
      await sharp(sourceImage)
        .resize(size - padding * 2, size - padding * 2, { fit: 'cover' })
        .extend({
          top: padding,
          bottom: padding,
          left: padding,
          right: padding,
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .png()
        .toFile(outputPath);
      console.log(`✅ Generated: ${name} (${size}x${size})`);
    }

    // Generate Apple touch icons
    for (const { size, name } of APPLE_SIZES) {
      const outputPath = path.join(outputDir, name);
      await sharp(sourceImage)
        .resize(size, size, { fit: 'cover' })
        .png()
        .toFile(outputPath);
      console.log(`✅ Generated: ${name} (${size}x${size})`);
    }

    // Generate main apple-touch-icon.png (180x180)
    const appleTouchPath = path.join(outputDir, 'apple-touch-icon.png');
    await sharp(sourceImage)
      .resize(180, 180, { fit: 'cover' })
      .png()
      .toFile(appleTouchPath);
    console.log(`✅ Generated: apple-touch-icon.png (180x180)`);

    console.log('\n🎉 Icon generation complete!');
    console.log(`📁 Output directory: ${iconsDir}`);
    
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    process.exit(1);
  }
}

// Update manifest.json with all icon sizes
function updateManifest(outputDir) {
  const manifestPath = path.join(outputDir, 'manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    console.log('⚠️  manifest.json not found, skipping update');
    return;
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  // Update icons array
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

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('✅ Updated manifest.json with icon references');
}

// Main execution
const sourceImage = process.argv[2] || path.join(__dirname, 'public', 'icons', 'icon-512.png');
const outputDir = path.join(__dirname, 'public');

if (!fs.existsSync(sourceImage)) {
  console.error(`❌ Source image not found: ${sourceImage}`);
  console.log('Usage: node generate-pwa-icons.js [source-image]');
  process.exit(1);
}

generateIcons(sourceImage, outputDir);
updateManifest(outputDir);
