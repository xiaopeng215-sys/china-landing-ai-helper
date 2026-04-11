// Mock 数据 - 用于开发和测试

import type { Message, Trip, Restaurant, Attraction, TransportOption } from './types';

export const mockMessages: Message[] = [
  {
    id: '1',
    type: 'ai',
    content: '👋 你好！我是你的中国旅行助手，可以帮你：\n\n✈️ 规划行程\n🍜 推荐美食\n🚇 交通指导\n🏨 预订住宿\n\n告诉我你的需求吧！👇',
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    type: 'user',
    content: '帮我规划上海 4 天行程，喜欢美食和骑行',
    timestamp: '10:31 AM',
  },
  {
    id: '3',
    type: 'ai',
    content: '好的！为你规划上海 4 天深度游，结合美食和骑行体验～',
    timestamp: '10:31 AM',
    tripPreview: {
      title: '上海 4 天深度游',
      duration: '4 天',
      budget: '¥3500',
      people: 2,
      tags: ['美食', '骑行', '地铁'],
    },
  },
];

export const mockTrips: Trip[] = [
  {
    id: '1',
    title: '上海 4 天深度游',
    duration: '4 天',
    budget: '¥3500',
    people: 2,
    tags: ['美食', '骑行', '地铁'],
  },
  {
    id: '2',
    title: '北京 3 天文化游',
    duration: '3 天',
    budget: '¥2800',
    people: 1,
    tags: ['文化', '美食', '地铁'],
  },
  {
    id: '3',
    title: '广州 5 天美食之旅',
    duration: '5 天',
    budget: '¥4200',
    people: 2,
    tags: ['美食', '购物', '地铁'],
  },
];

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: '南翔馒头店',
    rating: 4.8,
    reviewCount: 2000,
    pricePerPerson: '¥60/人',
    cuisine: '本帮菜/小吃',
    location: '豫园路 85 号',
    distance: '10min',
  },
  {
    id: '2',
    name: '老吉士酒家',
    rating: 4.7,
    reviewCount: 1500,
    pricePerPerson: '¥150/人',
    cuisine: '本帮菜',
    location: '法租界',
    distance: '5min',
  },
  {
    id: '3',
    name: '佳家汤包',
    rating: 4.6,
    reviewCount: 1800,
    pricePerPerson: '¥45/人',
    cuisine: '小吃',
    location: '黄河路 90 号',
    distance: '8min',
  },
];

export const mockAttractions: Attraction[] = [
  {
    id: '1',
    name: '外滩',
    rating: 4.9,
    description: '上海标志性景点，欣赏浦江两岸美景',
    location: '黄浦区中山东一路',
    openingHours: '全天开放',
    ticketPrice: '免费',
    tags: ['地标', '拍照', '夜景'],
  },
  {
    id: '2',
    name: '豫园',
    rating: 4.7,
    description: '明代古典园林，体验江南园林之美',
    location: '黄浦区安仁街 218 号',
    openingHours: '09:00-17:00',
    ticketPrice: '¥40',
    tags: ['园林', '文化', '历史'],
  },
  {
    id: '3',
    name: '上海迪士尼乐园',
    rating: 4.8,
    description: '中国大陆首座迪士尼主题乐园',
    location: '浦东新区川沙镇',
    openingHours: '09:00-21:00',
    ticketPrice: '¥399 起',
    tags: ['乐园', '亲子', '娱乐'],
  },
];

export const mockTransportRoutes: Record<string, TransportOption[]> = {
  default: [
    { type: 'subway', duration: '25min', price: '¥4', icon: '🚇' },
    { type: 'taxi', duration: '15min', price: '¥35', icon: '🚕' },
    { type: 'bus', duration: '35min', price: '¥2', icon: '🚌' },
    { type: 'bike', duration: '40min', price: '¥3', icon: '🚲' },
  ],
};

export const mockCategories = {
  food: ['本帮菜', '小吃', '火锅', '咖啡', '烧烤', '粤菜', '川菜', '日料'],
  attractions: ['地标', '园林', '博物馆', '乐园', '街区', '自然风光'],
};
