#!/usr/bin/env node

/**
 * 翻译文件生成脚本
 * 
 * 用法:
 *   node scripts/generate-translations.js
 * 
 * 功能:
 * 1. 从现有翻译文件提取所有 key
 * 2. 检查缺失的翻译
 * 3. 生成待翻译清单
 */

const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '../src/messages');
const LOCALES = ['en-US', 'ko-KR', 'th-TH', 'vi-VN'];

// 读取所有翻译文件
function loadTranslations() {
  const translations = {};
  
  for (const locale of LOCALES) {
    const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
    if (fs.existsSync(filePath)) {
      translations[locale] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } else {
      translations[locale] = {};
    }
  }
  
  return translations;
}

// 递归获取所有 key
function getAllKeys(obj, prefix = '') {
  const keys = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

// 检查翻译覆盖率
function checkCoverage(translations) {
  const referenceKeys = getAllKeys(translations['en-US']);
  const report = {
    total: referenceKeys.length,
    byLocale: {},
    missing: {},
  };
  
  for (const locale of LOCALES) {
    if (locale === 'en-US') continue;
    
    const localeKeys = getAllKeys(translations[locale] || {});
    const missing = referenceKeys.filter(key => !localeKeys.includes(key));
    
    report.byLocale[locale] = {
      total: localeKeys.length,
      coverage: ((localeKeys.length / referenceKeys.length) * 100).toFixed(1) + '%',
    };
    
    if (missing.length > 0) {
      report.missing[locale] = missing;
    }
  }
  
  return report;
}

// 生成待翻译文件
function generateMissingFile(missing, locale) {
  const content = {
    note: `待翻译文件 - ${locale}`,
    generated: new Date().toISOString(),
    missing: {},
  };
  
  // 按类别组织缺失的 key
  for (const key of missing[locale]) {
    const parts = key.split('.');
    const category = parts[0];
    
    if (!content.missing[category]) {
      content.missing[category] = {};
    }
    
    // 从英文获取原文
    const value = key.split('.').reduce((obj, k) => obj?.[k], translations['en-US']);
    content.missing[category][key] = value || '';
  }
  
  return content;
}

// 主函数
function main() {
  console.log('🔍 加载翻译文件...\n');
  const translations = loadTranslations();
  
  console.log('📊 检查翻译覆盖率...\n');
  const report = checkCoverage(translations);
  
  console.log(`总 Key 数：${report.total}`);
  console.log('');
  
  for (const [locale, stats] of Object.entries(report.byLocale)) {
    console.log(`${locale}:`);
    console.log(`  已翻译：${stats.total}/${report.total} (${stats.coverage})`);
    
    if (report.missing[locale]) {
      console.log(`  缺失：${report.missing[locale].length} 个`);
    }
    console.log('');
  }
  
  // 生成待翻译文件
  for (const locale of LOCALES) {
    if (locale === 'en-US') continue;
    
    if (report.missing[locale]) {
      const missingFile = generateMissingFile(report.missing, locale);
      const filePath = path.join(MESSAGES_DIR, `${locale}.missing.json`);
      
      fs.writeFileSync(filePath, JSON.stringify(missingFile, null, 2), 'utf-8');
      console.log(`✅ 生成待翻译文件：${filePath}`);
    }
  }
  
  console.log('\n✨ 完成！');
}

// 运行
const translations = loadTranslations();
main();
