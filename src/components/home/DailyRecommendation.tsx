'use client';

import React from 'react';

const CITIES = [
  {
    name: 'Beijing',
    title: 'Beijing — Where History Meets Modernity',
    description: 'Walk the Great Wall, explore the Forbidden City, and feast on Peking duck in the ancient hutongs.',
    emoji: '🏯',
    gradient: 'from-red-500 to-orange-400',
  },
  {
    name: 'Shanghai',
    title: 'Shanghai — The City That Never Sleeps',
    description: 'Stroll the Bund at night, ride the Maglev, and discover world-class food in every alley.',
    emoji: '🌆',
    gradient: 'from-blue-500 to-teal-400',
  },
  {
    name: 'Chengdu',
    title: 'Chengdu — Spice, Pandas & Slow Living',
    description: 'Meet giant pandas, burn your tongue on hot pot, and sip tea in a bamboo garden.',
    emoji: '🐼',
    gradient: 'from-green-500 to-emerald-400',
  },
  {
    name: "Xi'an",
    title: "Xi'an — The Ancient Capital",
    description: "Stand face-to-face with the Terracotta Army and devour a bowl of biang biang noodles.",
    emoji: '🏺',
    gradient: 'from-amber-500 to-yellow-400',
  },
  {
    name: 'Hangzhou',
    title: 'Hangzhou — Heaven on Earth',
    description: 'Cycle around West Lake, sip fresh Longjing tea, and lose yourself in misty mountain trails.',
    emoji: '🌿',
    gradient: 'from-teal-500 to-cyan-400',
  },
  {
    name: 'Xiamen',
    title: 'Xiamen — Coastal Charm',
    description: 'Wander the car-free island of Gulangyu, eat oyster omelettes, and watch the sunset over the sea.',
    emoji: '🌊',
    gradient: 'from-sky-500 to-blue-400',
  },
];

interface DailyRecommendationProps {
  onCitySelect: (city: string) => void;
}

export default function DailyRecommendation({ onCitySelect }: DailyRecommendationProps) {
  const city = React.useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return CITIES[dayOfYear % CITIES.length];
  }, []);

  return (
    <div className="px-4 mb-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Today&apos;s Pick</p>
      <button
        onClick={() => onCitySelect(city.name)}
        className="w-full text-left rounded-2xl overflow-hidden shadow-md active:scale-[0.98] transition-transform"
      >
        {/* Gradient banner */}
        <div className={`bg-gradient-to-r ${city.gradient} px-5 pt-5 pb-4 text-white`}>
          <div className="flex items-start gap-3">
            <span className="text-4xl">{city.emoji}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base leading-snug">{city.title}</h3>
              <p className="text-sm opacity-90 mt-1 leading-relaxed">{city.description}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end">
            <span className="text-sm font-semibold bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors">
              Explore Today&apos;s Pick →
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
