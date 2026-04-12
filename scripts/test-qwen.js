#!/usr/bin/env node
/**
 * Qwen Fallback 快速测试脚本
 * 运行：node scripts/test-qwen.js
 */

// 设置测试环境
process.env.QWEN_API_KEY = process.env.QWEN_API_KEY || 'sk-your-qwen-api-key';
process.env.QWEN_MODEL = 'qwen-plus';
process.env.QWEN_MAX_TOKENS = '1500';
process.env.QWEN_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1';

console.log('🧪 Qwen AI Fallback 测试\n');
console.log('='.repeat(50));

// 测试 1: 检查配置
console.log('\n📋 测试 1: 环境配置检查');
console.log('QWEN_API_KEY:', process.env.QWEN_API_KEY ? '已配置' : '未配置');
console.log('QWEN_MODEL:', process.env.QWEN_MODEL);
console.log('QWEN_API_URL:', process.env.QWEN_API_URL);

if (process.env.QWEN_API_KEY === 'sk-your-qwen-api-key') {
  console.log('⚠️  提示：请更新 .env.local 中的 QWEN_API_KEY');
}

// 测试 2: Mock fallback
console.log('\n📋 测试 2: Mock Fallback (无有效 API Key)');
console.log('预期：应该返回 Mock 回复');

async function testMockFallback() {
  try {
    // 动态导入以使用最新代码
    const { sendToAI } = await import('../src/lib/ai-client.js');
    
    const messages = [
      { role: 'user', content: '帮我规划上海行程' }
    ];
    
    console.log('发送测试消息...');
    const response = await sendToAI(messages);
    
    console.log('✅ 收到响应');
    console.log('响应长度:', response.content.length, '字符');
    console.log('前 100 字符:', response.content.substring(0, 100) + '...');
    
    return true;
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    return false;
  }
}

// 测试 3: Qwen API (如果配置了)
async function testQwenAPI() {
  if (process.env.QWEN_API_KEY === 'sk-your-qwen-api-key') {
    console.log('\n📋 测试 3: Qwen API - 跳过 (未配置有效 API Key)');
    console.log('提示：在 .env.local 中配置 QWEN_API_KEY 后重试');
    return null;
  }
  
  console.log('\n📋 测试 3: Qwen API 调用');
  console.log('预期：应该成功调用 Qwen API');
  
  try {
    const { sendToAI } = await import('../src/lib/ai-client.js');
    
    const messages = [
      { role: 'user', content: '你好，请用中文简单介绍你自己' }
    ];
    
    console.log('发送测试消息到 Qwen API...');
    const response = await sendToAI(messages);
    
    console.log('✅ Qwen API 调用成功');
    console.log('响应:', response.content.substring(0, 150) + '...');
    
    return true;
  } catch (error) {
    console.error('❌ Qwen API 调用失败:', error.message);
    return false;
  }
}

// 运行测试
(async () => {
  await testMockFallback();
  await testQwenAPI();
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 测试完成!\n');
  
  console.log('📝 下一步:');
  console.log('1. 在 .env.local 中配置 QWEN_API_KEY');
  console.log('2. 重新运行此脚本测试 Qwen API');
  console.log('3. 查看 docs/QWEN_INTEGRATION.md 了解详细配置\n');
})();
