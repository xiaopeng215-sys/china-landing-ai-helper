import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getMessages, deleteChatSession } from '@/lib/database';

/**
 * 获取指定会话的消息历史
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const { sessionId } = await params;
    const messages = await getMessages(sessionId, 100);

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('获取消息历史失败:', error);
    
    return NextResponse.json(
      { error: '获取消息失败' },
      { status: 500 }
    );
  }
}

/**
 * 删除会话
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const { sessionId } = await params;
    const success = await deleteChatSession(sessionId);

    if (!success) {
      return NextResponse.json(
        { error: '删除会话失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除会话失败:', error);
    
    return NextResponse.json(
      { error: '删除会话失败' },
      { status: 500 }
    );
  }
}
