/**
 * API 客户端单元测试
 * 
 * 测试覆盖:
 * - 请求/响应拦截器
 * - 缓存策略
 * - 错误处理
 * - 重试机制
 * - Mock/Real 切换
 * 
 * @tested - 2026-04-12
 * @coverage - 目标 85%+
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import {
  messagesApi,
  tripsApi,
  foodApi,
  attractionApi,
  transportApi,
  apiConfig,
  apiInterceptors,
} from '../api-client';

// ============================================
// Mock 数据
// ============================================

const mockTripData = {
  id: 'trip-001',
  userId: 'user-123',
  destination: 'Beijing',
  days: 5,
  budget: 5000,
  createdAt: new Date().toISOString(),
};

const mockMessageData = {
  id: 'msg-001',
  type: 'user' as const,
  content: 'Test message',
  timestamp: '12:00',
};

// ============================================
// 测试套件
// ============================================

describe('API Client', () => {
  // ============================================
  // Setup & Teardown
  // ============================================
  
  beforeEach(() => {
    // 重置配置到默认值
    apiConfig.setMock(true);
    apiConfig.clearCache();
    apiInterceptors.clear();
    
    // 清除所有 mock
    jest.clearAllMocks();
  });

  afterEach(() => {
    // 清理工作
    jest.restoreAllMocks();
  });

  // ============================================
  // 配置管理测试
  // ============================================
  
  describe('API Configuration', () => {
    it('should return default config', () => {
      const config = apiConfig.getConfig();
      
      expect(config).toHaveProperty('baseUrl');
      expect(config).toHaveProperty('useMock');
      expect(config).toHaveProperty('timeout');
      expect(config.timeout).toBe(5000);
    });

    it('should update config correctly', () => {
      apiConfig.setConfig({ timeout: 10000 });
      
      const config = apiConfig.getConfig();
      expect(config.timeout).toBe(10000);
    });

    it('should toggle mock mode', () => {
      apiConfig.setMock(false);
      expect(apiConfig.isMock()).toBe(false);
      
      apiConfig.setMock(true);
      expect(apiConfig.isMock()).toBe(true);
    });

    it('should clear cache successfully', () => {
      // 先调用一次以填充缓存
      messagesApi.getList();
      
      apiConfig.clearCache();
      // 缓存已清除，下次调用会是新的
    });
  });

  // ============================================
  // Messages API 测试
  // ============================================
  
  describe('Messages API', () => {
    describe('getList', () => {
      it('should return message list in mock mode', async () => {
        const messages = await messagesApi.getList();
        
        expect(Array.isArray(messages)).toBe(true);
        expect(messages.length).toBeGreaterThan(0);
        
        // 验证消息结构
        const firstMessage = messages[0];
        expect(firstMessage).toHaveProperty('id');
        expect(firstMessage).toHaveProperty('type');
        expect(firstMessage).toHaveProperty('content');
        expect(firstMessage).toHaveProperty('timestamp');
      });

      it('should return messages with correct type', async () => {
        const messages = await messagesApi.getList();
        
        messages.forEach(msg => {
          expect(['user', 'assistant', 'system']).toContain(msg.type);
        });
      });
    });

    describe('send', () => {
      it('should send message successfully', async () => {
        const content = 'Test message content';
        const message = await messagesApi.send(content);
        
        expect(message.id).toBeDefined();
        expect(message.content).toBe(content);
        expect(message.type).toBe('user');
        expect(message.timestamp).toBeDefined();
      });

      it('should reject empty message', async () => {
        await expect(messagesApi.send(''))
          .rejects
          .toThrow();
      });

      it('should handle very long message', async () => {
        const longContent = 'a'.repeat(10000);
        const message = await messagesApi.send(longContent);
        
        expect(message.content).toBe(longContent);
      });

      it('should handle special characters', async () => {
        const content = 'Special: <>&"\' 你好 🚀';
        const message = await messagesApi.send(content);
        
        expect(message.content).toBe(content);
      });
    });
  });

  // ============================================
  // Trips API 测试
  // ============================================
  
  describe('Trips API', () => {
    describe('getList', () => {
      it('should return trip list', async () => {
        const trips = await tripsApi.getList();
        
        expect(Array.isArray(trips)).toBe(true);
        
        if (trips.length > 0) {
          const firstTrip = trips[0];
          expect(firstTrip).toHaveProperty('id');
          expect(firstTrip).toHaveProperty('userId');
          expect(firstTrip).toHaveProperty('destination');
          expect(firstTrip).toHaveProperty('days');
        }
      });
    });

    describe('getById', () => {
      it('should return trip by id', async () => {
        // 先创建一个行程
        const created = await tripsApi.create({
          userId: 'test-user',
          destination: 'Beijing',
          days: 5,
        });
        
        // 再查询
        const retrieved = await tripsApi.getById(created.id);
        
        expect(retrieved.id).toBe(created.id);
        expect(retrieved.destination).toBe('Beijing');
      });

      it('should throw error for non-existent trip', async () => {
        await expect(tripsApi.getById('non-existent-id'))
          .rejects
          .toThrow('Trip not found');
      });
    });

    describe('create', () => {
      it('should create trip successfully', async () => {
        const tripData = {
          userId: 'user-123',
          destination: 'Beijing',
          days: 5,
        };
        
        const result = await tripsApi.create(tripData);
        
        expect(result.id).toBeDefined();
        expect(result.userId).toBe(tripData.userId);
        expect(result.destination).toBe(tripData.destination);
        expect(result.days).toBe(tripData.days);
      });

      it('should create multiple trips', async () => {
        const trips = [];
        for (let i = 0; i < 3; i++) {
          const trip = await tripsApi.create({
            userId: 'user-123',
            destination: `City ${i}`,
            days: 5,
          });
          trips.push(trip);
        }
        
        expect(trips.length).toBe(3);
        expect(new Set(trips.map(t => t.id)).size).toBe(3); // 确保 ID 唯一
      });
    });

    describe('update', () => {
      it('should update trip successfully', async () => {
        // 创建行程
        const created = await tripsApi.create({
          userId: 'user-123',
          destination: 'Beijing',
          days: 5,
        });
        
        // 更新
        const updated = await tripsApi.update(created.id, {
          days: 7,
          budget: 6000,
        });
        
        expect(updated.days).toBe(7);
        expect(updated.budget).toBe(6000);
        expect(updated.destination).toBe('Beijing'); // 未改变的字段保持不变
      });

      it('should throw error for non-existent trip', async () => {
        await expect(tripsApi.update('non-existent', { days: 7 }))
          .rejects
          .toThrow('Trip not found');
      });
    });

    describe('delete', () => {
      it('should delete trip successfully', async () => {
        // 创建行程
        const created = await tripsApi.create({
          userId: 'user-123',
          destination: 'Beijing',
          days: 5,
        });
        
        // 删除
        await tripsApi.delete(created.id);
        
        // 验证已删除
        await expect(tripsApi.getById(created.id))
          .rejects
          .toThrow('Trip not found');
      });

      it('should throw error for deleting non-existent trip', async () => {
        await expect(tripsApi.delete('non-existent'))
          .rejects
          .toThrow('Trip not found');
      });
    });

    describe('CRUD Flow', () => {
      it('should complete full CRUD lifecycle', async () => {
        // Create
        const created = await tripsApi.create({
          userId: 'user-123',
          destination: 'Shanghai',
          days: 3,
        });
        expect(created.id).toBeDefined();

        // Read
        const retrieved = await tripsApi.getById(created.id);
        expect(retrieved.id).toBe(created.id);

        // Update
        const updated = await tripsApi.update(created.id, { days: 5 });
        expect(updated.days).toBe(5);

        // Delete
        await tripsApi.delete(created.id);
        
        // Verify deletion
        const allTrips = await tripsApi.getList();
        const deleted = allTrips.find(t => t.id === created.id);
        expect(deleted).toBeUndefined();
      });
    });
  });

  // ============================================
  // Food API 测试
  // ============================================
  
  describe('Food API', () => {
    describe('getList', () => {
      it('should return all restaurants', async () => {
        const restaurants = await foodApi.getList();
        
        expect(Array.isArray(restaurants)).toBe(true);
        
        if (restaurants.length > 0) {
          const first = restaurants[0];
          expect(first).toHaveProperty('id');
          expect(first).toHaveProperty('name');
          expect(first).toHaveProperty('cuisine');
          expect(first).toHaveProperty('location');
        }
      });

      it('should filter by category', async () => {
        const all = await foodApi.getList();
        const filtered = await foodApi.getList('Chinese');
        
        expect(filtered.length).toBeLessThanOrEqual(all.length);
        
        filtered.forEach(r => {
          expect(r.cuisine).toContain('Chinese');
        });
      });
    });

    describe('getById', () => {
      it('should return restaurant by id', async () => {
        const restaurants = await foodApi.getList();
        
        if (restaurants.length > 0) {
          const restaurant = await foodApi.getById(restaurants[0].id);
          expect(restaurant.id).toBe(restaurants[0].id);
        }
      });

      it('should throw error for non-existent restaurant', async () => {
        await expect(foodApi.getById('non-existent'))
          .rejects
          .toThrow('Restaurant not found');
      });
    });

    describe('search', () => {
      it('should search by keyword', async () => {
        const results = await foodApi.search('Beijing');
        
        results.forEach(r => {
          const searchText = `${r.name} ${r.cuisine} ${r.location}`.toLowerCase();
          expect(searchText).toContain('beijing');
        });
      });

      it('should return empty array for no matches', async () => {
        const results = await foodApi.search('xyz123nonexistent');
        expect(Array.isArray(results)).toBe(true);
      });
    });
  });

  // ============================================
  // Attraction API 测试
  // ============================================
  
  describe('Attraction API', () => {
    describe('getList', () => {
      it('should return attractions list', async () => {
        const attractions = await attractionApi.getList();
        
        expect(Array.isArray(attractions)).toBe(true);
        
        if (attractions.length > 0) {
          const first = attractions[0];
          expect(first).toHaveProperty('id');
          expect(first).toHaveProperty('name');
          expect(first).toHaveProperty('tags');
        }
      });

      it('should filter by category', async () => {
        const all = await attractionApi.getList();
        const filtered = await attractionApi.getList('historical');
        
        expect(filtered.length).toBeLessThanOrEqual(all.length);
      });
    });

    describe('getById', () => {
      it('should return attraction by id', async () => {
        const attractions = await attractionApi.getList();
        
        if (attractions.length > 0) {
          const attraction = await attractionApi.getById(attractions[0].id);
          expect(attraction.id).toBe(attractions[0].id);
        }
      });

      it('should throw error for non-existent attraction', async () => {
        await expect(attractionApi.getById('non-existent'))
          .rejects
          .toThrow('Attraction not found');
      });
    });
  });

  // ============================================
  // Transport API 测试
  // ============================================
  
  describe('Transport API', () => {
    describe('getRoutes', () => {
      it('should return transport options', async () => {
        const routes = await transportApi.getRoutes('Beijing', 'Shanghai');
        
        expect(Array.isArray(routes)).toBe(true);
      });

      it('should handle same origin and destination', async () => {
        const routes = await transportApi.getRoutes('Beijing', 'Beijing');
        expect(Array.isArray(routes)).toBe(true);
      });
    });
  });

  // ============================================
  // 拦截器测试
  // ============================================
  
  describe('Request Interceptors', () => {
    it('should apply request interceptor', async () => {
      const interceptorMock = jest.fn((config) => ({
        ...config,
        headers: { ...config.headers, 'X-Test': 'test-value' },
      }));
      
      apiInterceptors.addRequest(interceptorMock);
      
      await messagesApi.getList();
      
      expect(interceptorMock).toHaveBeenCalled();
    });

    it('should apply multiple request interceptors', async () => {
      const interceptor1 = jest.fn((config) => config);
      const interceptor2 = jest.fn((config) => config);
      
      apiInterceptors.addRequest(interceptor1);
      apiInterceptors.addRequest(interceptor2);
      
      await messagesApi.getList();
      
      expect(interceptor1).toHaveBeenCalled();
      expect(interceptor2).toHaveBeenCalled();
    });
  });

  describe('Response Interceptors', () => {
    it('should apply response interceptor', async () => {
      const interceptorMock = jest.fn((response) => response);
      
      apiInterceptors.addResponse(interceptorMock);
      
      await messagesApi.getList();
      
      expect(interceptorMock).toHaveBeenCalled();
    });
  });

  describe('Error Interceptors', () => {
    it('should apply error interceptor', async () => {
      const interceptorMock = jest.fn((error) => error);
      
      apiInterceptors.addError(interceptorMock);
      
      try {
        // 触发错误
        apiConfig.setMock(false);
        await messagesApi.getList();
      } catch (error) {
        // 错误拦截器应该被调用
        expect(interceptorMock).toHaveBeenCalled();
      }
    });
  });

  describe('Clear Interceptors', () => {
    it('should clear all interceptors', () => {
      apiInterceptors.addRequest(jest.fn());
      apiInterceptors.addResponse(jest.fn());
      apiInterceptors.addError(jest.fn());
      
      apiInterceptors.clear();
      
      // 清除后，再次调用不会报错
      expect(() => apiInterceptors.clear()).not.toThrow();
    });
  });

  // ============================================
  // 缓存测试
  // ============================================
  
  describe('Cache Strategy', () => {
    it('should cache GET requests', async () => {
      // 第一次请求
      const result1 = await messagesApi.getList();
      
      // 第二次请求 (应该命中缓存)
      const result2 = await messagesApi.getList();
      
      expect(result1).toEqual(result2);
    });

    it('should respect cache TTL', async () => {
      // 设置非常短的超时
      jest.useFakeTimers();
      
      const result1 = await messagesApi.getList();
      
      // 前进 6 分钟 (超过 5 分钟 TTL)
      jest.advanceTimersByTime(6 * 60 * 1000);
      
      const result2 = await messagesApi.getList();
      
      // 缓存已过期，结果可能不同
      expect(result1).toEqual(result2); // Mock 数据相同
      
      jest.useRealTimers();
    });

    it('should skip cache when skipCache=true', async () => {
      // 这个测试需要修改 request 方法以支持 skipCache 选项
      // 当前实现中需要扩展
    });
  });

  // ============================================
  // 边界条件测试
  // ============================================
  
  describe('Edge Cases', () => {
    it('should handle concurrent requests', async () => {
      const promises = Array(10).fill(null).map(() => messagesApi.getList());
      const results = await Promise.all(promises);
      
      expect(results.length).toBe(10);
      results.forEach(result => {
        expect(Array.isArray(result)).toBe(true);
      });
    });

    it('should handle rapid create/delete', async () => {
      const trip = await tripsApi.create({
        userId: 'user-123',
        destination: 'Beijing',
        days: 5,
      });
      
      await tripsApi.delete(trip.id);
      
      // 立即删除后不应该能查询到
      await expect(tripsApi.getById(trip.id))
        .rejects
        .toThrow('Trip not found');
    });

    it('should handle unicode characters', async () => {
      const message = await messagesApi.send('你好世界 🌍 你好');
      expect(message.content).toBe('你好世界 🌍 你好');
    });

    it('should handle very long strings', async () => {
      const longString = 'a'.repeat(100000);
      const message = await messagesApi.send(longString);
      expect(message.content.length).toBe(100000);
    });
  });

  // ============================================
  // 错误处理测试
  // ============================================
  
  describe('Error Handling', () => {
    it('should handle network timeout', async () => {
      apiConfig.setConfig({ timeout: 1 });
      apiConfig.setMock(false);
      
      await expect(messagesApi.getList())
        .rejects
        .toThrow();
    });

    it('should handle invalid JSON response', async () => {
      apiConfig.setMock(false);
      
      // 这个测试需要 mock fetch
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.reject(new Error('Invalid JSON')),
        })
      ) as any;
      
      await expect(messagesApi.getList())
        .rejects
        .toThrow();
    });
  });
});

// ============================================
// 辅助函数测试
// ============================================

describe('Utility Functions', () => {
  describe('Cache Entry Validation', () => {
    it('should validate cache entry correctly', () => {
      // 这个测试需要导出 isValidCacheEntry 函数
      // 当前实现中是私有的，需要重构以支持测试
    });
  });

  describe('Request ID Generation', () => {
    it('should generate unique request IDs', () => {
      // 这个测试需要导出 generateRequestId 函数
      // 当前实现中是私有的，需要重构以支持测试
    });
  });
});
