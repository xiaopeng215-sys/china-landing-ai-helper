#!/usr/bin/env node

/**
 * CI 测试报告生成脚本
 * 
 * 生成 HTML 和 JSON 格式的测试报告
 * 用于 CI/CD 流水线展示和归档
 */

const fs = require('fs');
const path = require('path');

// 配置
const COVERAGE_DIR = path.join(__dirname, '../../coverage');
const REPORT_DIR = path.join(__dirname, '../../test-reports');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');

/**
 * 确保目录存在
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * 读取覆盖率摘要
 */
function readCoverageSummary() {
  const summaryPath = path.join(COVERAGE_DIR, 'coverage-summary.json');
  
  if (fs.existsSync(summaryPath)) {
    return JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
  }
  
  return null;
}

/**
 * 读取 JUnit 测试结果
 */
function readTestResults() {
  const junitPath = path.join(COVERAGE_DIR, 'junit.xml');
  
  if (fs.existsSync(junitPath)) {
    return fs.readFileSync(junitPath, 'utf8');
  }
  
  return null;
}

/**
 * 生成 JSON 报告
 */
function generateJsonReport(coverage, testResults, metadata) {
  const report = {
    timestamp: TIMESTAMP,
    status: metadata.status || 'unknown',
    summary: {
      totalTests: metadata.totalTests || 0,
      passed: metadata.passed || 0,
      failed: metadata.failed || 0,
      skipped: metadata.skipped || 0,
    },
    coverage: coverage ? {
      lines: coverage.total?.lines?.pct || 0,
      statements: coverage.total?.statements?.pct || 0,
      functions: coverage.total?.functions?.pct || 0,
      branches: coverage.total?.branches?.pct || 0,
    } : null,
    thresholds: {
      lines: 80,
      statements: 80,
      functions: 80,
      branches: 80,
    },
    passed: coverage ? coverage.total?.lines?.pct >= 80 : false,
  };
  
  const reportPath = path.join(REPORT_DIR, `test-report-${TIMESTAMP}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`✅ JSON report generated: ${reportPath}`);
  return report;
}

/**
 * 生成 HTML 报告
 */
function generateHtmlReport(coverage, metadata) {
  const coveragePct = coverage?.total?.lines?.pct || 0;
  const statusColor = coveragePct >= 80 ? '#22c55e' : '#ef4444';
  const statusText = coveragePct >= 80 ? 'PASSED' : 'FAILED';
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Report - ${TIMESTAMP}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      padding: 2rem;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
    }
    .header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    .header p { opacity: 0.9; }
    .content { padding: 2rem; }
    .status-badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-weight: bold;
      color: white;
      background: ${statusColor};
      margin-bottom: 1rem;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 2rem 0;
    }
    .metric-card {
      background: #f9fafb;
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }
    .metric-card h3 {
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 0.5rem;
    }
    .metric-card .value {
      font-size: 2rem;
      font-weight: bold;
      color: #1f2937;
    }
    .metric-card .value.pass { color: #22c55e; }
    .metric-card .value.fail { color: #ef4444; }
    .section { margin: 2rem 0; }
    .section h2 {
      font-size: 1.5rem;
      color: #1f2937;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e5e7eb;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }
    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    th {
      background: #f9fafb;
      font-weight: 600;
      color: #374151;
    }
    tr:hover { background: #f9fafb; }
    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 0.5rem;
    }
    .progress-fill {
      height: 100%;
      background: ${statusColor};
      transition: width 0.3s ease;
    }
    .footer {
      background: #f9fafb;
      padding: 1rem 2rem;
      text-align: center;
      color: #6b7280;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧪 Test Report</h1>
      <p>Generated: ${TIMESTAMP}</p>
    </div>
    
    <div class="content">
      <div class="status-badge">${statusText}</div>
      
      <div class="metrics">
        <div class="metric-card">
          <h3>Line Coverage</h3>
          <div class="value ${coveragePct >= 80 ? 'pass' : 'fail'}">${coveragePct.toFixed(1)}%</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${coveragePct}%"></div>
          </div>
        </div>
        
        <div class="metric-card">
          <h3>Statements</h3>
          <div class="value">${coverage?.total?.statements?.pct?.toFixed(1) || 0}%</div>
        </div>
        
        <div class="metric-card">
          <h3>Functions</h3>
          <div class="value">${coverage?.total?.functions?.pct?.toFixed(1) || 0}%</div>
        </div>
        
        <div class="metric-card">
          <h3>Branches</h3>
          <div class="value">${coverage?.total?.branches?.pct?.toFixed(1) || 0}%</div>
        </div>
      </div>
      
      <div class="section">
        <h2>Test Summary</h2>
        <table>
          <tr>
            <th>Metric</th>
            <th>Value</th>
            <th>Threshold</th>
            <th>Status</th>
          </tr>
          <tr>
            <td>Line Coverage</td>
            <td>${coveragePct.toFixed(1)}%</td>
            <td>80%</td>
            <td>${coveragePct >= 80 ? '✅' : '❌'}</td>
          </tr>
          <tr>
            <td>Statements</td>
            <td>${coverage?.total?.statements?.pct?.toFixed(1) || 0}%</td>
            <td>80%</td>
            <td>${(coverage?.total?.statements?.pct || 0) >= 80 ? '✅' : '❌'}</td>
          </tr>
          <tr>
            <td>Functions</td>
            <td>${coverage?.total?.functions?.pct?.toFixed(1) || 0}%</td>
            <td>80%</td>
            <td>${(coverage?.total?.functions?.pct || 0) >= 80 ? '✅' : '❌'}</td>
          </tr>
          <tr>
            <td>Branches</td>
            <td>${coverage?.total?.branches?.pct?.toFixed(1) || 0}%</td>
            <td>80%</td>
            <td>${(coverage?.total?.branches?.pct || 0) >= 80 ? '✅' : '❌'}</td>
          </tr>
        </table>
      </div>
      
      ${coverage ? `
      <div class="section">
        <h2>Coverage by File</h2>
        <table>
          <tr>
            <th>File</th>
            <th>Lines</th>
            <th>Statements</th>
            <th>Functions</th>
            <th>Branches</th>
          </tr>
          ${Object.entries(coverage).filter(([k]) => k !== 'total').map(([file, data]) => `
          <tr>
            <td>${file}</td>
            <td>${data.lines.pct.toFixed(1)}%</td>
            <td>${data.statements.pct.toFixed(1)}%</td>
            <td>${data.functions.pct.toFixed(1)}%</td>
            <td>${data.branches.pct.toFixed(1)}%</td>
          </tr>
          `).join('')}
        </table>
      </div>
      ` : ''}
    </div>
    
    <div class="footer">
      <p>Generated by CI/CD Pipeline | PWA Project</p>
    </div>
  </div>
</body>
</html>`;
  
  const reportPath = path.join(REPORT_DIR, `test-report-${TIMESTAMP}.html`);
  fs.writeFileSync(reportPath, html);
  
  console.log(`✅ HTML report generated: ${reportPath}`);
  return reportPath;
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 Generating test reports...\n');
  
  // 确保报告目录存在
  ensureDir(REPORT_DIR);
  
  // 读取覆盖率数据
  const coverage = readCoverageSummary();
  
  // 读取测试结果
  const testResults = readTestResults();
  
  // 从命令行参数或环境变量获取元数据
  const metadata = {
    status: process.env.TEST_STATUS || 'success',
    totalTests: parseInt(process.env.TOTAL_TESTS || '0'),
    passed: parseInt(process.env.PASSED_TESTS || '0'),
    failed: parseInt(process.env.FAILED_TESTS || '0'),
    skipped: parseInt(process.env.SKIPPED_TESTS || '0'),
  };
  
  // 生成报告
  const jsonReport = generateJsonReport(coverage, testResults, metadata);
  const htmlReport = generateHtmlReport(coverage, metadata);
  
  // 输出摘要
  console.log('\n📊 Test Report Summary:');
  console.log('─'.repeat(50));
  console.log(`Status: ${jsonReport.status}`);
  console.log(`Total Tests: ${jsonReport.summary.totalTests}`);
  console.log(`Passed: ${jsonReport.summary.passed}`);
  console.log(`Failed: ${jsonReport.summary.failed}`);
  console.log(`Coverage: ${jsonReport.coverage?.lines?.toFixed(1) || 'N/A'}%`);
  console.log('─'.repeat(50));
  
  // 检查是否通过阈值
  if (!jsonReport.passed) {
    console.log('\n❌ Coverage below 80% threshold!');
    process.exit(1);
  }
  
  console.log('\n✅ All reports generated successfully!');
  process.exit(0);
}

// 执行
main().catch(err => {
  console.error('❌ Error generating reports:', err);
  process.exit(1);
});
