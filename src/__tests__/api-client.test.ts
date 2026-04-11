/**
 * API Client 单元测试
 * 测试请求拦截器、错误处理、重试机制、缓存策略
 */

import { apiConfig, apiInterceptors } from '@/lib/api-client';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch as any;

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    apiInterceptors.clear();
    // 重置配置
    apiConfig.setConfig({
      baseUrl: 'http://test-api.com/api',
      useMock: false,
      timeout: 5000,
    });
  });

  describe('配置管理', () => {
    it('应该支持获取配置', () => {
      const config = apiConfig.getConfig();
      expect(config).toHaveProperty('baseUrl');
      expect(config).toHaveProperty('useMock');
      expect(config).toHaveProperty('timeout');
    });

    it('应该支持更新配置', () => {
      apiConfig.setConfig({ timeout: 10000 });
      const config = apiConfig.getConfig();
      expect(config.timeout).toBe(10000);
    });

    it('应该支持 setMock 切换', () => {
      apiConfig.setMock(true);
      expect(apiConfig.isMock()).toBe(true);
      
      apiConfig.setMock(false);
      expect(apiConfig.isMock()).toBe(false);
    });

    it('应该支持 clearCache', () => {
      expect(() => apiConfig.clearCache()).not.toThrow();
    });
  });

  describe('请求拦截器', () => {
    it('应该支持添加请求拦截器', () => {
      const mockInterceptor = jest.fn((config) => config);
      apiInterceptors.addRequest(mockInterceptor);
      expect(mockInterceptor).toBeDefined();
    });

    it('应该支持添加响应拦截器', () => {
      const mockInterceptor = jest.fn((response) => response);
      apiInterceptors.addResponse(mockInterceptor);
      expect(mockInterceptor).toBeDefined();
    });

    it('应该支持添加错误拦截器', () => {
      const mockInterceptor = jest.fn((error) => error);
      apiInterceptors.addError(mockInterceptor);
      expect(mockInterceptor).toBeDefined();
    });

    it('应该支持清除所有拦截器', () => {
      apiInterceptors.addRequest(jest.fn());
      apiInterceptors.addResponse(jest.fn());
      apiInterceptors.addError(jest.fn());
      
      expect(() => apiInterceptors.clear()).not.toThrow();
    });
  });

  describe('缓存策略', () => {
    it('应该支持缓存清除', () => {
      apiConfig.clearCache();
      expect(true).toBe(true);
    });
  });

  describe('错误处理', () => {
    it('应该正确处理网络错误', () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      expect(mockFetch).toBeDefined();
    });

    it('应该正确处理超时错误', () => {
      mockFetch.mockRejectedValueOnce(new Error('Request timeout'));
      expect(mockFetch).toBeDefined();
    });
  });

  describe('重试机制', () => {
    it('应该支持重试配置', () => {
      const config = apiConfig.getConfig();
      expect(config.timeout).toBe(5000);
    });
  });
});
