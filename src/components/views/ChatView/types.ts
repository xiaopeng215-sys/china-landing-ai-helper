// ChatView 专用类型定义
// 注意：Message 类型已统一使用 @/lib/types 中的定义
// 这里只保留 ChatView 特有的扩展类型

import type { Message as BaseMessage } from '@/lib/types';

// 扩展 Message 类型，添加结构化响应字段
export interface Message extends BaseMessage {
  role?: 'user' | 'assistant'; // 兼容 AI API 的 role 字段
  tokens?: number;
  recommendations?: Recommendation[];
  actions?: Action[];
  images?: ChatImage[];
}

export interface Recommendation {
  type: 'attraction' | 'restaurant' | 'hotel' | 'transport';
  id: string;
  name: string;
  nameEn?: string;
  reason: string;
  price?: string;
  location?: string;
  image?: string;
}

export interface Action {
  type: 'book' | 'navigate' | 'info';
  provider: 'klook' | 'trip' | 'amap' | 'didi' | 'meituan';
  url: string;
  text: string;
}

export interface ChatImage {
  url: string;
  caption: string;
}

export interface ChatSession {
  id: string;
  title: string;
  updated_at: string;
}
