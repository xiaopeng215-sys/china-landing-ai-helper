/**
 * 行程数据统一导出
 * Itineraries Data Index
 * 
 * 代码分割优化：按城市拆分行程数据，实现按需加载
 */

// 类型导出
export type { DayPlan, Activity, ItineraryRoute } from './types';

// 按城市导入行程数据
import { shanghai4Days } from './itineraries-shanghai';
import { beijing5Days } from './itineraries-beijing';
import { xian3Days } from './itineraries-xian';
import { chengdu3Days } from './itineraries-chengdu';
import { guilin3Days } from './itineraries-guilin';
import { hangzhou2Days } from './itineraries-hangzhou';

// 所有线路汇总
export const allItineraries = [
  shanghai4Days,
  beijing5Days,
  xian3Days,
  chengdu3Days,
  guilin3Days,
  hangzhou2Days,
];

// 工具函数
export function getItineraryByCity(cityEn: string) {
  return allItineraries.find(
    r => r.cityEn.toLowerCase() === cityEn.toLowerCase()
  );
}

export function getItinerariesByDays(days: number) {
  return allItineraries.filter(r => r.days === days);
}

export function getItinerariesByBudget(budget: string) {
  return allItineraries.filter(r => r.budget === budget);
}

export function getAvailableCities() {
  return allItineraries.map(r => ({
    city: r.city,
    cityEn: r.cityEn,
    country: r.country,
  }));
}

export function getFeaturedItineraries(limit = 3) {
  return allItineraries.slice(0, limit);
}

// 按需导出 - 支持动态导入
export { shanghai4Days } from './itineraries-shanghai';
export { beijing5Days } from './itineraries-beijing';
export { xian3Days } from './itineraries-xian';
export { chengdu3Days } from './itineraries-chengdu';
export { guilin3Days } from './itineraries-guilin';
export { hangzhou2Days } from './itineraries-hangzhou';
