/**
 * POI 数据验证工具
 * 数据路线图 P1 阶段 - 数据清洗与标准化
 * 
 * 提供 POI 数据完整性和质量验证功能
 */

import type { POI, Attraction, Restaurant, Transport, LocalTip } from './types/poi';

// ============================================
// 验证结果类型
// ============================================

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  /** 数据质量评分 (0-100) */
  qualityScore: number;
  /** 字段填充率 */
  fieldCompletionRate: number;
}

// ============================================
// 必填字段定义
// ============================================

/** 基础 POI 必填字段 */
const BASE_REQUIRED_FIELDS = [
  'id',
  'name',
  'type',
  'city',
  'coordinates',
  'address',
] as const;

/** 景点额外必填字段 */
const ATTRACTION_REQUIRED_FIELDS = [
  'category',
  'ticketPrice',
  'businessHours',
] as const;

/** 餐厅额外必填字段 */
const RESTAURANT_REQUIRED_FIELDS = [
  'cuisine',
  'pricePerPerson',
  'businessHours',
] as const;

/** 交通额外必填字段 */
const TRANSPORT_REQUIRED_FIELDS = [
  'transportType',
] as const;

// ============================================
// 质量评分权重
// ============================================

/** 字段质量权重表 */
const FIELD_WEIGHTS: Record<string, number> = {
  // 基础字段
  id: 5,
  name: 10,
  nameEn: 3,
  city: 10,
  coordinates: 15,
  address: 8,
  phone: 5,
  website: 3,
  bookingUrl: 5,
  
  // 景点字段
  category: 8,
  level: 3,
  description: 5,
  ticketPrice: 10,
  businessHours: 8,
  rating: 5,
  highlights: 3,
  tips: 3,
  
  // 餐厅字段
  cuisine: 10,
  pricePerPerson: 8,
  features: 3,
  recommendedDishes: 5,
  paymentMethods: 3,
  
  // 交通字段
  transportType: 10,
  operationInfo: 5,
};

// ============================================
// 验证函数
// ============================================

/**
 * 验证 POI 基础字段
 */
function validateBaseFields(poi: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];
  
  for (const field of BASE_REQUIRED_FIELDS) {
    if (!poi[field]) {
      errors.push({
        field,
        message: `缺少必填字段: ${field}`,
        severity: 'error',
      });
    }
  }
  
  // 验证坐标
  if (poi.coordinates) {
    const coords = poi.coordinates as Record<string, unknown>;
    if (typeof coords.lat !== 'number' || typeof coords.lng !== 'number') {
      errors.push({
        field: 'coordinates',
        message: '坐标格式错误，需要 { lat: number, lng: number }',
        severity: 'error',
      });
    } else {
      if (coords.lat < -90 || coords.lat > 90) {
        errors.push({
          field: 'coordinates.lat',
          message: '纬度必须在 -90 到 90 之间',
          severity: 'error',
        });
      }
      if (coords.lng < -180 || coords.lng > 180) {
        errors.push({
          field: 'coordinates.lng',
          message: '经度必须在 -180 到 180 之间',
          severity: 'error',
        });
      }
    }
  }
  
  return errors;
}

/**
 * 验证景点字段
 */
function validateAttractionFields(poi: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];
  
  for (const field of ATTRACTION_REQUIRED_FIELDS) {
    if (!poi[field]) {
      errors.push({
        field,
        message: `景点缺少必填字段: ${field}`,
        severity: 'error',
      });
    }
  }
  
  // 验证门票价格
  if (poi.ticketPrice) {
    const price = poi.ticketPrice as Record<string, unknown>;
    if (typeof price.amount !== 'number' || price.amount < 0) {
      errors.push({
        field: 'ticketPrice.amount',
        message: '门票价格必须为非负数字',
        severity: 'error',
      });
    }
  }
  
  // 验证营业时间格式
  if (poi.businessHours) {
    const hours = poi.businessHours as Record<string, unknown>;
    if (!hours.is24Hours && !hours.closed && !hours.regular) {
      errors.push({
        field: 'businessHours',
        message: '营业时间必须包含 regular 或标记 is24Hours/closed',
        severity: 'warning',
      });
    }
  }
  
  return errors;
}

/**
 * 验证餐厅字段
 */
function validateRestaurantFields(poi: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];
  
  for (const field of RESTAURANT_REQUIRED_FIELDS) {
    if (!poi[field]) {
      errors.push({
        field,
        message: `餐厅缺少必填字段: ${field}`,
        severity: 'error',
      });
    }
  }
  
  // 验证菜系
  if (poi.cuisine && !Array.isArray(poi.cuisine)) {
    errors.push({
      field: 'cuisine',
      message: '菜系必须为数组',
      severity: 'error',
    });
  }
  
  // 验证人均价格
  if (poi.pricePerPerson) {
    const price = poi.pricePerPerson as Record<string, unknown>;
    if (typeof price.amount !== 'number' || price.amount < 0) {
      errors.push({
        field: 'pricePerPerson.amount',
        message: '人均价格必须为非负数字',
        severity: 'error',
      });
    }
  }
  
  return errors;
}

/**
 * 验证交通字段
 */
function validateTransportFields(poi: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];
  
  for (const field of TRANSPORT_REQUIRED_FIELDS) {
    if (!poi[field]) {
      errors.push({
        field,
        message: `交通缺少必填字段: ${field}`,
        severity: 'error',
      });
    }
  }
  
  return errors;
}

/**
 * 计算字段填充率
 */
function calculateFieldCompletionRate(poi: Record<string, unknown>): number {
  const allFields = Object.keys(FIELD_WEIGHTS);
  const filledFields = allFields.filter(f => poi[f] !== undefined && poi[f] !== null && poi[f] !== '');
  
  return Math.round((filledFields.length / allFields.length) * 100);
}

/**
 * 计算数据质量评分
 */
function calculateQualityScore(poi: Record<string, unknown>): number {
  let score = 0;
  let totalWeight = 0;
  
  for (const [field, weight] of Object.entries(FIELD_WEIGHTS)) {
    totalWeight += weight;
    if (poi[field] !== undefined && poi[field] !== null && poi[field] !== '') {
      score += weight;
    }
  }
  
  return Math.round((score / totalWeight) * 100);
}

/**
 * 验证 POI 数据完整性 (主要入口函数)
 * 
 * @param poi - POI 数据对象
 * @returns 验证结果，包含错误、警告、质量评分
 * 
 * @example
 * const result = validatePOIData(myPOI);
 * if (!result.valid) {
 *   console.log('验证失败:', result.errors);
 * }
 * console.log('质量评分:', result.qualityScore);
 */
export function validatePOIData(poi: unknown): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  // 基本类型检查
  if (!poi || typeof poi !== 'object') {
    return {
      valid: false,
      errors: [{ field: '_root', message: 'POI 数据格式错误', severity: 'error' }],
      warnings: [],
      qualityScore: 0,
      fieldCompletionRate: 0,
    };
  }
  
  const p = poi as Record<string, unknown>;
  
  // 验证基础字段
  errors.push(...validateBaseFields(p));
  
  // 根据类型验证特定字段
  switch (p.type) {
    case 'attraction':
      errors.push(...validateAttractionFields(p));
      break;
    case 'restaurant':
      errors.push(...validateRestaurantFields(p));
      break;
    case 'transport':
      errors.push(...validateTransportFields(p));
      break;
  }
  
  // 检查数据时效性
  if (p.updatedAt) {
    const updatedTime = new Date(p.updatedAt as string).getTime();
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    
    if (now - updatedTime > thirtyDays) {
      warnings.push({
        field: 'updatedAt',
        message: '数据超过 30 天未更新，可能已过时',
        severity: 'warning',
      });
    }
  } else {
    warnings.push({
      field: 'updatedAt',
      message: '缺少更新时间，无法判断数据时效性',
      severity: 'info',
    });
  }
  
  // 检查描述长度
  if (p.description && (p.description as string).length < 20) {
    warnings.push({
      field: 'description',
      message: '描述过短，可能信息不足',
      severity: 'warning',
    });
  }
  
  // 景点特殊检查
  if (p.type === 'attraction') {
    const attraction = p as Partial<Attraction>;
    if (!attraction.highlights || attraction.highlights.length === 0) {
      warnings.push({
        field: 'highlights',
        message: '景点缺少亮点描述',
        severity: 'warning',
      });
    }
    if (!attraction.tips || attraction.tips.length === 0) {
      warnings.push({
        field: 'tips',
        message: '景点缺少游览建议',
        severity: 'info',
      });
    }
  }
  
  // 餐厅特殊检查
  if (p.type === 'restaurant') {
    const restaurant = p as Partial<Restaurant>;
    if (!restaurant.recommendedDishes || restaurant.recommendedDishes.length === 0) {
      warnings.push({
        field: 'recommendedDishes',
        message: '餐厅缺少推荐菜',
        severity: 'warning',
      });
    }
    if (!restaurant.paymentMethods || restaurant.paymentMethods.length === 0) {
      warnings.push({
        field: 'paymentMethods',
        message: '餐厅缺少支付方式信息',
        severity: 'info',
      });
    }
  }
  
  return {
    valid: errors.filter(e => e.severity === 'error').length === 0,
    errors: errors.filter(e => e.severity === 'error'),
    warnings,
    qualityScore: calculateQualityScore(p),
    fieldCompletionRate: calculateFieldCompletionRate(p),
  };
}

/**
 * 批量验证 POI 列表
 * 
 * @param pois - POI 数据数组
 * @returns 验证结果数组和汇总统计
 */
export function validatePOIList(
  pois: unknown[]
): {
  results: Array<{ id: string; result: ValidationResult }>;
  summary: {
    total: number;
    valid: number;
    invalid: number;
    averageScore: number;
    averageCompletionRate: number;
  };
} {
  const results: Array<{ id: string; result: ValidationResult }> = [];
  let totalScore = 0;
  let totalCompletionRate = 0;
  
  for (const poi of pois) {
    const p = poi as Record<string, unknown>;
    const result = validatePOIData(poi);
    
    results.push({
      id: (p.id as string) || 'unknown',
      result,
    });
    
    totalScore += result.qualityScore;
    totalCompletionRate += result.fieldCompletionRate;
  }
  
  return {
    results,
    summary: {
      total: pois.length,
      valid: results.filter(r => r.result.valid).length,
      invalid: results.filter(r => !r.result.valid).length,
      averageScore: Math.round(totalScore / pois.length),
      averageCompletionRate: Math.round(totalCompletionRate / pois.length),
    },
  };
}

/**
 * 检查 POI 数据完整性 (快速检查)
 * 
 * @param poi - POI 数据
 * @returns 是否完整
 */
export function isPOIComplete(poi: unknown): boolean {
  const result = validatePOIData(poi);
  return result.valid;
}

/**
 * 获取 POI 缺失的必填字段
 * 
 * @param poi - POI 数据
 * @returns 缺失字段列表
 */
export function getMissingFields(poi: unknown): string[] {
  const missing: string[] = [];
  
  if (!poi || typeof poi !== 'object') {
    return ['_root'];
  }
  
  const p = poi as Record<string, unknown>;
  
  // 检查基础字段
  for (const field of BASE_REQUIRED_FIELDS) {
    if (!p[field]) {
      missing.push(field);
    }
  }
  
  // 根据类型检查特定字段
  switch (p.type) {
    case 'attraction':
      for (const field of ATTRACTION_REQUIRED_FIELDS) {
        if (!p[field]) missing.push(field);
      }
      break;
    case 'restaurant':
      for (const field of RESTAURANT_REQUIRED_FIELDS) {
        if (!p[field]) missing.push(field);
      }
      break;
    case 'transport':
      for (const field of TRANSPORT_REQUIRED_FIELDS) {
        if (!p[field]) missing.push(field);
      }
      break;
  }
  
  return missing;
}

/**
 * 数据清洗建议生成器
 */
export function generateCleaningSuggestions(poi: unknown): string[] {
  const suggestions: string[] = [];
  const result = validatePOIData(poi);
  
  for (const error of result.errors) {
    suggestions.push(`修复错误: ${error.message}`);
  }
  
  for (const warning of result.warnings) {
    suggestions.push(`改进建议: ${warning.message}`);
  }
  
  if (result.qualityScore < 60) {
    suggestions.push('数据质量评分较低，建议全面补充信息');
  }
  
  if (result.fieldCompletionRate < 50) {
    suggestions.push('字段填充率不足 50%，需要大量补充数据');
  }
  
  return suggestions;
}
