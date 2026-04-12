/**
 * API 客户端 - 支持 Mock/Real 切换
 * 特性：请求拦截器、错误处理、重试机制、缓存策略
 */

import type {
  Message,
  Trip,
  Restaurant,
  Attraction,
  TransportOption,
  ApiConfig,
} from './types';
import {
  mockMessages,
  mockTrips,
  mockRestaurants,
  mockAttractions,
  mockTransportRoutes,
} from './mock-data';

// ============================================
// 配置
// ============================================

const defaultConfig: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
  useMock: process.env.NODE_ENV === 'development',
  timeout: 5000, // 降低到 5s
};

let config: ApiConfig = { ...defaultConfig };

// ============================================
// 缓存
// ============================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 分钟

function getCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

function clearCache(): void {
  cache.clear();
}

// ============================================
// 请求拦截器
// ============================================

type RequestInterceptor = (config: RequestInit) => RequestInit;
type ResponseInterceptor = (response: Response) => Response;
type ErrorInterceptor = (error: Error) => Error;

const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];
const errorInterceptors: ErrorInterceptor[] = [];

export const apiInterceptors = {
  addRequest: (fn: RequestInterceptor) => requestInterceptors.push(fn),
  addResponse: (fn: ResponseInterceptor) => responseInterceptors.push(fn),
  addError: (fn: ErrorInterceptor) => errorInterceptors.push(fn),
  clear: () => {
    requestInterceptors.length = 0;
    responseInterceptors.length = 0;
    errorInterceptors.length = 0;
  },
};

// ============================================
// 模拟延迟
// ============================================

const mockDelay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================
// 通用请求方法 (增强版)
// ============================================

interface RequestOptions extends RequestInit {
  skipCache?: boolean;
  skipRetry?: boolean;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { skipCache = false, skipRetry = false, ...fetchOptions } = options;

  // 缓存检查 (仅 GET 请求)
  const cacheKey = `${endpoint}:${JSON.stringify(fetchOptions)}`;
  if (!skipCache && fetchOptions.method === undefined) {
    const cached = getCache<T>(cacheKey);
    if (cached) {
      console.debug(`[API Cache HIT] ${endpoint}`);
      return cached;
    }
  }

  // 请求拦截器
  let finalOptions: RequestInit = { ...fetchOptions };
  for (const interceptor of requestInterceptors) {
    finalOptions = interceptor(finalOptions);
  }

  // 实际请求
  const maxRetries = skipRetry ? 0 : 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (config.useMock) {
        await mockDelay();
        throw new Error('Mock mode - should use dedicated mock methods');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      const response = await fetch(`${config.baseUrl}${endpoint}`, {
        ...finalOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...finalOptions.headers,
        },
      });

      clearTimeout(timeoutId);

      // 响应拦截器
      let processedResponse = response;
      for (const interceptor of responseInterceptors) {
        processedResponse = interceptor(processedResponse);
      }

      if (!processedResponse.ok) {
        throw new Error(`API Error: ${processedResponse.status}`);
      }

      const data = await processedResponse.json();
      
      // 写入缓存
      if (!skipCache && fetchOptions.method === undefined) {
        setCache(cacheKey, data);
      }

      return data;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // 错误拦截器
      for (const interceptor of errorInterceptors) {
        const intercepted = interceptor(lastError);
        if (intercepted !== lastError) {
          lastError = intercepted;
        }
      }

      // 超时重试
      if (
        lastError.message === 'Request timeout' ||
        lastError.message.includes('network') ||
        lastError.message.includes('fetch')
      ) {
        if (attempt < maxRetries) {
          console.warn(`[API] Retry ${attempt + 1}/${maxRetries} for ${endpoint}`);
          await mockDelay(500 * (attempt + 1)); // 指数退避
          continue;
        }
      }

      throw lastError;
    }
  }

  throw lastError || new Error('Request failed');
}

// ============================================
// API 方法
// ============================================

/**
 * 消息 API
 */
export const messagesApi = {
  async getList(): Promise<Message[]> {
    if (config.useMock) {
      await mockDelay();
      return mockMessages;
    }
    return request<Message[]>('/messages');
  },

  async send(content: string): Promise<Message> {
    if (config.useMock) {
      await mockDelay();
      const newMessage: Message = {
        id: String(Date.now()),
        type: 'user',
        content,
        timestamp: new Date().toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      return newMessage;
    }
    return request<Message>('/messages', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
};

/**
 * 行程 API
 */
export const tripsApi = {
  async getList(): Promise<Trip[]> {
    if (config.useMock) {
      await mockDelay();
      return mockTrips;
    }
    return request<Trip[]>('/trips');
  },

  async getById(id: string): Promise<Trip> {
    if (config.useMock) {
      await mockDelay();
      const trip = mockTrips.find((t) => t.id === id);
      if (!trip) throw new Error('Trip not found');
      return trip;
    }
    return request<Trip>(`/trips/${id}`);
  },

  async create(trip: Omit<Trip, 'id'>): Promise<Trip> {
    if (config.useMock) {
      await mockDelay();
      const newTrip: Trip = { ...trip, id: String(Date.now()) };
      mockTrips.push(newTrip);
      return newTrip;
    }
    return request<Trip>('/trips', {
      method: 'POST',
      body: JSON.stringify(trip),
    });
  },

  async update(id: string, trip: Partial<Trip>): Promise<Trip> {
    if (config.useMock) {
      await mockDelay();
      const index = mockTrips.findIndex((t) => t.id === id);
      if (index === -1) throw new Error('Trip not found');
      mockTrips[index] = { ...mockTrips[index], ...trip };
      return mockTrips[index];
    }
    return request<Trip>(`/trips/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(trip),
    });
  },

  async delete(id: string): Promise<void> {
    if (config.useMock) {
      await mockDelay();
      const index = mockTrips.findIndex((t) => t.id === id);
      if (index === -1) throw new Error('Trip not found');
      mockTrips.splice(index, 1);
      return;
    }
    return request<void>(`/trips/${id}`, { method: 'DELETE' });
  },
};

/**
 * 美食 API
 */
export const foodApi = {
  async getList(category?: string): Promise<Restaurant[]> {
    if (config.useMock) {
      await mockDelay();
      if (!category) return mockRestaurants;
      return mockRestaurants.filter((r) => r.cuisine.includes(category));
    }
    return request<Restaurant[]>('/food', {
      method: 'POST',
      body: JSON.stringify({ category }),
    });
  },

  async getById(id: string): Promise<Restaurant> {
    if (config.useMock) {
      await mockDelay();
      const restaurant = mockRestaurants.find((r) => r.id === id);
      if (!restaurant) throw new Error('Restaurant not found');
      return restaurant;
    }
    return request<Restaurant>(`/food/${id}`);
  },

  async search(keyword: string): Promise<Restaurant[]> {
    if (config.useMock) {
      await mockDelay();
      return mockRestaurants.filter(
        (r) =>
          r.name.includes(keyword) ||
          r.cuisine.includes(keyword) ||
          r.location.includes(keyword)
      );
    }
    return request<Restaurant[]>('/food/search', {
      method: 'POST',
      body: JSON.stringify({ keyword }),
    });
  },
};

/**
 * 景点 API
 */
export const attractionApi = {
  async getList(category?: string): Promise<Attraction[]> {
    if (config.useMock) {
      await mockDelay();
      if (!category) return mockAttractions;
      return mockAttractions.filter((a) => a.tags.includes(category));
    }
    return request<Attraction[]>('/attractions', {
      method: 'POST',
      body: JSON.stringify({ category }),
    });
  },

  async getById(id: string): Promise<Attraction> {
    if (config.useMock) {
      await mockDelay();
      const attraction = mockAttractions.find((a) => a.id === id);
      if (!attraction) throw new Error('Attraction not found');
      return attraction;
    }
    return request<Attraction>(`/attractions/${id}`);
  },
};

/**
 * 交通 API
 */
export const transportApi = {
  async getRoutes(from: string, to: string): Promise<TransportOption[]> {
    if (config.useMock) {
      await mockDelay();
      return mockTransportRoutes.default || [];
    }
    return request<TransportOption[]>('/transport', {
      method: 'POST',
      body: JSON.stringify({ from, to }),
    });
  },
};

// ============================================
// 配置管理
// ============================================

export const apiConfig = {
  getConfig: () => ({ ...config }),
  
  setConfig: (newConfig: Partial<ApiConfig>) => {
    config = { ...config, ...newConfig };
    console.log(`[API] Config updated:`, config);
  },
  
  setMock: (useMock: boolean) => {
    config.useMock = useMock;
    console.log(`[API] Mock mode: ${useMock ? 'ON' : 'OFF'}`);
  },
  
  isMock: () => config.useMock,
  
  clearCache: () => clearCache(),
};

// 导出配置供调试使用
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).__API_CONFIG__ = apiConfig;
  (window as unknown as Record<string, unknown>).__API_INTERCEPTORS__ = apiInterceptors;
}
