/**
 * AI 客户端 - 多模型集成 (MiniMax + Qwen + Mock)
 * Fallback 策略：MiniMax → Qwen → Mock
 */

// MiniMax 配置
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || '';
const MINIMAX_API_URL = 'https://api.minimaxi.com/v1';

// Qwen 配置 (阿里云百炼)
const QWEN_API_KEY = process.env.QWEN_API_KEY || '';
const QWEN_API_URL = process.env.QWEN_API_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1';

// AI 模型优先级配置
export type AIModel = 'minimax' | 'qwen' | 'mock';
export const AI_MODEL_PRIORITY: AIModel[] = ['minimax', 'qwen', 'mock'];

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  content: string;
  usage?: {
    total_tokens: number;
  };
}

/**
 * 结构化 AI 响应 - 支持卡片、链接和图片
 */
export interface StructuredAIResponse {
  text: string;              // AI 文本回复
  recommendations?: {
    type: 'attraction' | 'restaurant' | 'transport' | 'hotel';
    id: string;              // 本地数据 ID
    name: string;            // 名称
    nameEn?: string;         // 英文名
    reason: string;          // 推荐理由
    price?: string;          // 价格
    location?: string;       // 位置
    image?: string;          // 图片 URL
  }[];
  actions?: {
    type: 'book' | 'navigate' | 'info';
    provider: 'klook' | 'trip' | 'amap' | 'didi' | 'meituan';
    url: string;             // 链接
    text: string;            // 按钮文字
  }[];
  images?: {
    url: string;             // 图片 URL
    caption: string;         // 图片说明
  }[];
}

/**
 * 旅行规划 Prompt 模板
 */
const PROMPT_TEMPLATES = {
  itinerary: `你是一位专业的中国旅行规划师。请根据用户的偏好和预算，生成个性化的行程建议。

用户偏好：{preferences}
预算范围：{budget}
旅行天数：{days}
目的地：{destination}

请生成：
1. 每日行程概览
2. 推荐景点 (含门票价格)
3. 推荐餐厅 (含人均消费)
4. 交通建议
5. 实用提示

请用友好、专业的语气回复。`,

  food: `你是一位中国美食专家。请根据用户的口味和预算，推荐地道的美食。

用户口味：{taste}
预算范围：{budget}
目的地：{destination}
饮食限制：{restrictions}

请推荐：
1. 必吃美食 (3-5 道)
2. 推荐餐厅 (含地址、人均消费)
3. 点菜建议
4. 用餐礼仪提示

请用热情、专业的语气回复。`,

  transport: `你是一位中国交通导航专家。请为用户提供详细的交通指南。

出发地：{from}
目的地：{to}
时间要求：{time}
预算：{budget}

请提供：
1. 地铁方案 (线路、站点、时间、价格)
2. 打车方案 (预估价格、时间)
3. 共享单车方案 (如有)
4. 最佳推荐及理由
5. 实用提示

请用清晰、简洁的语气回复。`,

  payment: `你是一位中国支付专家。请帮助用户了解并设置中国的支付方式。

用户国籍：{nationality}
停留时间：{duration}
支付需求：{needs}

请介绍：
1. 支付宝设置步骤
2. 微信支付设置步骤
3. 国际信用卡使用
4. 现金使用建议
5. 安全提示

请用耐心、详细的语气回复。`,

  general: `你是 China Landing AI Helper，一位专业的中国旅行助手。

请友好、专业地回答用户的问题，提供实用的旅行建议。

如果问题与旅行相关，请提供详细、可操作的建议。
如果问题超出旅行范围，请礼貌地说明你的专长领域。

请用{language}回复。`,
};

/**
 * 替换 Prompt 模板中的变量
 */
function replaceTemplate(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{${key}}`, 'g'), value);
  }
  return result;
}

/**
 * 根据意图选择 Prompt 模板
 */
function selectPromptTemplate(intent: string): string {
  switch (intent) {
    case 'itinerary':
      return PROMPT_TEMPLATES.itinerary;
    case 'food':
      return PROMPT_TEMPLATES.food;
    case 'transport':
      return PROMPT_TEMPLATES.transport;
    case 'payment':
      return PROMPT_TEMPLATES.payment;
    default:
      return PROMPT_TEMPLATES.general;
  }
}

/**
 * 检测用户消息的意图
 */
function detectIntent(message: string): string {
  const lower = message.toLowerCase();
  
  if (lower.includes('行程') || lower.includes('规划') || lower.includes('路线') ||
      lower.includes('itinerary') || lower.includes('plan')) {
    return 'itinerary';
  }
  
  if (lower.includes('美食') || lower.includes('吃') || lower.includes('餐厅') ||
      lower.includes('food') || lower.includes('restaurant')) {
    return 'food';
  }
  
  if (lower.includes('交通') || lower.includes('地铁') || lower.includes('打车') ||
      lower.includes('transport') || lower.includes('metro')) {
    return 'transport';
  }
  
  if (lower.includes('支付') || lower.includes('支付宝') || lower.includes('微信') ||
      lower.includes('payment') || lower.includes('alipay')) {
    return 'payment';
  }
  
  return 'general';
}

/**
 * 解析 AI 响应 - 提取 JSON 结构化数据
 */
export function parseAIResponse(content: string): StructuredAIResponse {
  // 尝试提取 JSON
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        text: parsed.text || content,
        recommendations: parsed.recommendations || [],
        actions: parsed.actions || [],
        images: parsed.images || []
      };
    } catch (e) {
      // JSON 解析失败，返回纯文本
      console.warn('JSON 解析失败，返回纯文本:', e);
      return { text: content };
    }
  }
  // 纯文本 fallback
  return { text: content };
}

/**
 * 发送消息到 Qwen AI (阿里云百炼)
 */
async function sendToQwen(
  messages: Message[],
  options?: {
    intent?: string;
    variables?: Record<string, string>;
    language?: string;
    structured?: boolean;
  }
): Promise<AIResponse> {
  // 如果没有 API Key，抛出错误触发 fallback
  if (!QWEN_API_KEY || QWEN_API_KEY === 'sk-your-qwen-api-key') {
    console.warn('⚠️ Qwen API Key 未配置');
    throw new Error('Qwen API Key 未配置');
  }

  try {
    // 准备系统消息
    const intent = options?.intent || detectIntent(messages[messages.length - 1].content);
    const language = options?.language || '中文';
    
    let systemPrompt = selectPromptTemplate(intent);
    
    if (options?.variables) {
      systemPrompt = replaceTemplate(systemPrompt, {
        ...options.variables,
        language,
      });
    }

    // 构建 API 请求 - 强制要求结构化响应
    const structuredPrompt = options?.structured 
      ? systemPrompt + '\n\n【重要】请用 JSON 格式回复，必须包含以下字段：\n{\n  "text": "你的文字回复",\n  "recommendations": [{"type": "attraction|restaurant|hotel|transport", "id": "唯一 ID", "name": "名称", "nameEn": "英文名", "reason": "推荐理由", "price": "价格", "location": "位置"}],\n  "actions": [{"type": "book|navigate|info", "provider": "klook|trip|amap|didi|meituan", "url": "链接", "text": "按钮文字"}],\n  "images": [{"url": "图片 URL", "caption": "图片说明"}]\n}'
      : systemPrompt;

    const systemMessage = {
      role: 'system' as const,
      content: structuredPrompt
    };
    
    const requestBody = {
      model: process.env.QWEN_MODEL || 'qwen-plus',
      messages: [
        systemMessage,
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: parseInt(process.env.QWEN_MAX_TOKENS || '1500'),
    };

    console.log('🤖 发送请求到 Qwen API...');
    
    // 发送请求到阿里云百炼
    const response = await fetch(`${QWEN_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QWEN_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Qwen API 错误:', response.status, errorText);
      throw new Error(`Qwen API 错误：${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const rawContent = data.choices[0].message.content;
    
    console.log('✅ Qwen API 响应成功');
    
    // 尝试解析结构化响应
    const structured = parseAIResponse(rawContent);
    
    // 如果有结构化数据，返回 JSON 格式
    if (structured.recommendations?.length || structured.actions?.length) {
      return {
        content: JSON.stringify(structured),
        usage: data.usage,
      };
    }
    
    // 否则返回纯文本
    return {
      content: rawContent,
      usage: data.usage,
    };
  } catch (error) {
    console.error('❌ Qwen 请求失败:', error);
    throw error; // 抛出错误以触发 fallback
  }
}

/**
 * 发送消息到 AI (支持多模型 fallback)
 * Fallback 策略：MiniMax → Qwen → Mock
 */
export async function sendToAI(
  messages: Message[],
  options?: {
    intent?: string;
    variables?: Record<string, string>;
    language?: string;
    structured?: boolean;  // 是否要求结构化响应
  }
): Promise<AIResponse> {
  // Fallback 策略：MiniMax → Qwen → Mock
  const providers = [
    {
      name: 'minimax' as AIModel,
      send: async () => {
        if (!MINIMAX_API_KEY || MINIMAX_API_KEY === 'your-minimax-api-key') {
          throw new Error('MiniMax API Key 未配置');
        }
        return await sendToMiniMax(messages, options);
      }
    },
    {
      name: 'qwen' as AIModel,
      send: async () => {
        return await sendToQwen(messages, options);
      }
    },
    {
      name: 'mock' as AIModel,
      send: async () => {
        console.warn('⚠️ 所有 AI 服务不可用，使用 Mock 回复');
        return getMockResponse(messages);
      }
    }
  ];

  // 按顺序尝试每个 provider
  for (const provider of providers) {
    try {
      console.log(`🔄 尝试使用 ${provider.name.toUpperCase()} AI 服务...`);
      const result = await provider.send();
      console.log(`✅ ${provider.name.toUpperCase()} AI 服务成功`);
      return result;
    } catch (error) {
      console.warn(`⚠️ ${provider.name.toUpperCase()} AI 服务失败，尝试下一个...`, error);
      // 继续尝试下一个 provider
    }
  }

  // 理论上不会到这里，因为 mock 永远不会失败
  console.error('❌ 所有 AI 服务都失败了');
  return getMockResponse(messages);
}

/**
 * 发送消息到 MiniMax AI (独立函数，供 fallback 使用)
 */
async function sendToMiniMax(
  messages: Message[],
  options?: {
    intent?: string;
    variables?: Record<string, string>;
    language?: string;
    structured?: boolean;
  }
): Promise<AIResponse> {
  try {
    // 准备系统消息
    const intent = options?.intent || detectIntent(messages[messages.length - 1].content);
    const language = options?.language || '中文';
    
    let systemPrompt = selectPromptTemplate(intent);
    
    if (options?.variables) {
      systemPrompt = replaceTemplate(systemPrompt, {
        ...options.variables,
        language,
      });
    }

    // 构建 API 请求 - 强制要求结构化响应
    const structuredPrompt = options?.structured 
      ? systemPrompt + '\n\n【重要】请用 JSON 格式回复，必须包含以下字段：\n{\n  "text": "你的文字回复",\n  "recommendations": [{"type": "attraction|restaurant|hotel|transport", "id": "唯一 ID", "name": "名称", "nameEn": "英文名", "reason": "推荐理由", "price": "价格", "location": "位置"}],\n  "actions": [{"type": "book|navigate|info", "provider": "klook|trip|amap|didi|meituan", "url": "链接", "text": "按钮文字"}],\n  "images": [{"url": "图片 URL", "caption": "图片说明"}]\n}'
      : systemPrompt;

    const systemMessage = {
      role: 'system' as const,
      content: structuredPrompt
    };
    
    const requestBody = {
      model: process.env.MINIMAX_MODEL || 'MiniMax-M2.7',
      messages: [
        systemMessage,
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: parseInt(process.env.MINIMAX_MAX_TOKENS || '1500'),
    };

    console.log('🤖 发送请求到 MiniMax API...');
    
    // 发送请求
    const response = await fetch(`${MINIMAX_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MINIMAX_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ MiniMax API 错误:', response.status, errorText);
      throw new Error(`MiniMax API 错误：${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const rawContent = data.choices[0].message.content;
    
    console.log('✅ MiniMax API 响应成功');
    
    // 尝试解析结构化响应
    const structured = parseAIResponse(rawContent);
    
    // 如果有结构化数据，返回 JSON 格式
    if (structured.recommendations?.length || structured.actions?.length) {
      return {
        content: JSON.stringify(structured),
        usage: data.usage,
      };
    }
    
    // 否则返回纯文本
    return {
      content: rawContent,
      usage: data.usage,
    };
  } catch (error) {
    console.error('❌ sendToMiniMax 错误:', error);
    throw error;
  }
}

/**
 * Mock 回复 (用于测试和 API 不可用时)
 */
function getMockResponse(messages: Message[]): AIResponse {
  const lastMessage = messages[messages.length - 1].content.toLowerCase();
  
  // 行程规划
  if (lastMessage.includes('行程') || lastMessage.includes('规划') || lastMessage.includes('itinerary')) {
    const structuredResponse: StructuredAIResponse = {
      text: `🗽 **上海 4 天经典行程**

📍 **Day 1**: 经典地标
• 上午：外滩 (免费) - 经典 skyline 拍照
• 下午：豫园 (¥40) - 古典园林
• 晚上：南京路步行街

📍 **Day 2**: 文化体验
• 上午：上海博物馆 (免费)
• 下午：田子坊 (免费) - 艺术街区
• 晚上：新天地

📍 **Day 3**: 现代上海
• 上午：陆家嘴 - 东方明珠 (¥180)
• 下午：上海中心观景台 (¥180)
• 晚上：滨江骑行 (免费)

📍 **Day 4**: 水乡风情
• 全天：朱家角古镇 (免费)
• 品尝：扎肉、阿婆粽

💰 **预算参考**: ¥2000-3000/人 (不含住宿)

需要我详细规划某一天吗？或者你有其他偏好？`,
      recommendations: [
        {
          type: 'attraction',
          id: 'bund-shanghai',
          name: '外滩',
          nameEn: 'The Bund',
          reason: '上海标志性景点，欣赏浦江两岸美景',
          price: '免费',
          location: '上海市黄浦区中山东一路',
        },
        {
          type: 'attraction',
          id: 'yu-garden',
          name: '豫园',
          nameEn: 'Yu Garden',
          reason: '明代古典园林，体验传统江南园林艺术',
          price: '¥40',
          location: '上海市黄浦区安仁街 218 号',
        },
        {
          type: 'attraction',
          id: 'oriental-pearl',
          name: '东方明珠',
          nameEn: 'Oriental Pearl Tower',
          reason: '上海地标建筑，俯瞰全城美景',
          price: '¥180',
          location: '上海市浦东新区陆家嘴世纪大道 1 号',
        },
      ],
      actions: [
        {
          type: 'book',
          provider: 'klook',
          url: 'https://www.klook.com/zh-CN/activity/123-shanghai-tour/',
          text: '预订上海一日游',
        },
        {
          type: 'navigate',
          provider: 'amap',
          url: 'https://www.amap.com/',
          text: '查看地图',
        },
      ],
    };
    return {
      content: JSON.stringify(structuredResponse),
    };
  }
  
  // 美食推荐
  if (lastMessage.includes('美食') || lastMessage.includes('吃') || lastMessage.includes('food')) {
    const structuredResponse: StructuredAIResponse = {
      text: `🍜 **上海必吃美食推荐**

🥟 **本帮菜**
• 南翔馒头店 - 小笼包 (人均¥60)
• 老正兴菜馆 - 本帮菜 (人均¥150)

🍜 **面食**
• 大壶春 - 生煎包 (人均¥30)
• 鲜得来 - 排骨年糕 (人均¥25)

🦀 **特色**
• 王宝和酒家 - 大闸蟹 (季节性，人均¥300)
• 上海老饭店 - 八宝鸭 (人均¥200)

🍢 **小吃街**
• 城隍庙小吃街
• 云南南路美食街

💰 **预算参考**: ¥100-200/天

需要推荐具体某类美食吗？`,
      recommendations: [
        {
          type: 'restaurant',
          id: 'nanxiang-bun',
          name: '南翔馒头店',
          nameEn: 'Nanxiang Bun Shop',
          reason: '上海最著名的小笼包店，皮薄馅大',
          price: '人均¥60',
          location: '上海市黄浦区豫园路 85 号',
        },
        {
          type: 'restaurant',
          id: 'dachuhu',
          name: '大壶春',
          nameEn: 'Da Hu Chun',
          reason: '老字号生煎包，外酥里嫩',
          price: '人均¥30',
          location: '上海市黄浦区四川中路 136 号',
        },
        {
          type: 'restaurant',
          id: 'laozhengxing',
          name: '老正兴菜馆',
          nameEn: 'Lao Zheng Xing',
          reason: '百年老店，正宗本帮菜',
          price: '人均¥150',
          location: '上海市黄浦区福州路 556 号',
        },
      ],
      actions: [
        {
          type: 'book',
          provider: 'meituan',
          url: 'https://www.meituan.com/',
          text: '预订餐厅',
        },
        {
          type: 'navigate',
          provider: 'amap',
          url: 'https://www.amap.com/',
          text: '导航到店',
        },
      ],
    };
    return {
      content: JSON.stringify(structuredResponse),
    };
  }
  
  // 交通指南
  if (lastMessage.includes('交通') || lastMessage.includes('地铁') || lastMessage.includes('transport')) {
    const structuredResponse: StructuredAIResponse = {
      text: `🚇 **上海交通指南**

📱 **推荐 App**
• Metro 大都会 - 地铁官方 App
• 支付宝 - 可刷地铁/公交
• 滴滴出行 - 打车

🚇 **地铁**
• 票价：¥3-8
• 运营时间：5:30-23:00
• 推荐购买：一日票 (¥18)

🚕 **打车**
• 起步价：¥14 (3 公里)
• 推荐：滴滴 (可英文界面)
• 机场到市区：¥150-200

🚴 **共享单车**
• 美团单车：¥1.5/30 分钟
• 哈啰单车：¥1.5/30 分钟
• 需押金或信用分

💡 **实用提示**
• 避开早晚高峰 (8-9 点，17-18 点)
• 地铁站有英文标识
• 支付宝绑定国际卡可刷公交

需要具体路线规划吗？`,
      recommendations: [
        {
          type: 'transport',
          id: 'shanghai-metro',
          name: '上海地铁',
          nameEn: 'Shanghai Metro',
          reason: '最便捷的出行方式，覆盖全市主要景点',
          price: '¥3-8',
          location: '全市',
        },
        {
          type: 'transport',
          id: 'didi-taxi',
          name: '滴滴出行',
          nameEn: 'DiDi Ride-hailing',
          reason: '支持英文界面，可绑定国际信用卡',
          price: '起步价¥14',
          location: '全市',
        },
      ],
      actions: [
        {
          type: 'navigate',
          provider: 'amap',
          url: 'https://www.amap.com/',
          text: '查看路线',
        },
        {
          type: 'book',
          provider: 'didi',
          url: 'https://www.xiaojukeji.com/',
          text: '叫车',
        },
      ],
    };
    return {
      content: JSON.stringify(structuredResponse),
    };
  }
  
  // 支付设置
  if (lastMessage.includes('支付') || lastMessage.includes('支付宝') || lastMessage.includes('payment')) {
    const structuredResponse: StructuredAIResponse = {
      text: `💳 **中国支付设置指南**

📱 **支付宝 (推荐)**
1. 下载支付宝 App
2. 注册账号 (支持国际手机号)
3. 添加国际信用卡 (Visa/Mastercard)
4. 完成身份验证 (护照)
5. 开始使用

✅ **支持场景**
• 餐厅/商店付款
• 地铁/公交
• 共享单车
• 网购

💳 **微信支付**
1. 下载微信 App
2. 注册账号
3. 钱包 → 添加银行卡
4. 完成身份验证

⚠️ **注意事项**
• 部分小商家只接受支付宝/微信
• 建议准备少量现金 (¥200-500)
• 国际卡可能收取 3% 手续费

💡 **实用提示**
• 在大型商场/连锁店，国际信用卡可直接使用
• 酒店、机票可用国际信用卡预订
• 建议同时安装支付宝和微信

需要详细的设置截图教程吗？`,
      actions: [
        {
          type: 'info',
          provider: 'klook',
          url: 'https://www.klook.com/zh-CN/activity/alipay-setup/',
          text: '查看支付宝设置教程',
        },
        {
          type: 'info',
          provider: 'trip',
          url: 'https://www.trip.com/',
          text: '预订酒店/机票',
        },
      ],
    };
    return {
      content: JSON.stringify(structuredResponse),
    };
  }
  
  // 默认回复
  const structuredResponse: StructuredAIResponse = {
    text: `👋 欢迎来到 China Landing AI Helper!

我可以帮你：
🗽 规划行程
🍜 推荐美食
🚇 交通指南
💳 支付设置

请告诉我你的需求，比如：
• "帮我规划上海 4 天行程"
• "推荐北京美食"
• "怎么坐地铁去外滩？"
• "如何设置支付宝？"

我会为你提供详细、实用的建议！`,
    recommendations: [
      {
        type: 'attraction',
        id: 'popular-shanghai',
        name: '热门景点',
        nameEn: 'Popular Attractions',
        reason: '探索上海最著名的地标',
        price: '免费 - ¥200',
        location: '上海市',
      },
    ],
    actions: [
      {
        type: 'info',
        provider: 'klook',
        url: 'https://www.klook.com/zh-CN/destination/13-shanghai-activities/',
        text: '查看上海活动',
      },
    ],
  };
  return {
    content: JSON.stringify(structuredResponse),
  };
}

/**
 * 流式响应 (用于实时显示 AI 回复)
 */
export async function sendToAIStreaming(
  messages: Message[],
  onChunk: (chunk: string) => void,
  options?: {
    intent?: string;
    variables?: Record<string, string>;
  }
): Promise<void> {
  // 简化实现：直接返回完整回复
  const response = await sendToAI(messages, options);
  onChunk(response.content);
}
