/**
 * 推荐线路数据 - 中国热门城市行程规划
 * LocalPass
 * 
 * 🚀 性能优化：数据已拆分至 /src/data/ 目录
 * - 按城市分离文件，支持按需加载
 * - 单个文件 <10KB，减少初始包体积
 */

// 重新导出 data 目录的数据
export {
  allItineraries,
  getItineraryByCity,
  getItinerariesByDays,
  getItinerariesByBudget,
  getAvailableCities,
  getFeaturedItineraries,
  // 按城市导出
  shanghai4Days,
  beijing5Days,
  xian3Days,
  chengdu3Days,
  guilin3Days,
  hangzhou2Days,
  // 类型
  type DayPlan,
  type Activity,
  type ItineraryRoute,
} from '@/data';
