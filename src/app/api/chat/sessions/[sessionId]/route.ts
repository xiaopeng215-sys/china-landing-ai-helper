import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/auth-options';
import { getMessages, deleteChatSession } from '@/lib/database';
import { handleApiError, createAuthError, createValidationError } from '@/app/api/middleware/error-handler';

/**
 * 获取指定会话的消息历史
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await getServerSession(getAuthOptions());
    
    if (!session?.user?.id) {
      throw createAuthError('请先登录');
    }

    const { sessionId } = await params;
    
    if (!sessionId) {
      throw createValidationError('缺少 sessionId 参数');
    }
    
    const messages = await getMessages(sessionId, 100);

    return NextResponse.json({ messages });
  } catch (error) {
    return handleApiError(error);
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
    const session = await getServerSession(getAuthOptions());
    
    if (!session?.user?.id) {
      throw createAuthError('请先登录');
    }

    const { sessionId } = await params;
    
    if (!sessionId) {
      throw createValidationError('缺少 sessionId 参数');
    }
    
    const success = await deleteChatSession(sessionId);

    if (!success) {
      throw createValidationError('删除会话失败');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
