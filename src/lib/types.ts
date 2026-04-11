// TypeScript 类型定义

export interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: string;
  tripPreview?: TripPreview;
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
