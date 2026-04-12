/**
 * MiniMax API 测试脚本
 * 用于验证 AI 对话集成是否正常工作
 */

const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || '';
const MINIMAX_API_URL = 'https://api.minimaxi.com/v1';

interface TestResult {
  success: boolean;
  message: string;
  response?: any;
  error?: string;
}

async function testMiniMaxAPI(): Promise<TestResult> {
  console.log('🧪 开始测试 MiniMax API 集成...\n');
  
  // 检查 API Key
  if (!MINIMAX_API_KEY || MINIMAX_API_KEY === 'your-minimax-api-key') {
    return {
      success: false,
      message: '❌ MiniMax API Key 未配置',
      error: '请在 .env.local 中配置 MINIMAX_API_KEY',
    };
  }
  
  console.log('✅ API Key 已配置');
  console.log(`   Key: ${MINIMAX_API_KEY.substring(0, 15)}...\n`);
  
  // 准备测试请求
  const testMessages = [
    { role: 'system', content: '你是一位专业的中国旅行助手。请用 JSON 格式回复，包含 text, recommendations, actions 字段。' },
    { role: 'user', content: '帮我规划上海 2 天行程' },
  ];
  
  const requestBody = {
    model: process.env.MINIMAX_MODEL || 'MiniMax-M2.7',
    messages: testMessages,
    temperature: 0.7,
    max_tokens: parseInt(process.env.MINIMAX_MAX_TOKENS || '1500'),
  };
  
  console.log('📤 发送测试请求到 MiniMax API...');
  console.log(`   URL: ${MINIMAX_API_URL}/chat/completions`);
  console.log(`   Model: ${requestBody.model}\n`);
  
  try {
    const startTime = Date.now();
    
    const response = await fetch(`${MINIMAX_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MINIMAX_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });
    
    const duration = Date.now() - startTime;
    
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: `❌ API 请求失败 (HTTP ${response.status})`,
        error: `${response.status} - ${errorText}`,
      };
    }
    
    const data = await response.json();
    
    console.log('✅ API 请求成功!');
    console.log(`   响应时间：${duration}ms`);
    console.log(`   Token 使用：${data.usage?.total_tokens || 'N/A'}`);
    console.log(`   完成原因：${data.choices[0]?.finish_reason || 'N/A'}\n`);
    
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      return {
        success: false,
        message: '❌ 响应内容为空',
        error: 'AI 返回了空内容',
      };
    }
    
    console.log('📝 AI 回复预览:');
    console.log('   ' + content.substring(0, 200) + (content.length > 200 ? '...' : '') + '\n');
    
    // 尝试解析 JSON
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('✅ 结构化响应解析成功!');
        console.log(`   text: ${parsed.text ? '✓' : '✗'}`);
        console.log(`   recommendations: ${parsed.recommendations?.length || 0} 项`);
        console.log(`   actions: ${parsed.actions?.length || 0} 项`);
        
        if (parsed.recommendations?.length > 0) {
          console.log('\n   推荐项示例:');
          parsed.recommendations.slice(0, 2).forEach((rec: any, i: number) => {
            console.log(`     ${i + 1}. ${rec.name} (${rec.type})`);
          });
        }
        
        if (parsed.actions?.length > 0) {
          console.log('\n   操作示例:');
          parsed.actions.slice(0, 2).forEach((action: any, i: number) => {
            console.log(`     ${i + 1}. ${action.text} -> ${action.provider}`);
          });
        }
      } else {
        console.log('⚠️ 响应不是 JSON 格式，可能是纯文本');
      }
    } catch (e) {
      console.log('⚠️ JSON 解析失败，响应可能是纯文本格式');
    }
    
    return {
      success: true,
      message: '✅ MiniMax API 集成测试通过',
      response: data,
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      message: '❌ 请求失败',
      error: errorMessage,
    };
  }
}

// 运行测试
testMiniMaxAPI()
  .then(result => {
    console.log('\n' + '='.repeat(50));
    console.log(result.message);
    if (result.error) {
      console.log('错误:', result.error);
    }
    console.log('='.repeat(50) + '\n');
    
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('测试脚本执行失败:', error);
    process.exit(1);
  });
