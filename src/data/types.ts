/**
 * 行程数据类型定义
 * Itinerary Types
 */

export interface DayPlan {
  day: number;
  title: string;
  titleEn?: string;
  theme: string;
  themeEn?: string;
  activities: Activity[];
  tips: string[];
  tipsEn?: string[];
}

export interface Activity {
  time: string;
  name: string;
  nameEn: string;
  type: 'attraction' | 'food' | 'transport' | 'shopping';
  duration: string;
  durationEn?: string;
  description: string;
  descriptionEn?: string;
  price: string;
  priceEn?: string;
  location: string;
  locationLat: number;
  locationLng: number;
  highlights: string[];
  highlightsEn?: string[];
  tips: string;
  tipsEn?: string;
}

export interface ItineraryRoute {
  id: string;
  city: string;
  cityEn: string;
  country: string;
  days: number;
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  theme: string[];
  themeEn?: string[];
  budget: '¥1500' | '¥2000' | '¥2500' | '¥2800' | '¥3500' | '¥5000';
  bestSeason: string;
  bestSeasonEn?: string;
  highlights: string[];
  highlightsEn?: string[];
  description: string;
  descriptionEn?: string;
  dayPlans: DayPlan[];
  practicalInfo: {
    transport: string;
    weather: string;
    food: string;
    safety: string;
  };
}
