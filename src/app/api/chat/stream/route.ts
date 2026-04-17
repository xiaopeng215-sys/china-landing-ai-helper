import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { sendToAIStreamingResponse } from '@/lib/ai-client';

const SYSTEM_PROMPTS: Record<string, string> = {
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
    const { message, language, history = [] } = body;

    if (!message?.trim()) {
      return new Response('Message required', { status: 400 });
    }

    const detectedLanguage = language || detectLanguage(message);
    const systemPrompt = SYSTEM_PROMPTS[detectedLanguage] || SYSTEM_PROMPTS['en-US'];

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
