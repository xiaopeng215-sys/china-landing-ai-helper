#!/usr/bin/env node
/**
 * 图片优化脚本
 * 
 * 功能:
 * 1. 将 PNG/JPG 转换为 WebP 格式
 * 2. 生成多尺寸版本 (响应式)
 * 3. 生成模糊占位符 (LQIP)
 * 4. 压缩优化
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  inputDir: path.join(__dirname, '..', 'public'),
  outputDir: path.join(__dirname, '..', 'public', 'optimized'),
  formats: ['webp'],
  sizes: {
    thumbnail: { width: 150, height: 150 },
    small: { width: 400, height: 300 },
    medium: { width: 800, height: 600 },
    large: { width: 1200, height: 900 },
  },
  quality: {
    webp: 85,
  },
  blurSize: 20, // 模糊占位符尺寸
};

// 确保输出目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 获取所有图片文件
function getImageFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory() && entry.name !== 'optimized' && entry.name !== 'icons') {
      files.push(...getImageFiles(fullPath));
    } else if (entry.isFile() && /\.(png|jpg|jpeg|gif)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// 生成模糊占位符 (LQIP)
async function generateBlurPlaceholder(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize(CONFIG.blurSize, CONFIG.blurSize, { fit: 'inside' })
      .jpeg({ quality: 50 })
      .toFile(outputPath);
    
    // 生成 base64
    const buffer = await sharp(outputPath).toBuffer();
    const base64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    
    return { path: outputPath, base64 };
  } catch (error) {
    console.error(`❌ 模糊占位符生成失败: ${inputPath}`, error.message);
    return null;
  }
}

// 优化单张图片
async function optimizeImage(inputPath) {
  const relativePath = path.relative(CONFIG.inputDir, inputPath);
  const baseName = path.basename(inputPath, path.extname(inputPath));
  const dirName = path.dirname(relativePath);
  
  console.log(`\n📷 优化: ${relativePath}`);
  
  const results = [];
  
  try {
    // 获取原图信息
    const metadata = await sharp(inputPath).metadata();
    console.log(`   原图: ${metadata.width}x${metadata.height}, ${Math.round(metadata.size / 1024)}KB`);
    
    // 为每个尺寸生成优化版本
    for (const [sizeName, dimensions] of Object.entries(CONFIG.sizes)) {
      // 如果原图小于目标尺寸，跳过
      if (metadata.width < dimensions.width && metadata.height < dimensions.height) {
        continue;
      }
      
      for (const format of CONFIG.formats) {
        const outputFileName = `${baseName}-${sizeName}.${format}`;
        const outputDir = path.join(CONFIG.outputDir, dirName);
        const outputPath = path.join(outputDir, outputFileName);
        
        ensureDir(outputDir);
        
        // 调整尺寸并转换格式
        await sharp(inputPath)
          .resize(dimensions.width, dimensions.height, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .toFormat(format, { quality: CONFIG.quality[format] })
          .toFile(outputPath);
        
        const outputStats = fs.statSync(outputPath);
        const savings = Math.round((1 - outputStats.size / metadata.size) * 100);
        
        console.log(`   ✓ ${sizeName}: ${outputPath.replace(CONFIG.outputDir + '/', '')} (${Math.round(outputStats.size / 1024)}KB, 节省 ${savings}%)`);
        
        results.push({
          size: sizeName,
          format,
          path: outputPath,
          sizeBytes: outputStats.size,
          savings,
        });
      }
    }
    
    // 生成模糊占位符
    const blurPath = path.join(CONFIG.outputDir, dirName, `${baseName}-blur.jpg`);
    const blurResult = await generateBlurPlaceholder(inputPath, blurPath);
    
    if (blurResult) {
      console.log(`   ✓ 模糊占位符: ${path.relative(CONFIG.outputDir, blurResult.path)}`);
      results.push({
        type: 'blur-placeholder',
        path: blurResult.path,
        base64: blurResult.base64,
      });
    }
    
    return results;
  } catch (error) {
    console.error(`❌ 优化失败: ${inputPath}`, error.message);
    return [];
  }
}

// 生成优化报告
function generateReport(allResults) {
  const report = {
    timestamp: new Date().toISOString(),
    totalImages: allResults.length,
    results: allResults,
    summary: {
      totalFiles: 0,
      totalOriginalSize: 0,
      totalOptimizedSize: 0,
      totalSavings: 0,
    },
  };
  
  for (const results of allResults) {
    for (const result of results) {
      if (result.sizeBytes) {
        report.summary.totalFiles++;
        report.summary.totalOptimizedSize += result.sizeBytes;
        if (result.savings) {
          report.summary.totalSavings += result.savings;
        }
      }
    }
  }
  
  if (report.summary.totalFiles > 0) {
    report.summary.averageSavings = Math.round(
      report.summary.totalSavings / report.summary.totalFiles
    );
  }
  
  return report;
}

// 主函数
async function main() {
  console.log('🚀 开始图片优化...\n');
  console.log(`输入目录: ${CONFIG.inputDir}`);
  console.log(`输出目录: ${CONFIG.outputDir}\n`);
  
  ensureDir(CONFIG.outputDir);
  
  const imageFiles = getImageFiles(CONFIG.inputDir);
  console.log(`找到 ${imageFiles.length} 张图片\n`);
  
  const allResults = [];
  
  for (const file of imageFiles) {
    const results = await optimizeImage(file);
    if (results.length > 0) {
      allResults.push({ file, results });
    }
  }
  
  // 生成报告
  const report = generateReport(allResults);
  const reportPath = path.join(CONFIG.outputDir, 'optimization-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ 图片优化完成!\n');
  console.log('📊 统计:');
  console.log(`   优化文件数：${report.summary.totalFiles}`);
  console.log(`   平均节省：${report.summary.averageSavings || 0}%`);
  console.log(`   优化后总大小：${Math.round(report.summary.totalOptimizedSize / 1024)}KB`);
  console.log(`\n📄 报告已保存：${path.relative(CONFIG.inputDir, reportPath)}`);
  console.log('='.repeat(60));
}

// 运行
main().catch(console.error);
