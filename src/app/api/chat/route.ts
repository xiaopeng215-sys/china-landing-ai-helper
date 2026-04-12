import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { sendToAI } from '@/lib/ai-client';
import { 
  createChatSession, 
  saveMessage, 
  getMessages,
  getChatSessions,
  updateChatSessionTitle 
} from '@/lib/database';

/**
 * 聊天 API - 支持会话管理和消息历史
 */

export async function POST(request: NextRequest) {
  try {
    // 获取当前用户会话
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: '消息不能为空' },
        { status: 400 }
      );
    }

    // 如果没有会话 ID，创建新会话
    let currentSessionId = sessionId;
    let sessionTitle = null;

    if (!currentSessionId) {
      // 根据第一条消息生成会话标题
      sessionTitle = message.length > 30 ? message.substring(0, 30) + '...' : message;
      currentSessionId = await createChatSession(userId, sessionTitle);
      
      if (!currentSessionId) {
        return NextResponse.json(
          { error: '无法创建会话' },
          { status: 500 }
        );
      }
    }

    // 保存用户消息
    const savedMessageId = await saveMessage(
      currentSessionId,
      userId,
      'user',
      message
    );

    if (!savedMessageId) {
      console.warn('保存用户消息失败，但继续处理');
    }

    // 调用 AI
    const aiResponse = await sendToAI([
      { role: 'user', content: message }
    ]);

    // 保存 AI 回复
    const savedResponseId = await saveMessage(
      currentSessionId,
      userId,
      'assistant',
      aiResponse.content,
      aiResponse.usage?.total_tokens
    );

    if (!savedResponseId) {
      console.warn('保存 AI 回复失败，但继续返回');
    }

    // 如果是第一条消息，更新会话标题
    if (sessionTitle && currentSessionId) {
      const messages = await getMessages(currentSessionId, 2);
      if (messages.length <= 2) {
        await updateChatSessionTitle(currentSessionId, sessionTitle);
      }
    }

    return NextResponse.json({
      reply: aiResponse.content,
      usage: aiResponse.usage,
      sessionId: currentSessionId,
      messageId: savedMessageId,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json(
      { error: '处理消息失败，请稍后重试' },
      { status: 500 }
    );
  }
}

/**
 * 获取会话列表
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const sessions = await getChatSessions(userId);

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('获取会话列表失败:', error);
    
    return NextResponse.json(
      { error: '获取会话失败' },
      { status: 500 }
    );
  }
}
