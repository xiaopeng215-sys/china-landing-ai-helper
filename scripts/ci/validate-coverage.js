#!/usr/bin/env node

/**
 * 覆盖率阈值验证脚本
 * 
 * 验证代码覆盖率是否达到 CI/CD 要求
 * - 全局覆盖率 >= 80%
 * - Hooks 覆盖率 >= 75%
 */

const fs = require('fs');
const path = require('path');

const COVERAGE_SUMMARY_PATH = path.join(__dirname, '../../coverage/coverage-summary.json');

// 覆盖率阈值配置
const THRESHOLDS = {
  global: {
    lines: 80,
    statements: 80,
    functions: 80,
    branches: 80,
  },
  hooks: {
    lines: 75,
    statements: 75,
    functions: 85,
    branches: 60,
  },
};

/**
 * 读取覆盖率摘要
 */
function readCoverageSummary() {
  if (!fs.existsSync(COVERAGE_SUMMARY_PATH)) {
    console.error('❌ Coverage summary not found. Run tests with --coverage first.');
    process.exit(1);
  }
  
  return JSON.parse(fs.readFileSync(COVERAGE_SUMMARY_PATH, 'utf8'));
}

/**
 * 检查覆盖率是否达标
 */
function checkThreshold(actual, expected, type) {
  const passed = actual >= expected;
  return {
    type,
    expected,
    actual,
    passed,
    diff: actual - expected,
  };
}

/**
 * 格式化百分比
 */
function formatPct(value) {
  return `${value.toFixed(1)}%`;
}

/**
 * 主函数
 */
function main() {
  console.log('🔍 Validating coverage thresholds...\n');
  
  const coverage = readCoverageSummary();
  const total = coverage.total;
  
  if (!total) {
    console.error('❌ No coverage data found in summary');
    process.exit(1);
  }
  
  const results = [];
  let allPassed = true;
  
  // 检查全局阈值
  console.log('📊 Global Coverage Thresholds:');
  console.log('─'.repeat(60));
  
  const globalChecks = [
    checkThreshold(total.lines.pct, THRESHOLDS.global.lines, 'Lines'),
    checkThreshold(total.statements.pct, THRESHOLDS.global.statements, 'Statements'),
    checkThreshold(total.functions.pct, THRESHOLDS.global.functions, 'Functions'),
    checkThreshold(total.branches.pct, THRESHOLDS.global.branches, 'Branches'),
  ];
  
  globalChecks.forEach(check => {
    const icon = check.passed ? '✅' : '❌';
    const status = check.passed ? 'PASS' : 'FAIL';
    const sign = check.diff >= 0 ? '+' : '';
    
    console.log(`${icon} ${check.type.padEnd(15)} ${formatPct(check.actual).padStart(8)} / ${formatPct(check.expected).padStart(8)} (${sign}${check.diff.toFixed(1)}%) [${status}]`);
    
    results.push(check);
    if (!check.passed) allPassed = false;
  });
  
  console.log('');
  
  // 检查 Hooks 特定阈值
  const hooksPath = './src/hooks/';
  const hooksData = coverage[hooksPath];
  
  if (hooksData) {
    console.log('📊 Hooks Coverage Thresholds:');
    console.log('─'.repeat(60));
    
    const hooksChecks = [
      checkThreshold(hooksData.lines.pct, THRESHOLDS.hooks.lines, 'Lines'),
      checkThreshold(hooksData.statements.pct, THRESHOLDS.hooks.statements, 'Statements'),
      checkThreshold(hooksData.functions.pct, THRESHOLDS.hooks.functions, 'Functions'),
      checkThreshold(hooksData.branches.pct, THRESHOLDS.hooks.branches, 'Branches'),
    ];
    
    hooksChecks.forEach(check => {
      const icon = check.passed ? '✅' : '❌';
      const status = check.passed ? 'PASS' : 'FAIL';
      const sign = check.diff >= 0 ? '+' : '';
      
      console.log(`${icon} ${check.type.padEnd(15)} ${formatPct(check.actual).padStart(8)} / ${formatPct(check.expected).padStart(8)} (${sign}${check.diff.toFixed(1)}%) [${status}]`);
      
      results.push(check);
      if (!check.passed) allPassed = false;
    });
    
    console.log('');
  }
  
  // 输出文件覆盖率 Top 10
  console.log('📁 Top Files by Coverage:');
  console.log('─'.repeat(60));
  
  const files = Object.entries(coverage)
    .filter(([key]) => key !== 'total')
    .map(([file, data]) => ({ file, ...data }))
    .sort((a, b) => b.lines.pct - a.lines.pct)
    .slice(0, 10);
  
  files.forEach(({ file, lines }) => {
    const icon = lines.pct >= 80 ? '✅' : lines.pct >= 60 ? '⚠️' : '❌';
    console.log(`${icon} ${formatPct(lines.pct).padStart(7)} - ${file}`);
  });
  
  console.log('');
  console.log('─'.repeat(60));
  
  // 输出低覆盖率文件警告
  const lowCoverageFiles = Object.entries(coverage)
    .filter(([key, data]) => key !== 'total' && data.lines.pct < 60)
    .map(([file, data]) => ({ file, pct: data.lines.pct }));
  
  if (lowCoverageFiles.length > 0) {
    console.log('⚠️  Low Coverage Files (< 60%):');
    lowCoverageFiles.forEach(({ file, pct }) => {
      console.log(`   ${formatPct(pct)} - ${file}`);
    });
    console.log('');
  }
  
  // 最终结果
  if (allPassed) {
    console.log('✅ All coverage thresholds PASSED!');
    console.log(`   Global Lines: ${formatPct(total.lines.pct)}`);
    console.log(`   Global Statements: ${formatPct(total.statements.pct)}`);
    console.log(`   Global Functions: ${formatPct(total.functions.pct)}`);
    console.log(`   Global Branches: ${formatPct(total.branches.pct)}`);
    process.exit(0);
  } else {
    console.log('❌ Coverage thresholds FAILED!');
    console.log('   Please improve test coverage before merging.');
    process.exit(1);
  }
}

main();
