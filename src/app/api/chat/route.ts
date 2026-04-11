import { NextRequest, NextResponse } from 'next/server';
import { sendToAI } from '@/lib/ai-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // 调用 AI
    const response = await sendToAI([
      { role: 'user', content: message }
    ]);

    return NextResponse.json({
      reply: response.content,
      usage: response.usage,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
