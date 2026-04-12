/**
 * Qwen AI Fallback 测试
 * 测试多模型 fallback 策略：MiniMax → Qwen → Mock
 */

import { sendToAI, parseAIResponse, type Message } from '../ai-client';

describe('Qwen Fallback', () => {
  beforeEach(() => {
    // 清理环境变量
    delete process.env.MINIMAX_API_KEY;
    delete process.env.QWEN_API_KEY;
  });

  test('Mock 模式 fallback', async () => {
    // 不配置任何 API Key，应该 fallback 到 Mock
    const messages: Message[] = [
      { role: 'user', content: '帮我规划上海行程' }
    ];

    const response = await sendToAI(messages);
    
    expect(response.content).toBeDefined();
    expect(response.content.length).toBeGreaterThan(0);
    console.log('✅ Mock fallback 测试通过');
  });

  test('Qwen API 调用 (如果配置了 API Key)', async () => {
    // 仅当配置了 Qwen API Key 时运行
    if (!process.env.QWEN_API_KEY || process.env.QWEN_API_KEY === 'sk-your-qwen-api-key') {
      console.log('⚠️ Qwen API Key 未配置，跳过测试');
      return;
    }

    const messages: Message[] = [
      { role: 'user', content: '你好，请介绍一下你自己' }
    ];

    try {
      const response = await sendToAI(messages);
      expect(response.content).toBeDefined();
      console.log('✅ Qwen API 测试通过');
      console.log('响应内容:', response.content.substring(0, 200));
    } catch (error) {
      console.error('❌ Qwen API 测试失败:', error);
      throw error;
    }
  });

  test('结构化响应解析', () => {
    const jsonContent = `{
      "text": "这是测试回复",
      "recommendations": [
        {
          "type": "attraction",
          "id": "test-1",
          "name": "测试景点",
          "reason": "测试理由"
        }
      ]
    }`;

    const result = parseAIResponse(jsonContent);
    
    expect(result.text).toBe('这是测试回复');
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations?.[0].name).toBe('测试景点');
    console.log('✅ 结构化响应解析测试通过');
  });

  test('纯文本 fallback', () => {
    const textContent = '这是纯文本回复，没有 JSON 格式';
    
    const result = parseAIResponse(textContent);
    
    expect(result.text).toBe(textContent);
    expect(result.recommendations).toBeUndefined();
    console.log('✅ 纯文本 fallback 测试通过');
  });
});

/**
 * 手动测试脚本 (Node.js 环境)
 * 运行：npx ts-node src/lib/__tests__/qwen-fallback.test.ts
 */
export async function manualTest() {
  console.log('🧪 开始 Qwen Fallback 手动测试...\n');

  // 测试 1: Mock 模式
  console.log('测试 1: Mock 模式 (无 API Key)');
  delete process.env.MINIMAX_API_KEY;
  delete process.env.QWEN_API_KEY;
  
  const mockResponse = await sendToAI([
    { role: 'user', content: '测试消息' }
  ]);
  console.log('Mock 响应长度:', mockResponse.content.length);
  console.log('✅ 测试 1 通过\n');

  // 测试 2: Qwen 模式 (如果配置了)
  if (process.env.QWEN_API_KEY && process.env.QWEN_API_KEY !== 'sk-your-qwen-api-key') {
    console.log('测试 2: Qwen 模式');
    delete process.env.MINIMAX_API_KEY; // 禁用 MiniMax
    
    try {
      const qwenResponse = await sendToAI([
        { role: 'user', content: '你好，请用中文介绍你自己' }
      ]);
      console.log('Qwen 响应:', qwenResponse.content.substring(0, 100) + '...');
      console.log('✅ 测试 2 通过\n');
    } catch (error) {
      console.error('❌ Qwen 测试失败:', error);
    }
  } else {
    console.log('⚠️ Qwen API Key 未配置，跳过测试 2\n');
  }

  console.log('🎉 所有测试完成!');
}

// 如果直接运行此文件
if (require.main === module) {
  manualTest().catch(console.error);
}
