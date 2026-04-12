/**
 * 行程数据类型定义
 * Itinerary Types
 */

export interface DayPlan {
  day: number;
  title: string;
  theme: string;
  activities: Activity[];
  tips: string[];
}

export interface Activity {
  time: string;
  name: string;
  nameEn: string;
  type: 'attraction' | 'food' | 'transport' | 'shopping';
  duration: string;
  description: string;
  price: string;
  location: string;
  locationLat: number;
  locationLng: number;
  highlights: string[];
  tips: string;
}

export interface ItineraryRoute {
  id: string;
  city: string;
  cityEn: string;
  country: string;
  days: number;
  title: string;
  subtitle: string;
  theme: string[];
  budget: '¥1500' | '¥2000' | '¥2500' | '¥2800' | '¥3500' | '¥5000';
  bestSeason: string;
  highlights: string[];
  description: string;
  dayPlans: DayPlan[];
  practicalInfo: {
    transport: string;
    weather: string;
    food: string;
    safety: string;
  };
}
