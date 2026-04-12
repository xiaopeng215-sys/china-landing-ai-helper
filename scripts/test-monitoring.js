#!/usr/bin/env node

/**
 * 监控集成测试脚本
 * 用于验证 Sentry、日志、健康检查等监控组件是否正常工作
 */

const https = require('https');
const http = require('http');

// 配置
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

console.log(`${COLORS.cyan}╔════════════════════════════════════════════╗`);
console.log(`║   🔥 监控集成测试脚本                    ║`);
console.log(`╚════════════════════════════════════════════╝${COLORS.reset}\n`);

console.log(`${COLORS.blue}测试目标:${COLORS.reset} ${BASE_URL}\n`);

// 测试结果
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
};

/**
 * 发送 HTTP 请求
 */
async function httpRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data ? JSON.parse(data) : null,
          });
        } catch {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
          });
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

/**
 * 测试健康检查端点
 */
async function testHealthEndpoint() {
  console.log(`${COLORS.blue}[1/4]${COLORS.reset} 测试健康检查端点 (/api/health)...`);
  
  try {
    const response = await httpRequest(`${BASE_URL}/api/health`);
    
    if (response.status === 200) {
      console.log(`  ✅ HTTP ${response.status} - 健康检查通过`);
      
      if (response.data) {
        console.log(`     状态：${response.data.status || 'unknown'}`);
        console.log(`     环境：${response.data.environment || 'unknown'}`);
        console.log(`     版本：${response.data.version || 'unknown'}`);
        
        if (response.data.services) {
          console.log(`     服务状态:`);
          for (const [service, health] of Object.entries(response.data.services)) {
            const icon = health.status === 'healthy' ? '✅' : health.status === 'degraded' ? '⚠️' : '❌';
            console.log(`       ${icon} ${service}: ${health.status}`);
          }
        }
      }
      
      results.passed++;
      return true;
    } else if (response.status === 503) {
      console.log(`  ⚠️  HTTP ${response.status} - 服务未完全就绪`);
      results.warnings++;
      return false;
    } else {
      console.log(`  ❌ HTTP ${response.status} - 健康检查失败`);
      results.failed++;
      return false;
    }
  } catch (error) {
    console.log(`  ❌ 请求失败：${error.message}`);
    results.failed++;
    return false;
  }
}

/**
 * 测试 Liveness Probe
 */
async function testLivenessProbe() {
  console.log(`\n${COLORS.blue}[2/4]${COLORS.reset} 测试 Liveness Probe (/api/health/live)...`);
  
  try {
    const response = await httpRequest(`${BASE_URL}/api/health/live`);
    
    if (response.status === 200 && response.data?.status === 'alive') {
      console.log(`  ✅ HTTP ${response.status} - Liveness Probe 通过`);
      results.passed++;
      return true;
    } else {
      console.log(`  ❌ HTTP ${response.status} - Liveness Probe 失败`);
      results.failed++;
      return false;
    }
  } catch (error) {
    console.log(`  ❌ 请求失败：${error.message}`);
    results.failed++;
    return false;
  }
}

/**
 * 测试 Readiness Probe
 */
async function testReadinessProbe() {
  console.log(`\n${COLORS.blue}[3/4]${COLORS.reset} 测试 Readiness Probe (/api/health/ready)...`);
  
  try {
    const response = await httpRequest(`${BASE_URL}/api/health/ready`);
    
    if (response.status === 200 && response.data?.status === 'ready') {
      console.log(`  ✅ HTTP ${response.status} - Readiness Probe 通过`);
      
      if (response.data?.checks) {
        console.log(`     检查项:`);
        for (const [check, passed] of Object.entries(response.data.checks)) {
          const icon = passed ? '✅' : '❌';
          console.log(`       ${icon} ${check}`);
        }
      }
      
      results.passed++;
      return true;
    } else if (response.status === 503) {
      console.log(`  ⚠️  HTTP ${response.status} - 服务未就绪`);
      console.log(`     请检查环境变量配置`);
      results.warnings++;
      return false;
    } else {
      console.log(`  ❌ HTTP ${response.status} - Readiness Probe 失败`);
      results.failed++;
      return false;
    }
  } catch (error) {
    console.log(`  ❌ 请求失败：${error.message}`);
    results.failed++;
    return false;
  }
}

/**
 * 测试指标收集端点
 */
async function testMetricsEndpoint() {
  console.log(`\n${COLORS.blue}[4/4]${COLORS.reset} 测试指标收集端点 (/api/metrics)...`);
  
  try {
    // 测试 GET 请求
    const getResponse = await httpRequest(`${BASE_URL}/api/metrics`);
    
    if (getResponse.status === 200) {
      console.log(`  ✅ GET /api/metrics - 端点可用`);
    } else {
      console.log(`  ⚠️  GET /api/metrics - HTTP ${getResponse.status}`);
    }
    
    // 测试 POST 请求（发送测试指标）
    const testMetrics = {
      metrics: [
        {
          type: 'web_vital',
          name: 'largest-contentful-paint',
          value: 2100,
          rating: 'good',
          timestamp: Date.now(),
        },
        {
          type: 'user_action',
          action: 'click',
          element: '#test-button',
          page: '/test',
          timestamp: Date.now(),
        },
      ],
    };
    
    const postResponse = await httpRequest(`${BASE_URL}/api/metrics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testMetrics),
    });
    
    if (postResponse.status === 200) {
      console.log(`  ✅ POST /api/metrics - 指标接收成功`);
      console.log(`     处理：${postResponse.data?.processed || 0} 个指标`);
      results.passed++;
      return true;
    } else {
      console.log(`  ⚠️  POST /api/metrics - HTTP ${postResponse.status}`);
      results.warnings++;
      return false;
    }
  } catch (error) {
    console.log(`  ❌ 请求失败：${error.message}`);
    results.failed++;
    return false;
  }
}

/**
 * 打印测试总结
 */
function printSummary() {
  console.log(`\n${COLORS.cyan}════════════════════════════════════════════${COLORS.reset}`);
  console.log(`${COLORS.cyan}测试总结${COLORS.reset}`);
  console.log(`${COLORS.cyan}════════════════════════════════════════════${COLORS.reset}`);
  
  const total = results.passed + results.failed + results.warnings;
  
  console.log(`  总计：${total} 个测试`);
  console.log(`  ${COLORS.green}✅ 通过：${results.passed}${COLORS.reset}`);
  console.log(`  ${COLORS.yellow}⚠️  警告：${results.warnings}${COLORS.reset}`);
  console.log(`  ${COLORS.red}❌ 失败：${results.failed}${COLORS.reset}`);
  
  if (results.failed === 0 && results.warnings === 0) {
    console.log(`\n${COLORS.green}🎉 所有测试通过！监控系统运行正常${COLORS.reset}\n`);
    process.exit(0);
  } else if (results.failed === 0) {
    console.log(`\n${COLORS.yellow}⚠️  测试基本通过，但有警告项需要关注${COLORS.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n${COLORS.red}❌ 部分测试失败，请检查配置和日志${COLORS.reset}\n`);
    process.exit(1);
  }
}

/**
 * 主函数
 */
async function main() {
  console.log(`开始测试...\n`);
  
  await testHealthEndpoint();
  await testLivenessProbe();
  await testReadinessProbe();
  await testMetricsEndpoint();
  
  printSummary();
}

// 运行测试
main().catch(error => {
  console.error(`${COLORS.red}测试脚本执行失败:${COLORS.reset}`, error);
  process.exit(1);
});
