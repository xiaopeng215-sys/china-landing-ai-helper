// TypeScript 类型定义
// 统一的消息类型定义，所有组件都应使用此定义

export interface Message {
  id: string;
  type: 'ai' | 'user';
  role?: 'user' | 'assistant'; // 兼容 AI API 的 role 字段 (可选)
  content: string;
  timestamp: string | Date; // 支持 string 和 Date 两种格式
  tripPreview?: TripPreview;
  tokens?: number; // 可选的 token 计数
  recommendations?: Array<{
    type: 'attraction' | 'restaurant' | 'hotel' | 'transport';
    id: string;
    name: string;
    nameEn?: string;
    reason: string;
    price?: string;
    location?: string;
    image?: string;
  }>;
  actions?: Array<{
    type: 'book' | 'navigate' | 'info';
    provider: 'klook' | 'trip' | 'amap' | 'didi' | 'meituan';
    url: string;
    text: string;
  }>;
  images?: Array<{
    url: string;
    caption: string;
  }>;
}

export interface TripPreview {
  title: string;
  duration: string;
  budget: string;
  people: number;
  tags: string[];
}

export interface Trip {
  id: string;
  title: string;
  duration: string;
  budget: string;
  people: number;
  tags: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  pricePerPerson: string;
  cuisine: string;
  location: string;
  distance: string;
}

export interface FoodItem {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  pricePerPerson: string;
  cuisine: string;
  location: string;
  distance: string;
}

export interface Attraction {
  id: string;
  name: string;
  rating: number;
  description: string;
  location: string;
  openingHours: string;
  ticketPrice: string;
  tags: string[];
}

export interface TransportRoute {
  from: string;
  to: string;
  routes: TransportOption[];
}

export interface TransportOption {
  type: 'subway' | 'bike' | 'bus' | 'taxi';
  duration: string;
  price: string;
  icon: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

export interface ApiConfig {
  baseUrl: string;
  useMock: boolean;
  timeout: number;
}
