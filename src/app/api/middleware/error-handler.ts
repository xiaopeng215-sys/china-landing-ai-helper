/**
 * API 中间件 - 统一错误处理
 * 
 * 功能:
 * - 标准化错误响应格式
 * - 自动记录到 Sentry
 * - 区分开发/生产环境错误详情
 */

import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

/**
 * API 错误代码枚举
 */
export enum ApiErrorCode {
  // 通用错误
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  
  // 验证错误
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_REQUEST = 'INVALID_REQUEST',
  MISSING_PARAMETER = 'MISSING_PARAMETER',
  
  // 认证错误
  AUTH_ERROR = 'AUTH_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // 限流错误
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  
  // 数据库错误
  DATABASE_ERROR = 'DATABASE_ERROR',
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
  DUPLICATE_RECORD = 'DUPLICATE_RECORD',
  
  // AI 服务错误
  AI_SERVICE_ERROR = 'AI_SERVICE_ERROR',
  AI_TIMEOUT = 'AI_TIMEOUT',
  AI_RATE_LIMITED = 'AI_RATE_LIMITED',
  
  // 缓存错误
  CACHE_ERROR = 'CACHE_ERROR',
  CACHE_MISS = 'CACHE_MISS',
}

/**
 * API 错误接口
 */
export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: any;
  statusCode: number;
  stack?: string;
}

/**
 * 创建 API 错误
 */
export function createApiError(
  code: ApiErrorCode,
  message: string,
  statusCode: number = 500,
  details?: any
): ApiError {
  return {
    code,
    message,
    details,
    statusCode,
  };
}

/**
 * 验证错误快捷创建
 */
export function createValidationError(
  message: string,
  details?: any
): ApiError {
  return createApiError(
    ApiErrorCode.VALIDATION_ERROR,
    message,
    400,
    details
  );
}

/**
 * 认证错误快捷创建
 */
export function createAuthError(
  message: string = '未授权访问',
  details?: any
): ApiError {
  return createApiError(
    ApiErrorCode.AUTH_ERROR,
    message,
    401,
    details
  );
}

/**
 * 权限错误快捷创建
 */
export function createForbiddenError(
  message: string = '禁止访问',
  details?: any
): ApiError {
  return createApiError(
    ApiErrorCode.FORBIDDEN,
    message,
    403,
    details
  );
}

/**
 * 记录未找到错误快捷创建
 */
export function createNotFoundError(
  message: string = '资源未找到',
  details?: any
): ApiError {
  return createApiError(
    ApiErrorCode.RECORD_NOT_FOUND,
    message,
    404,
    details
  );
}

/**
 * 限流错误快捷创建
 */
export function createRateLimitError(
  message: string = '请求过于频繁',
  retryAfter?: number
): ApiError {
  return createApiError(
    ApiErrorCode.RATE_LIMIT_ERROR,
    message,
    429,
    retryAfter ? { retryAfter } : undefined
  );
}

/**
 * AI 服务错误快捷创建
 */
export function createAIServiceError(
  message: string = 'AI 服务暂时不可用',
  details?: any
): ApiError {
  return createApiError(
    ApiErrorCode.AI_SERVICE_ERROR,
    message,
    503,
    details
  );
}

/**
 * 处理 API 错误并返回响应
 */
export function handleApiError(error: any): NextResponse {
  // 如果已经是 ApiError，直接使用
  if (isApiError(error)) {
    const apiError = error as ApiError;
    logError(apiError);
    return createErrorResponse(apiError);
  }
  
  // 包装为内部错误
  const apiError: ApiError = {
    code: ApiErrorCode.INTERNAL_ERROR,
    message: '服务器内部错误',
    statusCode: 500,
    details: process.env.NODE_ENV === 'development' 
      ? { 
          originalError: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        }
      : undefined,
  };
  
  // 记录到 Sentry
  Sentry.captureException(error, {
    tags: {
      error_code: apiError.code,
      status_code: apiError.statusCode,
    },
    extra: {
      details: apiError.details,
    },
  });
  
  return createErrorResponse(apiError);
}

/**
 * 检查是否为 ApiError
 */
function isApiError(error: any): error is ApiError {
  return error && 
         typeof error === 'object' && 
         'code' in error && 
         'message' in error && 
         'statusCode' in error;
}

/**
 * 创建错误响应
 */
function createErrorResponse(error: ApiError): NextResponse {
  const isDev = process.env.NODE_ENV === 'development';
  
  return NextResponse.json(
    {
      error: {
        code: error.code,
        message: error.message,
        ...(isDev && error.details && { details: error.details }),
      },
    },
    { 
      status: error.statusCode,
      headers: {
        'X-Error-Code': error.code,
      },
    }
  );
}

/**
 * 记录错误日志
 */
function logError(error: ApiError): void {
  const isDev = process.env.NODE_ENV === 'development';
  
  if (error.statusCode >= 500) {
    console.error(`[API Error] ${error.code}: ${error.message}`, error.details);
  } else if (isDev) {
    console.warn(`[API Error] ${error.code}: ${error.message}`, error.details);
  }
}

/**
 * 错误处理包装器
 * 自动捕获并处理异步函数中的错误
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<any>>(
  handler: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      throw error; // 让上层统一处理
    }
  }) as T;
}

/**
 * 异步处理器包装器 (用于 API Route)
 */
export function asyncHandler(
  handler: (request: any) => Promise<NextResponse>
): (request: any) => Promise<NextResponse> {
  return async (request: any) => {
    try {
      return await handler(request);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

// ============================================================================
// 便捷导出
// ============================================================================

export const ApiError = {
  create: createApiError,
  validation: createValidationError,
  auth: createAuthError,
  forbidden: createForbiddenError,
  notFound: createNotFoundError,
  rateLimit: createRateLimitError,
  aiService: createAIServiceError,
  handle: handleApiError,
  withHandler: withErrorHandler,
  asyncHandler: asyncHandler,
};

export default ApiError;
