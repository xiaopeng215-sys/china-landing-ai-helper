import { NextResponse } from 'next/server';
import { createChatSession } from '@/lib/chat/session-manager';
import { handleError } from '../../middleware/error-handler';

/**
 * POST /api/chat/sessions
 * 
 * 创建新的聊天会话
 * 
 * @body {string} destination - 目的地城市
 * @body {number} duration - 旅行天数
 * @body {object} preferences - 用户偏好
 * @returns {object} 会话信息
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { destination, duration, preferences } = body;

    // 验证输入
    if (!destination || typeof destination !== 'string') {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'destination is required and must be a string',
            details: {
              field: 'destination',
              suggestion: 'Provide a valid city name like "Beijing" or "Shanghai"'
            }
          }
        },
        { status: 400 }
      );
    }

    if (!duration || typeof duration !== 'number' || duration < 1 || duration > 30) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'duration must be a number between 1 and 30',
            details: {
              field: 'duration',
              suggestion: 'Provide a number between 1 and 30 days'
            }
          }
        },
        { status: 400 }
      );
    }

    // 创建会话
    const session = await createChatSession({
      destination,
      duration,
      preferences: preferences || {}
    });

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        destination: session.destination,
        duration: session.duration,
        createdAt: session.createdAt.toISOString()
      }
    });
  } catch (error) {
    // 使用统一错误处理中间件
    return handleError(error);
  }
}

/**
 * GET /api/chat/sessions
 * 
 * 获取用户的聊天会话列表
 */
export async function GET(request: Request) {
  try {
    // TODO: 实现获取会话列表
    return NextResponse.json({
      success: true,
      data: {
        sessions: []
      }
    });
  } catch (error) {
    return handleError(error);
  }
}
