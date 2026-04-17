import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { sendToAIStreamingResponse } from '@/lib/ai-client';

export type FilterMode = 'normal' | 'avoid_tourist' | 'hidden_gem';

const FILTER_SYSTEM_PROMPTS: Record<string, string> = {
  'normal': {
    'zh-CN': '你是一个专业的中国旅行助手，帮助游客规划行程、推荐美食和提供交通指南。请用中文回复，友好、简洁、实用。',
    'en-US': 'You are a professional China travel assistant helping international visitors plan trips, find food, and navigate transportation. Reply in English, friendly and concise.',
    'ja-JP': 'あなたは中国旅行の専門アシスタントです。旅程計画、グルメ、交通案内を日本語で簡潔にお答えします。',
    'ko-KR': '당신은 중국 여행 전문 어시스턴트입니다. 여행 계획, 맛집, 교통 안내를 한국어로 간결하게 답변합니다.',
  },
  'avoid_tourist': {
    'zh-CN': '你是一个专业的中国旅行助手，善于为用户避开人山人海的热门景点，寻找当地人常去的地方。请用中文回复，友好、简洁、实用。推荐时请务必：1) 避开该城市热门榜单 Top 10 的 POI（如故宫、天安门、长城、西湖、外滩等标志性大众景区）；2) 优先推荐知名度较低但体验真实的本地特色目的地；3) 给出具体的躲避游客理由。',
    'en-US': 'You are a professional China travel assistant specializing in OFF-THE-BEATEN-PATH recommendations. IMPORTANT: When recommending attractions, restaurants, or neighborhoods, you MUST: 1) AVOID the city\'s Top 10 popular tourist spots (e.g. Forbidden City, Tiananmen, Great Wall, West Lake, The Bund, etc.); 2) PRIORITIZE lesser-known local favorites and hidden gems that tourists rarely visit; 3) Explain WHY a place is not crowded and how it offers an authentic local experience. Reply in English only.',
    'ja-JP': 'あなたは中国人民にしか知らない穴場スポットを探すのが得意な中国旅行アシスタントです。人気観光地的TOP10（故宮、天安門、広場など）を避け、ローカルに人気の隠れた魅力を 추천してください。日本語で简潔に回答してください。',
    'ko-KR': '당신은 중국 현지인만 아는 숨겨진 명소를 추천하는 전문가입니다. 관광지 TOP10( 자금성, 천안문, 만리장성 등)은 피하고 현지인의 발길이 적은 보석 같은 장소를 추천해 주세요. 한국어로 간결하게 답변해 주세요.',
  },
  'hidden_gem': {
    'zh-CN': '你是中国深度游专家，专门挖掘连本地人都不知道的极致小众目的地。请用中文回复。原则：1) 强烈避开任何热门旅游榜单上的景点；2) 推荐鲜为人知、历史价值高、文化底蕴深的小众目的地；3) 推荐有"反差感"的目的地（如废弃工厂里的艺术区、深山里的咖啡馆）；4) 每条推荐必须附带"为什么小众"的具体解释。',
    'en-US': 'You are a CHINA HIDDEN GEMS EXPERT for ultra-discovering travelers. CRITICAL RULES: 1) STRICTLY AVOID any attraction that appears on popular tourist ranking lists; 2) ONLY recommend obscure, under-the-radar destinations that even locals don\'t widely know; 3) Look for "contrast" destinations (e.g. art districts in abandoned factories, cafes in remote mountains); 4) EVERY recommendation must include a specific explanation of WHY it is truly niche and unknown. Reply in English only.',
    'ja-JP': 'あなたは中国ائح spotsの達人です。人気ランキングに出る景点は必ず避け、ローカルさえ知らない極限の穴場だけを推荐してください。各推薦には"なぜ小型なのか"の具体的説明をつけてください。',
    'ko-KR': '당신은 중국최고의 숨겨진 보석 전문가입니다.热门榜单에 나오는 관광지는 절대 추천하지 않고, 현지인도 모르는 극한의・ローカルスポットだけを推薦해 주세요.',
  },
};

/**
 * 根据消息检测过滤器模式
 * 优先精确匹配关键词，再模糊匹配
 */
function detectFilterMode(message: string): FilterMode {
  const lower = message.toLowerCase();

  // 精确关键词检测（优先级：hidden_gem > avoid_tourist > normal）
  if (/避开游客|躲避游客|避开人潮|躲开游客|avoid.tourist|no.tourist|off.the.beaten|非热门|小众目的地|hidden.gem|极致小众|undiscovered|niche.destination/.test(lower)) {
    return 'hidden_gem';
  }

  if (/本地人|local.only|当地人|不是景点|不是热门|avoid.popular|less.tourist|not.crowded|人少|安静|清净|避开热门/.test(lower)) {
    return 'avoid_tourist';
  }

  return 'normal';
}

const FALLBACK_SYSTEM_PROMPTS = {
  'zh-CN': '你是一个专业的中国旅行助手，帮助游客规划行程、推荐美食和提供交通指南。请用中文回复，友好、简洁、实用。',
  'en-US': 'You are a professional China travel assistant helping international visitors plan trips, find food, and navigate transportation. Reply in English, friendly and concise.',
  'ja-JP': 'あなたは中国旅行の専門アシスタントです。旅程計画、グルメ、交通案内を日本語で簡潔にお答えします。',
  'ko-KR': '당신은 중국 여행 전문 어시스턴트입니다. 여행 계획, 맛집, 교통 안내를 한국어로 간결하게 답변합니다.',
};

function detectLanguage(message: string): string {
  if (/[\u4e00-\u9fff]/.test(message)) return 'zh-CN';
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(message)) return 'ja-JP';
  if (/[\uac00-\ud7af]/.test(message)) return 'ko-KR';
  return 'en-US';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, language, history = [], filterMode } = body;

    if (!message?.trim()) {
      return new Response('Message required', { status: 400 });
    }

    const detectedLanguage = language || detectLanguage(message);
    const mode: FilterMode = filterMode || detectFilterMode(message);
    const langPrompts = FILTER_SYSTEM_PROMPTS[mode] || FILTER_SYSTEM_PROMPTS['normal'];
    const systemPrompt = langPrompts[detectedLanguage] || langPrompts['en-US'];

    const messages = [
      ...history.slice(-6).map((m: any) => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: message.trim() },
    ];

    // 修复 #2: 传递 thinking_budget 避免空回复
    const thinkingBudget = parseInt(process.env.MINIMAX_THINKING_BUDGET || '200');
    const stream = await sendToAIStreamingResponse(messages, systemPrompt, { thinkingBudget });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Stream chat error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
