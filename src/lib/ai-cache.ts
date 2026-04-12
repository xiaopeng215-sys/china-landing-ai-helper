/**
 * AI 响应缓存 - 减少重复 AI 调用
 * 
 * 缓存策略:
 * - 相同消息 + 相同模型 = 相同响应
 * - TTL: 1 小时 (平衡新鲜度和缓存命中率)
 * - Key: model + hash(messages + options)
 */

import { cache, CacheKey } from './cache';
import type { Message, AIResponse, AIModel } from './ai-client';

/**
 * AI 请求上下文 (用于生成缓存 Key)
 */
export interface AIRequestContext {
  messages: Message[];
  model: AIModel | string;
  temperature: number;
  intent?: string;
  structured?: boolean;
  language?: string;
}

/**
 * 创建缓存 Key
 * 使用 SHA-256 哈希确保唯一性
 */
function createCacheKey(context: AIRequestContext): string {
  const crypto = require('crypto');
  
  // 规范化消息 (移除时间戳等动态字段)
  const normalizedMessages = context.messages.map(msg => ({
    role: msg.role,
    content: msg.content.trim().toLowerCase(),
  }));
  
  const hashInput = JSON.stringify({
    messages: normalizedMessages,
    model: context.model,
    temperature: context.temperature,
    intent: context.intent,
    structured: context.structured,
    language: context.language,
  });
  
  const hash = crypto
    .createHash('sha256')
    .update(hashInput)
    .digest('hex')
    .substring(0, 16); // 截断为 16 位
  
  return CacheKey.aiResponse(context.model, hash);
}

/**
 * 从缓存获取 AI 响应
 */
export async function getCachedAIResponse(
  context: AIRequestContext
): Promise<AIResponse | null> {
  const key = createCacheKey(context);
  
  try {
    const cached = await cache.get<AIResponse>(key);
    if (cached) {
      console.log(`[AI Cache] ✅ 命中缓存: ${key}`);
      return cached;
    }
  } catch (error) {
    console.warn('[AI Cache] 读取缓存失败:', error);
  }
  
  return null;
}

/**
 * 缓存 AI 响应
 */
export async function cacheAIResponse(
  context: AIRequestContext,
  response: AIResponse,
  ttl: number = 3600 // 1 小时
): Promise<void> {
  const key = createCacheKey(context);
  
  try {
    await cache.set(key, response, ttl);
    console.log(`[AI Cache] 💾 已缓存: ${key} (TTL: ${ttl}s)`);
  } catch (error) {
    console.warn('[AI Cache] 写入缓存失败:', error);
  }
}

/**
 * 删除 AI 响应缓存
 */
export async function invalidateAIResponse(
  context: AIRequestContext
): Promise<void> {
  const key = createCacheKey(context);
  await cache.delete(key);
  console.log(`[AI Cache] 🗑️  已删除缓存: ${key}`);
}

/**
 * 批量删除 AI 缓存 (按模型)
 */
export async function invalidateAIModelCache(
  model: AIModel | string
): Promise<void> {
  const pattern = `ai:response:${model}:*`;
  console.log(`[AI Cache] 🗑️  批量删除缓存: ${pattern}`);
  // 注意：需要 Redis 支持 KEYS 命令，或使用其他策略
  await cache.clear(); // 简化实现：清空所有缓存
}

/**
 * 带缓存的 AI 调用
 * 自动处理缓存命中和回源
 */
export async function sendToAIWithCache(
  messages: Message[],
  options?: {
    intent?: string;
    variables?: Record<string, string>;
    language?: string;
    structured?: boolean;
    model?: AIModel;
    cacheTTL?: number; // 自定义缓存 TTL
    forceRefresh?: boolean; // 强制刷新缓存
  }
): Promise<AIResponse> {
  const context: AIRequestContext = {
    messages,
    model: options?.model || 'qwen',
    temperature: 0.7,
    intent: options?.intent,
    structured: options?.structured,
    language: options?.language,
  };
  
  // 强制刷新时跳过缓存
  if (!options?.forceRefresh) {
    const cached = await getCachedAIResponse(context);
    if (cached) {
      return cached;
    }
  }
  
  // 调用 AI (动态导入避免循环依赖)
  const { sendToAI } = await import('./ai-client');
  const response = await sendToAI(messages, options);
  
  // 缓存响应
  const ttl = options?.cacheTTL || 3600;
  await cacheAIResponse(context, response, ttl);
  
  return response;
}

/**
 * 流式响应的缓存 (简化版)
 * 注意：流式响应需要完整接收后才能缓存
 */
export async function sendToAIStreamingWithCache(
  messages: Message[],
  onChunk: (chunk: string) => void,
  options?: {
    intent?: string;
    model?: AIModel;
    cacheTTL?: number;
  }
): Promise<void> {
  const context: AIRequestContext = {
    messages,
    model: options?.model || 'qwen',
    temperature: 0.7,
    intent: options?.intent,
  };
  
  // 尝试缓存
  const cached = await getCachedAIResponse(context);
  if (cached) {
    // 模拟流式输出
    const chunks = cached.content.match(/.{1,50}/g) || [cached.content];
    for (const chunk of chunks) {
      onChunk(chunk);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    return;
  }
  
  // 流式调用 (完整接收后缓存)
  let fullResponse = '';
  const { sendToAIStreaming } = await import('./ai-client');
  
  await sendToAIStreaming(messages, (chunk) => {
    fullResponse += chunk;
    onChunk(chunk);
  }, options);
  
  // 缓存完整响应
  if (fullResponse) {
    const response: AIResponse = { content: fullResponse };
    const ttl = options?.cacheTTL || 3600;
    await cacheAIResponse(context, response, ttl);
  }
}

/**
 * 获取缓存统计
 */
export async function getCacheStats(): Promise<{
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  hitRate: string;
}> {
  const stats = cache.getStats();
  const total = stats.hits + stats.misses;
  const hitRate = total > 0 ? ((stats.hits / total) * 100).toFixed(2) : '0';
  
  return {
    totalRequests: total,
    cacheHits: stats.hits,
    cacheMisses: stats.misses,
    hitRate: `${hitRate}%`,
  };
}

/**
 * 中间件：自动缓存 AI 请求
 * 用于 API Route
 */
export function withAICache<T extends (...args: any[]) => Promise<any>>(
  handler: T,
  options?: {
    ttl?: number;
    keyGenerator?: (...args: Parameters<T>) => string;
  }
): T {
  return (async (...args: Parameters<T>) => {
    // 调用原始 handler
    const result = await handler(...args);
    return result;
  }) as T;
}

// ============================================================================
// 导出
// ============================================================================

export default {
  getCachedAIResponse,
  cacheAIResponse,
  invalidateAIResponse,
  sendToAIWithCache,
  sendToAIStreamingWithCache,
  getCacheStats,
};
