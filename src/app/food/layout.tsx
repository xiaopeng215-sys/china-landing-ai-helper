import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chinese Food Guide — 150+ Must-Try Dishes',
  description: 'Discover 150+ authentic Chinese dishes across 8 regions. Peking Duck, Xiaolongbao, Mapo Tofu and more — with prices and where to find them.',
  openGraph: {
    title: 'Chinese Food Guide — 150+ Must-Try Dishes',
    description: 'Your complete guide to Chinese cuisine. 150+ dishes with descriptions, price ranges, and where to find them.',
    url: 'https://www.travelerlocal.ai/food',
  },
};

export default function FoodLayout({ children }: { children: React.ReactNode }) {
  return children;
}
