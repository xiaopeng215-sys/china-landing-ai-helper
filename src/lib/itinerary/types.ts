export interface ItineraryRequest {
  destination: string;
  duration: number;
  nationality: string;
  budget: 'budget' | 'mid' | 'luxury';
  interests: string[];
  travelDates?: { start: string; end: string };
}

export interface Meal {
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  restaurant?: string;
  cost: string;
  address?: string;
  tips?: string[];
}

export interface Activity {
  name: string;
  type: 'attraction' | 'food' | 'shopping' | 'experience';
  duration: string;
  cost: string;
  address: string;
  tips: string[];
  bookingRequired: boolean;
  bookingUrl?: string;
}

export interface DayPlan {
  day: number;
  date?: string;
  theme: string;
  morning: Activity[];
  afternoon: Activity[];
  evening: Activity[];
  meals: Meal[];
  transport: string;
  tips: string[];
  estimatedCost: string;
}

export interface Itinerary {
  id: string;
  request: ItineraryRequest;
  days: DayPlan[];
  totalBudget: string;
  essentialTips: string[];
  emergencyContacts: string[];
  createdAt: number;
}
