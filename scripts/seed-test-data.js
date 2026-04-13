#!/usr/bin/env node

/**
 * 虚拟测试数据种子脚本
 * 
 * 用途：在开发/测试环境中快速创建测试数据
 * 使用：node scripts/seed-test-data.js
 */

const fs = require('fs');
const path = require('path');

// ANSI 颜色代码
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function printBanner() {
  console.log(`
${colors.cyan}${colors.bright}╔════════════════════════════════════════════════════════╗
║  🦞 China Landing AI Helper - 虚拟测试数据生成器       ║
╚════════════════════════════════════════════════════════╝${colors.reset}
`);
}

function printTestAccounts() {
  console.log(`${colors.yellow}${colors.bright}📋 测试账号列表${colors.reset}\n`);
  
  const accounts = [
    { tier: '🥈 Premium', name: '张三', email: 'zhangsan.test@example.com', interests: '美食、文化、摄影' },
    { tier: '🥉 Basic', name: '李四', email: 'lisi.test@example.com', interests: '购物、自然、徒步' },
    { tier: '🥇 VIP', name: '王五', email: 'wangwu.test@example.com', interests: '豪华、美食、历史' },
  ];
  
  console.log(`${colors.bright}所有账号密码均为：${colors.green}Test1234${colors.reset}\n`);
  
  accounts.forEach((acc, index) => {
    console.log(`${colors.cyan}${index + 1}. ${acc.tier} ${acc.name}${colors.reset}`);
    console.log(`   邮箱：${colors.yellow}${acc.email}${colors.reset}`);
    console.log(`   兴趣：${acc.interests}`);
    console.log('');
  });
}

function printDataSummary() {
  console.log(`${colors.yellow}${colors.bright}📊 测试数据概览${colors.reset}\n`);
  
  const summary = [
    { category: '会员账号', count: 3, icon: '👤' },
    { category: '会员等级', count: 4, icon: '🎫' },
    { category: '行程数据', count: 5, icon: '🗺️' },
    { category: '收藏项目', count: 11, icon: '⭐' },
    { category: '聊天会话', count: 8, icon: '💬' },
    { category: '聊天消息', count: 16, icon: '📝' },
    { category: '浏览历史', count: 14, icon: '📜' },
    { category: '积分流水', count: 17, icon: '💰' },
  ];
  
  summary.forEach(item => {
    console.log(`  ${item.icon} ${item.category.padEnd(12, ' ')} ${colors.green}${item.count}${colors.reset} 条`);
  });
  console.log('');
}

function printUsage() {
  console.log(`${colors.yellow}${colors.bright}🚀 使用方法${colors.reset}\n`);
  
  console.log(`${colors.bright}方法 1: SQL 脚本（推荐 - Supabase 环境）${colors.reset}`);
  console.log('  1. 登录 Supabase 控制台');
  console.log('  2. 打开 SQL Editor');
  console.log('  3. 复制并执行 docs/seed-test-data.sql 内容\n');
  
  console.log(`${colors.bright}方法 2: TypeScript（开发/内存模式）${colors.reset}`);
  console.log('  import { seedTestDataInMemory } from "./src/lib/seed-test-data";');
  console.log('  await seedTestDataInMemory();\n');
  
  console.log(`${colors.bright}方法 3: 自动加载（开发环境）${colors.reset}`);
  console.log('  启动开发服务器后自动加载到内存存储\n');
}

function printFilePaths() {
  console.log(`${colors.yellow}${colors.bright}📁 相关文件${colors.reset}\n`);
  
  const files = [
    { path: 'docs/seed-test-data.sql', desc: 'SQL 种子脚本' },
    { path: 'src/lib/seed-test-data.ts', desc: 'TypeScript 种子脚本' },
    { path: 'docs/TEST-DATA-GUIDE.md', desc: '使用指南文档' },
    { path: 'scripts/seed-test-data.js', desc: '本脚本' },
  ];
  
  const basePath = path.resolve(__dirname, '..');
  
  files.forEach(file => {
    const fullPath = path.join(basePath, file.path);
    const exists = fs.existsSync(fullPath);
    const status = exists ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;
    console.log(`  ${status} ${file.path}`);
    console.log(`     ${colors.cyan}${file.desc}${colors.reset}`);
  });
  console.log('');
}

function printWarnings() {
  console.log(`${colors.yellow}${colors.bright}⚠️  注意事项${colors.reset}\n`);
  
  console.log('  • 测试账号仅用于测试环境');
  console.log('  • 所有密码均为 Test1234');
  console.log('  • 内存数据在应用重启后会丢失');
  console.log('  • 生产环境请勿使用测试数据\n');
}

function main() {
  printBanner();
  printTestAccounts();
  printDataSummary();
  printUsage();
  printFilePaths();
  printWarnings();
  
  console.log(`${colors.green}${colors.bright}✅ 准备就绪！${colors.reset}`);
  console.log(`${colors.cyan}详细文档：docs/TEST-DATA-GUIDE.md${colors.reset}\n`);
}

// 运行主函数
main();
