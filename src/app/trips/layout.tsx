import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'China Travel Itineraries — AI-Powered Trip Planning',
  description: "Plan your perfect China trip with AI. Get personalized day-by-day itineraries for Beijing, Shanghai, Chengdu, Xi'an, and more.",
  openGraph: {
    title: 'China Travel Itineraries — AI Trip Planning',
    description: 'AI-powered itinerary planning for China. Personalized day-by-day plans for any city and duration.',
    url: 'https://www.travelerlocal.ai/trips',
  },
};

export default function TripsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
