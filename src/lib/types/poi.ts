/**
 * POI (Point of Interest) 数据类型定义
 * 数据路线图 P1 阶段 - POI 深度结构化清洗
 * 
 * 定义景点、餐厅、交通等 POI 数据的标准化 Schema
 */

// ============================================
// 基础类型定义
// ============================================

/** 坐标位置 */
export interface Coordinates {
  lat: number;
  lng: number;
}

/** 营业时间 */
export interface BusinessHours {
  regular?: {
    open: string;  // e.g., "09:00"
    close: string;  // e.g., "17:00"
  };
  weekend?: {
    open: string;
    close: string;
  };
  holidays?: {
    open: string;
    close: string;
    note?: string;
  };
  /** 24小时营业 */
  is24Hours?: boolean;
  /** 暂停营业 */
  closed?: boolean;
  /** 备注 */
  note?: string;
}

/** 价格信息 */
export interface PriceInfo {
  /** 门票/消费价格 */
  amount: number;
  /** 货币单位 */
  currency: 'CNY' | 'USD' | 'HKD' | 'JPY';
  /** 价格描述 (如"免费"、"¥50起") */
  display?: string;
  /** 免费 */
  isFree?: boolean;
}

/** 评分信息 */
export interface RatingInfo {
  /** 综合评分 (0-5) */
  overall: number;
  /** 景色评分 */
  scenery?: number;
  /** 服务评分 */
  service?: number;
  /** 性价比评分 */
  value?: number;
  /** 评价数量 */
  reviewCount: number;
  /** 数据来源 */
  source?: string;
}

// ============================================
// POI 核心 Schema
// ============================================

/** POI 基础字段接口 */
export interface POIBase {
  /** 唯一标识符 */
  id: string;
  /** 名称 */
  name: string;
  /** 名称 (英文) */
  nameEn?: string;
  /** 名称 (其他语言) */
  nameI18n?: Record<string, string>;
  /** POI 类型 */
  type: 'attraction' | 'restaurant' | 'hotel' | 'transport' | 'shopping' | 'entertainment' | 'other';
  /** 城市 */
  city: string;
  /** 城市 (英文) */
  cityEn?: string;
  /** 区域/商圈 */
  district?: string;
  /** 具体地址 */
  address: string;
  /** 地址 (英文) */
  addressEn?: string;
  /** 经纬度坐标 */
  coordinates: Coordinates;
  /** 电话 */
  phone?: string;
  /** 官方网站 */
  website?: string;
  /** 官方微信公众号 */
  wechatOfficial?: string;
  /** 预约/购票链接 */
  bookingUrl?: string;
  /** 创建时间 */
  createdAt?: string;
  /** 更新时间 */
  updatedAt?: string;
  /** 数据来源 */
  source?: string;
  /** 数据质量评分 (0-100) */
  qualityScore?: number;
}

// ============================================
// 景点 POI
// ============================================

/** 景点详细信息 */
export interface Attraction extends POIBase {
  type: 'attraction';
  /** 景点类型 */
  category: string[];
  /** 景点等级 (5A, 4A, etc) */
  level?: string;
  /** 简介描述 */
  description?: string;
  /** 详细介绍 */
  detailedDescription?: string;
  /** 最佳游览时长 */
  suggestedDuration?: {
    min: number;  // 分钟
    max?: number;
    display: string;  // e.g., "2-3小时"
  };
  /** 营业时间 */
  businessHours?: BusinessHours;
  /** 门票价格 */
  ticketPrice?: PriceInfo;
  /** 评分 */
  rating?: RatingInfo;
  /** 适宜季节 */
  bestSeason?: string[];
  /** 适宜人群 */
  suitableFor?: string[];
  /** 特色亮点 */
  highlights?: string[];
  /** 游览建议 */
  tips?: string[];
  /** 注意事项 */
  cautions?: string[];
  /** 无障碍设施 */
  accessibility?: {
    wheelchairAccessible: boolean;
    elevatorAvailable: boolean;
    accessibleToilet: boolean;
    note?: string;
  };
  /** 拍照建议 */
  photoSpots?: Array<{
    location: string;
    bestTime?: string;
    tip?: string;
  }>;
  /** 附近配套 */
  nearbyFacilities?: Array<{
    type: string;
    name: string;
    distance: string;
  }>;
  /** AI 生成的本地提示 */
  localTips?: Array<{
    category: string;
    content: string;
    importance: 'high' | 'medium' | 'low';
  }>;
}

// ============================================
// 餐厅 POI
// ============================================

/** 菜系类型 */
export const CuisineTypes = [
  '川菜', '粤菜', '湘菜', '鲁菜', '苏菜', '浙菜', '闽菜', '徽菜',  // 中国八大菜系
  '京菜', '东北菜', '河南菜', '湖北菜', '江西菜', '山西菜', '陕西菜', '云南菜', '贵州菜',
  '火锅', '烧烤', '小吃', '快餐', '西餐', '日料', '韩料', '东南亚菜', '其他'
] as const;

/** 餐厅详细信息 */
export interface Restaurant extends POIBase {
  type: 'restaurant';
  /** 菜系 */
  cuisine: string[];
  /** 人均消费 */
  pricePerPerson?: PriceInfo;
  /** 营业时间 */
  businessHours?: BusinessHours;
  /** 评分 */
  rating?: RatingInfo;
  /** 餐厅特色 */
  features?: Array<
    '老字号' | '网红店' | '米其林' | '黑珍珠' | '必吃榜' | '排队王' | '环境好' | '服务好' | '性价比高' | '当地人常去'
  >;
  /** 推荐菜 */
  recommendedDishes?: Array<{
    name: string;
    nameEn?: string;
    price?: PriceInfo;
    description?: string;
    isSignature?: boolean;
  }>;
  /** 预订方式 */
  reservation?: {
    required: boolean;
    phone?: string;
    website?: string;
    wechat?: string;
  };
  /** 支付方式 */
  paymentMethods?: Array<'现金' | '支付宝' | '微信支付' | '银行卡' | '信用卡' | '外卡' | '云闪付'>;
  /** 外卡支持 */
  foreignCardSupport?: boolean;
  /** 排队情况 */
  queueInfo?: {
    hasQueue: boolean;
    avgWaitMinutes?: number;
    tip?: string;
  };
  /** 停车信息 */
  parking?: {
    available: boolean;
    cost?: string;
    note?: string;
  };
  /** 用餐氛围 */
  atmosphere?: '高档' | '中档' | '亲民' | '快餐' | '路边摊' | '其他';
  /** 适合场景 */
  suitableFor?: Array<'朋友聚餐' | '家庭聚餐' | '商务宴请' | '情侣约会' | '一人食' | '深夜食堂' | '早茶/下午茶'>;
  /** AI 生成的避坑提示 */
  localTips?: Array<{
    category: string;
    content: string;
    importance: 'high' | 'medium' | 'low';
  }>;
}

// ============================================
// 交通 POI
// ============================================

/** 交通详细信息 */
export interface Transport extends POIBase {
  type: 'transport';
  /** 交通子类型 */
  transportType: 'airport' | 'train_station' | 'subway' | 'bus_station' | 'taxi' | 'ferry' | 'other';
  /** 交通详情 */
  details?: Record<string, unknown>;
  /** 运营信息 */
  operationInfo?: {
    operatingHours?: string;
    is24Hours?: boolean;
    note?: string;
  };
  /** 联系方式 */
  contact?: {
    phone?: string;
    website?: string;
  };
  /** AI 生成的交通提示 */
  localTips?: Array<{
    category: string;
    content: string;
    importance: 'high' | 'medium' | 'low';
  }>;
}

// ============================================
// 本地提示 (Local Tips)
// ============================================

/** 本地提示 */
export interface LocalTip {
  id: string;
  /** 提示类别 */
  category: 'transport' | 'payment' | 'safety' | 'communication' | 'food' | 'culture' | 'weather' | 'emergency' | 'other';
  /** 关联城市 */
  city: string;
  /** 关联 POI ID (可选) */
  poiId?: string;
  /** 标题 */
  title: string;
  /** 标题 (英文) */
  titleEn?: string;
  /** 内容 */
  content: string;
  /** 内容 (英文) */
  contentEn?: string;
  /** 重要性 */
  importance: 'high' | 'medium' | 'low';
  /** 适用季节 */
  applicableSeason?: Array<'春' | '夏' | '秋' | '冬' | '全年'>;
  /** 标签 */
  tags?: string[];
  /** 来源 */
  source?: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

// ============================================
// Union Type
// ============================================

/** POI 联合类型 */
export type POI = Attraction | Restaurant | Transport;

/** POI 数据包 (包含多种 POI 类型) */
export interface POIDataPackage {
  attractions: Attraction[];
  restaurants: Restaurant[];
  transports: Transport[];
  localTips: LocalTip[];
  /** 数据生成时间 */
  generatedAt: string;
  /** 数据版本 */
  version: string;
}

export default {
  POIBase,
  Attraction,
  Restaurant,
  Transport,
  LocalTip,
  POI,
  POIDataPackage,
  CuisineTypes,
};
