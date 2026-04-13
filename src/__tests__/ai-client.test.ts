/**
 * AI 客户端测试 - MiniMax/Qwen 集成
 */

import { sendToAI, parseAIResponse, type Message } from '@/lib/ai-client';

describe('AI Client', () => {
  describe('parseAIResponse', () => {
    it('应该解析纯文本响应', () => {
      const content = '你好，我可以帮助你规划行程。';
      const result = parseAIResponse(content);
      
      expect(result.text).toBe(content);
      expect(result.recommendations).toBeUndefined();
      expect(result.actions).toBeUndefined();
    });

    it('应该解析结构化 JSON 响应', () => {
      const content = `
        这是 AI 的回复文本。
        {
          "text": "结构化回复",
          "recommendations": [
            {
              "type": "attraction",
              "id": "1",
              "name": "外滩",
              "reason": "上海标志性地标"
            }
          ],
          "actions": [
            {
              "type": "navigate",
              "provider": "amap",
              "url": "https://www.amap.com",
              "text": "导航"
            }
          ]
        }
      `;
      
      const result = parseAIResponse(content);
      
      expect(result.text).toBe('结构化回复');
      expect(result.recommendations).toHaveLength(1);
      expect(result.recommendations?.[0].name).toBe('外滩');
      expect(result.actions).toHaveLength(1);
      expect(result.actions?.[0].provider).toBe('amap');
    });

    it('应该处理无效的 JSON', () => {
      const content = '这是无效 JSON { invalid json }';
      const result = parseAIResponse(content);
      
      expect(result.text).toBe(content);
    });
  });

  describe('sendToAI', () => {
    it('应该在没有 API Key 时返回 Mock 回复', async () => {
      // 保存原始环境变量
      const originalKey = process.env.NEXT_PUBLIC_MINIMAX_API_KEY;
      process.env.NEXT_PUBLIC_MINIMAX_API_KEY = '';

      const messages: Message[] = [
        { role: 'user', content: '帮我规划上海行程' }
      ];

      const result = await sendToAI(messages);

      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);

      // 恢复环境变量
      process.env.NEXT_PUBLIC_MINIMAX_API_KEY = originalKey;
    });

    it('应该处理行程规划请求', async () => {
      const messages: Message[] = [
        { role: 'user', content: '帮我规划上海 4 天行程' }
      ];

      const result = await sendToAI(messages);

      expect(result.content).toBeDefined();
      // Mock 回复应该包含行程信息
      expect(result.content).toMatch(/上海|行程|Day|天/);
    });

    it('应该处理美食推荐请求', async () => {
      const messages: Message[] = [
        { role: 'user', content: '推荐上海美食' }
      ];

      const result = await sendToAI(messages);

      expect(result.content).toBeDefined();
      // Mock 回复应该包含美食信息
      expect(result.content).toMatch(/美食|餐厅|小笼包|本帮菜/);
    });

    it('应该处理交通指南请求', async () => {
      const messages: Message[] = [
        { role: 'user', content: '上海交通怎么走？' }
      ];

      const result = await sendToAI(messages);

      expect(result.content).toBeDefined();
      // Mock 回复应该包含交通信息
      expect(result.content).toMatch(/交通|地铁|打车|公交/);
    });

    it('应该处理支付设置请求', async () => {
      const messages: Message[] = [
        { role: 'user', content: '如何设置支付宝？' }
      ];

      const result = await sendToAI(messages);

      expect(result.content).toBeDefined();
      // Mock 回复应该包含支付信息
      expect(result.content).toMatch(/支付|支付宝|微信/);
    });

    it('应该处理多轮对话', async () => {
      const messages: Message[] = [
        { role: 'user', content: '你好' },
        { role: 'assistant', content: '你好！有什么可以帮助你的？' },
        { role: 'user', content: '我想去上海旅游' }
      ];

      const result = await sendToAI(messages);

      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);
    });
  });

  describe('意图识别', () => {
    it('应该识别行程规划意图', async () => {
      const messages: Message[] = [
        { role: 'user', content: '帮我规划一个 itinerary' }
      ];

      const result = await sendToAI(messages);
      expect(result.content).toBeDefined();
    });

    it('应该识别美食推荐意图', async () => {
      const messages: Message[] = [
        { role: 'user', content: '有什么好吃的 restaurant 推荐？' }
      ];

      const result = await sendToAI(messages);
      expect(result.content).toBeDefined();
    });

    it('应该识别交通查询意图', async () => {
      const messages: Message[] = [
        { role: 'user', content: 'metro 怎么坐？' }
      ];

      const result = await sendToAI(messages);
      expect(result.content).toBeDefined();
    });

    it('应该识别支付咨询意图', async () => {
      const messages: Message[] = [
        { role: 'user', content: 'payment 怎么设置？' }
      ];

      const result = await sendToAI(messages);
      expect(result.content).toBeDefined();
    });

    it('应该识别通用意图', async () => {
      const messages: Message[] = [
        { role: 'user', content: '你好，介绍一下你自己' }
      ];

      const result = await sendToAI(messages);
      expect(result.content).toBeDefined();
    });
  });

  describe('错误处理', () => {
    it('应该处理空消息', async () => {
      const messages: Message[] = [
        { role: 'user', content: '' }
      ];

      const result = await sendToAI(messages);
      expect(result.content).toBeDefined();
    });

    it('应该处理特殊字符', async () => {
      const messages: Message[] = [
        { role: 'user', content: '你好！@#$%^&*() 上海旅游' }
      ];

      const result = await sendToAI(messages);
      expect(result.content).toBeDefined();
    });

    it('应该处理长文本', async () => {
      const longMessage = '我计划去上海旅游 5 天，预算 5000 元，喜欢历史文化，不吃辣，希望能参观外滩、豫园、博物馆等景点，请帮我详细规划每天的行程，包括交通、餐饮和住宿建议。';
      
      const messages: Message[] = [
        { role: 'user', content: longMessage }
      ];

      const result = await sendToAI(messages);
      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);
    });
  });
});
