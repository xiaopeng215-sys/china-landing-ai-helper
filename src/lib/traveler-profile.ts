/**
 * 旅行者档案数据结构
 * 用于持久化用户偏好、旅行信息和对话历史摘要
 */

export interface TravelerProfile {
  id: string;
  nationality: string;           // 国籍 e.g. "American", "French"
  languages: string[];           // 语言偏好 e.g. ["en-US", "zh-CN"]
  visitPurpose: 'tourism' | 'business' | 'study' | 'other';
  plannedCities: string[];       // 计划去的城市 e.g. ["Beijing", "Shanghai"]
  travelDates?: { arrival: string; departure: string };
  completedSteps: {              // 已完成的准备步骤
    visa: boolean;
    payment: boolean;
    sim: boolean;
    vpn: boolean;
    accommodation: boolean;
  };
  preferences: {
    budget: 'budget' | 'mid' | 'luxury';
    foodRestrictions: string[];  // 饮食限制 e.g. ["vegetarian", "halal"]
    interests: string[];         // 兴趣爱好 e.g. ["history", "food", "nature"]
  };
  chatHistory: {                 // 最近10条对话摘要
    role: 'user' | 'assistant';
    summary: string;
    timestamp: number;
  }[];
  createdAt: number;
  updatedAt: number;
}

export const DEFAULT_PROFILE: Omit<TravelerProfile, 'id' | 'createdAt' | 'updatedAt'> = {
  nationality: '',
  languages: ['en-US'],
  visitPurpose: 'tourism',
  plannedCities: [],
  completedSteps: {
    visa: false,
    payment: false,
    sim: false,
    vpn: false,
    accommodation: false,
  },
  preferences: {
    budget: 'mid',
    foodRestrictions: [],
    interests: [],
  },
  chatHistory: [],
};

export function createEmptyProfile(): TravelerProfile {
  const now = Date.now();
  return {
    ...DEFAULT_PROFILE,
    id: `traveler-${now}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    updatedAt: now,
  };
}
