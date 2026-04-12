export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tokens?: number;
  // 结构化响应字段
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
