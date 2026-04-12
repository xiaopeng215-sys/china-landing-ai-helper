/**
 * AI 对话系统完整测试脚本
 * 测试 Chat API 端点、MiniMax/Qwen 集成、前端渲染
 */

const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs');

// 配置
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || 'sk-cp-bdtFJYcr6FojRc7aQcnlFie9Tb_gvBdBUHHSbKntjIs1iB24FVaplO80DCmS9LXgl16OVMnslz5c2-VdwbuXlBLlHVkDx7bmcbVxsthvkTARsqqtAZQsopQ';
const QWEN_API_KEY = process.env.QWEN_API_KEY || 'sk-your-qwen-api-key';

const MINIMAX_API_URL = 'https://api.minimaxi.com/v1/chat/completions';
const QWEN_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

// 测试结果
const testResults = {
  timestamp: new Date().toISOString(),
  tests: [],
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
  }
};

// 发送 HTTPS 请求
async function sendHttpsRequest(url, apiKey, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(url, options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// 发送 HTTP 请求（本地测试）
async function sendHttpRequest(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = http.request(url, options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// 记录测试结果
function recordTest(name, passed, details = '') {
  testResults.summary.total++;
  if (passed) {
    testResults.summary.passed++;
  } else {
    testResults.summary.failed++;
  }
  
  testResults.tests.push({
    name,
    passed,
    details,
    timestamp: new Date().toISOString(),
  });
  
  console.log(`${passed ? '✅' : '❌'} ${name}`);
  if (details) {
    console.log(`   ${details}`);
  }
}

// 测试 1: MiniMax API 集成
async function testMiniMaxAPI() {
  console.log('\n📌 测试 1: MiniMax API 集成');
  
  const body = {
    model: 'MiniMax-M2.7',
    messages: [
      { role: 'system', content: '你是一位专业的中国旅行规划师。' },
      { role: 'user', content: '推荐一个北京的旅游景点' },
    ],
    temperature: 0.7,
    max_tokens: 1500,
  };

  try {
    const result = await sendHttpsRequest(MINIMAX_API_URL, MINIMAX_API_KEY, body);
    
    if (result.status === 200 && result.data.choices && result.data.choices.length > 0) {
      const content = result.data.choices[0].message.content;
      recordTest('MiniMax API 连接', true, `状态码：${result.status}`);
      recordTest('MiniMax 响应格式', true, `回复长度：${content.length} 字符`);
      recordTest('MiniMax 内容质量', content.length > 50, `内容预览：${content.substring(0, 100)}...`);
      return true;
    } else {
      recordTest('MiniMax API 连接', false, `状态码：${result.status}, 错误：${JSON.stringify(result.data)}`);
      return false;
    }
  } catch (error) {
    recordTest('MiniMax API 连接', false, `请求错误：${error.message}`);
    return false;
  }
}

// 测试 2: Qwen API 集成
async function testQwenAPI() {
  console.log('\n📌 测试 2: Qwen API 集成');
  
  const body = {
    model: 'qwen-plus',
    messages: [
      { role: 'system', content: '你是一位专业的中国旅行规划师。' },
      { role: 'user', content: '推荐一个上海的旅游景点' },
    ],
    temperature: 0.7,
    max_tokens: 1500,
  };

  try {
    const result = await sendHttpsRequest(QWEN_API_URL, QWEN_API_KEY, body);
    
    if (result.status === 200 && result.data.choices && result.data.choices.length > 0) {
      const content = result.data.choices[0].message.content;
      recordTest('Qwen API 连接', true, `状态码：${result.status}`);
      recordTest('Qwen 响应格式', true, `回复长度：${content.length} 字符`);
      return true;
    } else if (result.status === 401) {
      recordTest('Qwen API 连接', false, 'API Key 未配置或无效 (sk-your-qwen-api-key)');
      return false;
    } else {
      recordTest('Qwen API 连接', false, `状态码：${result.status}, 错误：${JSON.stringify(result.data)}`);
      return false;
    }
  } catch (error) {
    recordTest('Qwen API 连接', false, `请求错误：${error.message}`);
    return false;
  }
}

// 测试 3: Chat API 端点（本地）
async function testChatAPIEndpoint() {
  console.log('\n📌 测试 3: Chat API 端点 (本地)');
  
  // 检查服务器是否运行
  try {
    const result = await sendHttpRequest('http://localhost:3000/api/chat', {
      message: '你好',
      model: 'minimax',
    });
    
    if (result.status === 200 && result.data.reply) {
      recordTest('Chat API 端点', true, `状态码：${result.status}`);
      recordTest('Chat API 响应格式', true, `回复：${result.data.reply.substring(0, 50)}...`);
      return true;
    } else {
      recordTest('Chat API 端点', false, `状态码：${result.status}, 响应：${JSON.stringify(result.data)}`);
      return false;
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      recordTest('Chat API 端点', false, '服务器未运行 (localhost:3000)');
    } else {
      recordTest('Chat API 端点', false, `请求错误：${error.message}`);
    }
    return false;
  }
}

// 测试 4: 检查环境配置
async function testEnvironmentConfig() {
  console.log('\n📌 测试 4: 环境配置检查');
  
  const minimaxKeyConfigured = MINIMAX_API_KEY && !MINIMAX_API_KEY.includes('your-minimax-api-key');
  const qwenKeyConfigured = QWEN_API_KEY && !QWEN_API_KEY.includes('sk-your-qwen-api-key');
  
  recordTest('MiniMax API Key', minimaxKeyConfigured, minimaxKeyConfigured ? '已配置' : '未配置');
  recordTest('Qwen API Key', qwenKeyConfigured, qwenKeyConfigured ? '已配置' : '未配置 (使用 Mock 回复)');
  
  return minimaxKeyConfigured;
}

// 测试 5: 检查前端组件
async function testFrontendComponents() {
  console.log('\n📌 测试 5: 前端组件检查');
  
  const fs = require('fs');
  const path = require('path');
  
  const componentFiles = [
    'src/components/views/ChatView/index.tsx',
    'src/components/views/ChatView/MessageList.tsx',
    'src/components/views/ChatView/ChatInput.tsx',
    'src/app/api/chat/route.ts',
    'src/lib/ai-client.ts',
  ];
  
  let allExist = true;
  for (const file of componentFiles) {
    const fullPath = path.join('/Users/xiaopeng/.openclaw/workspace/products/china-landing-ai-helper/pwa', file);
    const exists = fs.existsSync(fullPath);
    if (!exists) {
      allExist = false;
    }
    recordTest(`组件文件：${file}`, exists, exists ? '存在' : '缺失');
  }
  
  return allExist;
}

// 测试 6: 检查结构化响应支持
async function testStructuredResponse() {
  console.log('\n📌 测试 6: 结构化响应支持');
  
  const fs = require('fs');
  const path = require('path');
  
  const routeFile = path.join('/Users/xiaopeng/.openclaw/workspace/products/china-landing-ai-helper/pwa', 'src/app/api/chat/route.ts');
  const routeContent = fs.readFileSync(routeFile, 'utf8');
  
  const hasStructuredParsing = routeContent.includes('JSON.parse') && routeContent.includes('recommendations');
  recordTest('API 结构化解析', hasStructuredParsing, hasStructuredParsing ? '支持 JSON 解析' : '不支持');
  
  const messageListFile = path.join('/Users/xiaopeng/.openclaw/workspace/products/china-landing-ai-helper/pwa', 'src/components/views/ChatView/MessageList.tsx');
  const messageListContent = fs.readFileSync(messageListFile, 'utf8');
  
  const hasCardRendering = messageListContent.includes('RecommendationCard') && messageListContent.includes('ActionButton');
  recordTest('前端卡片渲染', hasCardRendering, hasCardRendering ? '支持卡片组件' : '不支持');
  
  return hasStructuredParsing && hasCardRendering;
}

// 主函数
async function main() {
  console.log('='.repeat(70));
  console.log('🤖 AI 对话系统完整测试');
  console.log('='.repeat(70));
  
  // 执行测试
  await testEnvironmentConfig();
  await testFrontendComponents();
  await testStructuredResponse();
  await testMiniMaxAPI();
  await testQwenAPI();
  await testChatAPIEndpoint();
  
  // 输出汇总
  console.log('\n' + '='.repeat(70));
  console.log('📊 测试结果汇总');
  console.log('='.repeat(70));
  console.log(`总测试数：${testResults.summary.total}`);
  console.log(`✅ 通过：${testResults.summary.passed}`);
  console.log(`❌ 失败：${testResults.summary.failed}`);
  console.log(`成功率：${((testResults.summary.passed / testResults.summary.total) * 100).toFixed(1)}%`);
  console.log('='.repeat(70));
  
  // 保存测试结果
  const fs = require('fs');
  const reportPath = path.join('/Users/xiaopeng/.openclaw/workspace/products/china-landing-ai-helper/pwa', 'chat-api-test-results.json');
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  console.log(`\n📄 测试报告已保存：${reportPath}`);
  
  // 生成 Markdown 报告
  generateMarkdownReport();
  
  process.exit(testResults.summary.failed > 0 ? 1 : 0);
}

// 生成 Markdown 报告
function generateMarkdownReport() {
  const fs = require('fs');
  const path = require('path');
  
  const report = `# AI 对话系统测试报告

**测试时间**: ${new Date(testResults.timestamp).toLocaleString('zh-CN')}
**测试范围**: Chat API、MiniMax、Qwen、前端组件

---

## 📊 测试摘要

| 指标 | 结果 |
|------|------|
| 总测试数 | ${testResults.summary.total} |
| ✅ 通过 | ${testResults.summary.passed} |
| ❌ 失败 | ${testResults.summary.failed} |
| 成功率 | ${((testResults.summary.passed / testResults.summary.total) * 100).toFixed(1)}% |

---

## 📋 详细测试结果

${testResults.tests.map(test => `### ${test.name}
**状态**: ${test.passed ? '✅ 通过' : '❌ 失败'}
**详情**: ${test.details}
`).join('\n')}

---

## 💡 修复建议

${testResults.tests.filter(t => !t.passed).map(test => {
  if (test.name.includes('Qwen API Key')) {
    return '### Qwen API Key 配置\n1. 获取阿里云百炼 API Key: https://dashscope.console.aliyun.com/\n2. 更新 `.env.local`: `QWEN_API_KEY=sk-xxx`\n3. 重启开发服务器';
  }
  if (test.name.includes('Chat API 端点')) {
    return '### Chat API 端点\n1. 启动开发服务器：`npm run dev`\n2. 访问 http://localhost:3000\n3. 检查控制台错误日志';
  }
  return `### ${test.name}\n请检查相关配置和日志`;
}).join('\n') || '所有测试通过！无需修复'}

---

**报告生成**: 小龙虾 🦞
`;
  
  const reportPath = path.join('/Users/xiaopeng/.openclaw/workspace/products/china-landing-ai-helper/pwa', 'CHAT_API_TEST_REPORT.md');
  fs.writeFileSync(reportPath, report);
  console.log(`📄 Markdown 报告已保存：${reportPath}`);
}

main();
