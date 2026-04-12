/**
 * Chat API 测试脚本
 * 测试 MiniMax 和 Qwen AI 集成
 */

const https = require('https');

// 配置
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || 'sk-cp-bdtFJYcr6FojRc7aQcnlFie9Tb_gvBdBUHHSbKntjIs1iB24FVaplO80DCmS9LXgl16OVMnslz5c2-VdwbuXlBLlHVkDx7bmcbVxsthvkTARsqqtAZQsopQ';
const QWEN_API_KEY = process.env.QWEN_API_KEY || 'sk-your-qwen-api-key';

const MINIMAX_API_URL = 'https://api.minimaxi.com/v1/chat/completions';
const QWEN_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

// 测试消息
const testMessages = [
  { role: 'user', content: '你好，请推荐一个北京的旅游景点' },
];

// 发送 HTTP 请求
async function sendRequest(url, apiKey, body) {
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

// 测试 MiniMax
async function testMiniMax() {
  console.log('\n🧪 测试 MiniMax API...\n');
  
  const body = {
    model: 'MiniMax-M2.7',
    messages: [
      {
        role: 'system',
        content: '你是一位专业的中国旅行规划师。请用友好、专业的语气回复。'
      },
      ...testMessages,
    ],
    temperature: 0.7,
    max_tokens: 1500,
  };

  try {
    const result = await sendRequest(MINIMAX_API_URL, MINIMAX_API_KEY, body);
    console.log('状态码:', result.status);
    
    if (result.status === 200 && result.data.choices && result.data.choices.length > 0) {
      console.log('✅ MiniMax API 调用成功！');
      console.log('回复:', result.data.choices[0].message.content.substring(0, 200) + '...');
      return true;
    } else {
      console.log('❌ MiniMax API 调用失败:', JSON.stringify(result.data, null, 2));
      return false;
    }
  } catch (error) {
    console.log('❌ MiniMax API 请求错误:', error.message);
    return false;
  }
}

// 测试 Qwen
async function testQwen() {
  console.log('\n🧪 测试 Qwen API...\n');
  
  const body = {
    model: 'qwen-plus',
    messages: [
      {
        role: 'system',
        content: '你是一位专业的中国旅行规划师。请用友好、专业的语气回复。'
      },
      ...testMessages,
    ],
    temperature: 0.7,
    max_tokens: 1500,
  };

  try {
    const result = await sendRequest(QWEN_API_URL, QWEN_API_KEY, body);
    console.log('状态码:', result.status);
    
    if (result.status === 200 && result.data.choices && result.data.choices.length > 0) {
      console.log('✅ Qwen API 调用成功！');
      console.log('回复:', result.data.choices[0].message.content.substring(0, 200) + '...');
      return true;
    } else {
      console.log('❌ Qwen API 调用失败:', JSON.stringify(result.data, null, 2));
      return false;
    }
  } catch (error) {
    console.log('❌ Qwen API 请求错误:', error.message);
    return false;
  }
}

// 主函数
async function main() {
  console.log('='.repeat(60));
  console.log('AI 对话 API 测试');
  console.log('='.repeat(60));
  
  const minimaxResult = await testMiniMax();
  const qwenResult = await testQwen();
  
  console.log('\n' + '='.repeat(60));
  console.log('测试结果汇总:');
  console.log('='.repeat(60));
  console.log(`MiniMax: ${minimaxResult ? '✅ 通过' : '❌ 失败'}`);
  console.log(`Qwen: ${qwenResult ? '✅ 通过' : '❌ 失败 (API Key 未配置)'}`);
  console.log('='.repeat(60));
  
  process.exit(minimaxResult ? 0 : 1);
}

main();
