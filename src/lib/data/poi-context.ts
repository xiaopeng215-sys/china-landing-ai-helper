/**
 * POI 数据上下文注入模块
 * 数据路线图 P1 阶段 - 为聊天 API 提供结构化 POI 数据
 * 
 * 当用户问景点/餐厅时，从结构化 POI 数据中提取相关信息
 */

import type { Attraction, Restaurant, Transport, LocalTip } from '../types/poi';
import { validatePOIData } from './poi-validator';

// ============================================
// POI 数据加载
// ============================================

/** POI 缓存 */
let poiCache: {
  attractions: Map<string, Attraction>;
  restaurants: Map<string, Restaurant>;
  transports: Map<string, Transport>;
  localTips: LocalTip[];
  loadedAt: number;
} | null = null;

const CACHE_TTL = 5 * 60 * 1000; // 5 分钟缓存

/**
 * 从数据文件加载 POI 数据
 */
async function loadPOIData(): Promise<typeof poiCache> {
  if (poiCache && Date.now() - poiCache.loadedAt < CACHE_TTL) {
    return poiCache;
  }

  const attractions = new Map<string, Attraction>();
  const restaurants = new Map<string, Restaurant>();
  const transports = new Map<string, Transport>();
  const localTips: LocalTip[] = [];

  try {
    // 动态导入数据文件
    const [
      essentials,
    ] = await Promise.all([
      import('../data/essentials').catch(() => null),
    ]);

    // 从 essentials 提取 POI 数据
    if (essentials?.default?.cities) {
      for (const city of essentials.default.cities) {
        // 提取景点
        if (city.attractions) {
          for (const attraction of city.attractions) {
            const a: Attraction = {
              id: attraction.id || `attr-${attractions.size + 1}`,
              name: attraction.name,
              nameEn: attraction.nameEn,
              type: 'attraction',
              city: city.name,
              cityEn: city.nameEn,
              address: attraction.address || '',
              coordinates: attraction.coordinates || { lat: 0, lng: 0 },
              description: attraction.description,
              category: attraction.category || [],
              ticketPrice: attraction.ticketPrice ? {
                amount: parseFloat(String(attraction.ticketPrice).replace(/[^0-9.]/g, '')) || 0,
                currency: 'CNY',
                display: String(attraction.ticketPrice),
              } : undefined,
              businessHours: attraction.businessHours ? {
                regular: typeof attraction.businessHours === 'string' 
                  ? { open: '09:00', close: attraction.businessHours }
                  : attraction.businessHours,
              } : undefined,
              highlights: attraction.highlights,
              tips: attraction.tips,
              level: attraction.level,
              rating: attraction.rating,
              source: 'essentials',
              qualityScore: 60,
            };
            
            // 验证并过滤
            const validation = validatePOIData(a);
            if (validation.qualityScore >= 40) {
              attractions.set(a.id, a);
            }
          }
        }

        // 提取餐厅
        if (city.restaurants) {
          for (const restaurant of city.restaurants) {
            const r: Restaurant = {
              id: restaurant.id || `rest-${restaurants.size + 1}`,
              name: restaurant.name,
              nameEn: restaurant.nameEn,
              type: 'restaurant',
              city: city.name,
              cityEn: city.nameEn,
              address: restaurant.address || '',
              coordinates: restaurant.coordinates || { lat: 0, lng: 0 },
              cuisine: restaurant.cuisine || [],
              description: restaurant.description,
              pricePerPerson: restaurant.pricePerPerson ? {
                amount: parseFloat(String(restaurant.pricePerPerson).replace(/[^0-9.]/g, '')) || 0,
                currency: 'CNY',
                display: String(restaurant.pricePerPerson),
              } : undefined,
              businessHours: restaurant.businessHours ? {
                regular: typeof restaurant.businessHours === 'string'
                  ? { open: '09:00', close: restaurant.businessHours }
                  : restaurant.businessHours,
              } : undefined,
              features: restaurant.features,
              recommendedDishes: restaurant.recommendedDishes,
              rating: restaurant.rating,
              source: 'essentials',
              qualityScore: 60,
            };
            
            const validation = validatePOIData(r);
            if (validation.qualityScore >= 40) {
              restaurants.set(r.id, r);
            }
          }
        }

        // 提取交通
        if (city.transport) {
          for (const transport of city.transport) {
            const t: Transport = {
              id: transport.id || `trans-${transports.size + 1}`,
              name: transport.name,
              nameEn: transport.nameEn,
              type: 'transport',
              city: city.name,
              cityEn: city.nameEn,
              address: transport.address || '',
              coordinates: transport.coordinates || { lat: 0, lng: 0 },
              transportType: transport.type || 'other',
              operationInfo: transport.operationInfo,
              source: 'essentials',
              qualityScore: 50,
            };
            transports.set(t.id, t);
          }
        }

        // 提取本地提示
        if (city.localTips) {
          for (const tip of city.localTips) {
            localTips.push({
              id: tip.id || `tip-${localTips.length + 1}`,
              category: tip.category || 'other',
              city: city.name,
              title: tip.title,
              content: tip.content,
              importance: tip.importance || 'medium',
              tags: tip.tags,
              source: 'essentials',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        }
      }
    }

    poiCache = {
      attractions,
      restaurants,
      transports,
      localTips,
      loadedAt: Date.now(),
    };

    console.log(`📍 [POI Context] 加载完成: ${attractions.size} 景点, ${restaurants.size} 餐厅, ${transports.size} 交通, ${localTips.length} 提示`);

    return poiCache;
  } catch (error) {
    console.error('❌ [POI Context] 加载失败:', error);
    return poiCache || {
      attractions: new Map(),
      restaurants: new Map(),
      transports: new Map(),
      localTips: [],
      loadedAt: Date.now(),
    };
  }
}

// ============================================
// 查询接口
// ============================================

/**
 * 搜索景点
 */
export async function searchAttractions(
  query: string,
  options?: {
    city?: string;
    limit?: number;
  }
): Promise<Attraction[]> {
  const data = await loadPOIData();
  const results: Array<Attraction & { relevance: number }> = [];
  const queryLower = query.toLowerCase();

  for (const attraction of data.attractions.values()) {
    // 城市过滤
    if (options?.city && attraction.city !== options.city) {
      continue;
    }

    // 计算相关性
    let relevance = 0;
    if (attraction.name.toLowerCase().includes(queryLower)) relevance += 10;
    if (attraction.nameEn?.toLowerCase().includes(queryLower)) relevance += 8;
    if (attraction.description?.toLowerCase().includes(queryLower)) relevance += 3;
    if (attraction.category?.some(c => c.toLowerCase().includes(queryLower))) relevance += 5;
    if (attraction.highlights?.some(h => h.toLowerCase().includes(queryLower))) relevance += 4;

    if (relevance > 0) {
      results.push({ ...attraction, relevance });
    }
  }

  // 按相关性排序
  results.sort((a, b) => b.relevance - a.relevance);

  return results.slice(0, options?.limit || 5);
}

/**
 * 搜索餐厅
 */
export async function searchRestaurants(
  query: string,
  options?: {
    city?: string;
    cuisine?: string;
    limit?: number;
  }
): Promise<Restaurant[]> {
  const data = await loadPOIData();
  const results: Array<Restaurant & { relevance: number }> = [];
  const queryLower = query.toLowerCase();

  for (const restaurant of data.restaurants.values()) {
    // 过滤
    if (options?.city && restaurant.city !== options.city) continue;
    if (options?.cuisine && !restaurant.cuisine?.includes(options.cuisine)) continue;

    // 计算相关性
    let relevance = 0;
    if (restaurant.name.toLowerCase().includes(queryLower)) relevance += 10;
    if (restaurant.nameEn?.toLowerCase().includes(queryLower)) relevance += 8;
    if (restaurant.description?.toLowerCase().includes(queryLower)) relevance += 3;
    if (restaurant.cuisine?.some(c => c.toLowerCase().includes(queryLower))) relevance += 5;
    if (restaurant.recommendedDishes?.some(d => d.name.toLowerCase().includes(queryLower))) relevance += 4;

    if (relevance > 0) {
      results.push({ ...restaurant, relevance });
    }
  }

  results.sort((a, b) => b.relevance - a.relevance);

  return results.slice(0, options?.limit || 5);
}

/**
 * 获取城市的景点列表
 */
export async function getCityAttractions(city: string): Promise<Attraction[]> {
  const data = await loadPOIData();
  const results: Attraction[] = [];

  for (const attraction of data.attractions.values()) {
    if (attraction.city === city || attraction.cityEn === city) {
      results.push(attraction);
    }
  }

  return results;
}

/**
 * 获取城市的餐厅列表
 */
export async function getCityRestaurants(city: string): Promise<Restaurant[]> {
  const data = await loadPOIData();
  const results: Restaurant[] = [];

  for (const restaurant of data.restaurants.values()) {
    if (restaurant.city === city || restaurant.cityEn === city) {
      results.push(restaurant);
    }
  }

  return results;
}

/**
 * 获取城市的本地提示
 */
export async function getCityTips(city: string): Promise<LocalTip[]> {
  const data = await loadPOIData();
  return data.localTips.filter(tip => 
    tip.city === city || 
    tip.city.toLowerCase().includes(city.toLowerCase())
  );
}

// ============================================
// 上下文格式化
// ============================================

/**
 * 格式化景点为文本上下文
 */
export function formatAttractionContext(attraction: Attraction, language: string = 'zh-CN'): string {
  const isZh = language === 'zh-CN' || language === 'zh-TW';
  
  let context = `\n## ${attraction.name}${attraction.nameEn ? ` (${attraction.nameEn})` : ''}\n`;
  
  if (attraction.level) {
    context += `- 等级: ${attraction.level}\n`;
  }
  
  if (attraction.category?.length) {
    context += `- 类别: ${attraction.category.join(', ')}\n`;
  }
  
  if (attraction.description) {
    context += `- 简介: ${attraction.description}\n`;
  }
  
  if (attraction.ticketPrice) {
    const price = attraction.ticketPrice.isFree 
      ? '免费' 
      : `${attraction.ticketPrice.display || `¥${attraction.ticketPrice.amount}`}`;
    context += `- 门票: ${price}\n`;
  }
  
  if (attraction.businessHours) {
    if (attraction.businessHours.is24Hours) {
      context += `- 营业时间: 24小时营业\n`;
    } else if (attraction.businessHours.closed) {
      context += `- 营业时间: 暂停营业\n`;
    } else if (attraction.businessHours.regular) {
      context += `- 营业时间: ${attraction.businessHours.regular.open} - ${attraction.businessHours.regular.close}\n`;
    }
  }
  
  if (attraction.highlights?.length) {
    context += `- 亮点: ${attraction.highlights.join('; ')}\n`;
  }
  
  if (attraction.tips?.length) {
    context += `- 建议: ${attraction.tips.join('; ')}\n`;
  }
  
  if (attraction.address) {
    context += `- 地址: ${attraction.address}\n`;
  }
  
  if (attraction.bookingUrl) {
    context += `- 预约: ${attraction.bookingUrl}\n`;
  }
  
  if (attraction.localTips?.length) {
    context += `\n⚠️ 本地提示:\n`;
    for (const tip of attraction.localTips) {
      if (tip.importance === 'high') {
        context += `- [重要] ${tip.content}\n`;
      }
    }
  }
  
  return context;
}

/**
 * 格式化餐厅为文本上下文
 */
export function formatRestaurantContext(restaurant: Restaurant, language: string = 'zh-CN'): string {
  const isZh = language === 'zh-CN' || language === 'zh-TW';
  
  let context = `\n## ${restaurant.name}${restaurant.nameEn ? ` (${restaurant.nameEn})` : ''}\n`;
  
  if (restaurant.cuisine?.length) {
    context += `- 菜系: ${restaurant.cuisine.join(', ')}\n`;
  }
  
  if (restaurant.pricePerPerson) {
    context += `- 人均: ${restaurant.pricePerPerson.display || `¥${restaurant.pricePerPerson.amount}`}\n`;
  }
  
  if (restaurant.features?.length) {
    context += `- 特色: ${restaurant.features.join(', ')}\n`;
  }
  
  if (restaurant.description) {
    context += `- 简介: ${restaurant.description}\n`;
  }
  
  if (restaurant.recommendedDishes?.length) {
    context += `- 推荐菜:\n`;
    for (const dish of restaurant.recommendedDishes.slice(0, 5)) {
      context += `  - ${dish.name}${dish.price ? ` (${dish.price.display || `¥${dish.price.amount}`})` : ''}\n`;
    }
  }
  
  if (restaurant.businessHours) {
    if (restaurant.businessHours.is24Hours) {
      context += `- 营业时间: 24小时营业\n`;
    } else if (restaurant.businessHours.regular) {
      context += `- 营业时间: ${restaurant.businessHours.regular.open} - ${restaurant.businessHours.regular.close}\n`;
    }
  }
  
  if (restaurant.paymentMethods?.length) {
    context += `- 支付: ${restaurant.paymentMethods.join(', ')}\n`;
  }
  
  if (restaurant.foreignCardSupport) {
    context += `- 💳 支持外卡\n`;
  }
  
  if (restaurant.queueInfo?.hasQueue) {
    context += `- ⚠️ 可能需要排队${restaurant.queueInfo.avgWaitMinutes ? ` (约${restaurant.queueInfo.avgWaitMinutes}分钟)` : ''}\n`;
  }
  
  if (restaurant.address) {
    context += `- 地址: ${restaurant.address}\n`;
  }
  
  if (restaurant.reservation?.required) {
    context += `- 需要预约: ${restaurant.reservation.phone || restaurant.reservation.wechat || ''}\n`;
  }
  
  if (restaurant.localTips?.length) {
    context += `\n⚠️ 本地提示:\n`;
    for (const tip of restaurant.localTips) {
      if (tip.importance === 'high') {
        context += `- [重要] ${tip.content}\n`;
      }
    }
  }
  
  return context;
}

// ============================================
// 主入口：从聊天消息中提取 POI 上下文
// ============================================

export interface POIContextResult {
  /** 上下文文本 */
  context: string;
  /** 找到的景点 */
  attractions: Attraction[];
  /** 找到的餐厅 */
  restaurants: Restaurant[];
  /** 找到的交通 */
  transports: Transport[];
  /** 相关的本地提示 */
  localTips: LocalTip[];
  /** 使用的城市 */
  cities: string[];
}

/**
 * 从聊天消息中提取 POI 上下文
 * 
 * 分析用户消息，识别提到的城市、景点、餐厅，
 * 然后返回相关的结构化数据
 */
export async function extractPOIContext(
  message: string,
  options?: {
    language?: string;
    city?: string;
  }
): Promise<POIContextResult> {
  const result: POIContextResult = {
    context: '',
    attractions: [],
    restaurants: [],
    transports: [],
    localTips: [],
    cities: [],
  };

  const messageLower = message.toLowerCase();
  const language = options?.language || 'zh-CN';

  // 识别城市
  const cityPatterns: Record<string, RegExp> = {
    '北京': /北京|beijing/i,
    '上海': /上海|shanghai/i,
    '成都': /成都|chengdu/i,
    '西安': /西安|xi'?an|xian/i,
    '杭州': /杭州|hangzhou/i,
    '桂林': /桂林|guilin/i,
    '广州': /广州|guangzhou/i,
    '深圳': /深圳|shenzhen/i,
  };

  for (const [city, pattern] of Object.entries(cityPatterns)) {
    if (pattern.test(message)) {
      result.cities.push(city);
    }
  }

  // 如果没有指定城市，使用消息中识别的城市
  const targetCities = options?.city ? [options.city] : result.cities;
  
  if (targetCities.length === 0) {
    return result; // 没有识别到城市，返回空
  }

  // 搜索景点
  const attractionKeywords = ['景点', '景区', '旅游', '游览', '参观', '玩', 'attraction', 'sightseeing', 'visit'];
  const restaurantKeywords = ['餐厅', '饭店', '吃饭', '美食', '餐馆', 'restaurant', 'food', 'dining', 'eat'];
  
  const isAskingAttraction = attractionKeywords.some(k => messageLower.includes(k));
  const isAskingRestaurant = restaurantKeywords.some(k => messageLower.includes(k));

  // 提取景点名称
  for (const city of targetCities) {
    const cityAttractions = await getCityAttractions(city);
    
    for (const attraction of cityAttractions) {
      if (
        attraction.name.toLowerCase().includes(messageLower) ||
        attraction.nameEn?.toLowerCase().includes(messageLower) ||
        messageLower.includes(attraction.name.toLowerCase()) ||
        messageLower.includes(attraction.nameEn?.toLowerCase() || '')
      ) {
        result.attractions.push(attraction);
      }
    }

    // 如果用户问景点但没有指定具体地点，返回该城市的所有景点
    if (isAskingAttraction && result.attractions.length === 0) {
      result.attractions.push(...cityAttractions.slice(0, 5));
    }

    // 搜索餐厅
    const cityRestaurants = await getCityRestaurants(city);
    
    for (const restaurant of cityRestaurants) {
      if (
        restaurant.name.toLowerCase().includes(messageLower) ||
        restaurant.nameEn?.toLowerCase().includes(messageLower) ||
        messageLower.includes(restaurant.name.toLowerCase()) ||
        messageLower.includes(restaurant.nameEn?.toLowerCase() || '')
      ) {
        result.restaurants.push(restaurant);
      }
    }

    if (isAskingRestaurant && result.restaurants.length === 0) {
      result.restaurants.push(...cityRestaurants.slice(0, 5));
    }

    // 获取本地提示
    const tips = await getCityTips(city);
    result.localTips.push(...tips.filter(t => t.importance === 'high'));
  }

  // 去重
  result.attractions = result.attractions.filter((a, i, arr) => 
    arr.findIndex(x => x.id === a.id) === i
  );
  result.restaurants = result.restaurants.filter((r, i, arr) => 
    arr.findIndex(x => x.id === r.id) === i
  );
  result.localTips = result.localTips.filter((t, i, arr) => 
    arr.findIndex(x => x.id === t.id) === i
  );

  // 限制数量
  result.attractions = result.attractions.slice(0, 5);
  result.restaurants = result.restaurants.slice(0, 5);
  result.localTips = result.localTips.slice(0, 10);

  // 格式化上下文文本
  if (result.attractions.length > 0) {
    result.context += `\n\n=== 相关景点信息 ===`;
    for (const attraction of result.attractions) {
      result.context += formatAttractionContext(attraction, language);
    }
  }

  if (result.restaurants.length > 0) {
    result.context += `\n\n=== 相关餐厅信息 ===`;
    for (const restaurant of result.restaurants) {
      result.context += formatRestaurantContext(restaurant, language);
    }
  }

  if (result.localTips.length > 0) {
    result.context += `\n\n=== 本地重要提示 ===`;
    for (const tip of result.localTips) {
      result.context += `\n⚠️ [${tip.category}] ${tip.title}: ${tip.content}`;
    }
  }

  return result;
}

/**
 * 生成 POI 上下文字符串用于注入到 system prompt
 */
export async function generatePOIContextForChat(
  message: string,
  options?: {
    language?: string;
    city?: string;
    maxLength?: number;
  }
): Promise<string> {
  const poiContext = await extractPOIContext(message, options);
  
  if (!poiContext.context) {
    return '';
  }

  // 如果太长，截断
  const maxLength = options?.maxLength || 3000;
  if (poiContext.context.length > maxLength) {
    return poiContext.context.substring(0, maxLength) + '\n\n...(数据截断)...';
  }

  return poiContext.context;
}
