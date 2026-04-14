'use client';

import React from 'react';

interface ExploreViewProps {
  onNavigate: (tab: 'food-encyclopedia' | 'hotels' | 'transport') => void;
}

const EXPLORE_CARDS = [
  {
    id: 'food-encyclopedia' as const,
    icon: '🍜',
    title: 'Food Guide',
    subtitle: 'Discover authentic Chinese cuisine',
    description: 'Regional dishes, must-try foods, ordering tips & dietary guides',
    gradient: 'from-orange-400 to-red-400',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    tag: '200+ dishes',
  },
  {
    id: 'hotels' as const,
    icon: '🏨',
    title: 'Hotels',
    subtitle: 'Find the perfect stay',
    description: 'Curated hotels across China — budget to luxury, with booking tips',
    gradient: 'from-amber-400 to-orange-400',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    tag: 'All budgets',
  },
  {
    id: 'transport' as const,
    icon: '🚇',
    title: 'Transport',
    subtitle: 'Get around with ease',
    description: 'Metro, high-speed rail, Didi, buses — everything you need to move',
    gradient: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    tag: 'Step-by-step',
  },
];

export default function ExploreView({ onNavigate }: ExploreViewProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 pt-6 pb-8">
        <h1 className="text-2xl font-bold">🔍 Explore</h1>
        <p className="text-orange-100 text-sm mt-1">Food, hotels & getting around China</p>
      </div>

      {/* Cards */}
      <div className="px-4 -mt-4 space-y-4">
        {EXPLORE_CARDS.map((card) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className={`w-full text-left ${card.bg} border ${card.border} rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform`}
            type="button"
          >
            {/* Card gradient banner */}
            <div className={`bg-gradient-to-r ${card.gradient} px-5 py-4 flex items-center gap-4`}>
              <span className="text-4xl" aria-hidden="true">{card.icon}</span>
              <div className="flex-1">
                <h2 className="text-white text-xl font-bold">{card.title}</h2>
                <p className="text-white/80 text-sm">{card.subtitle}</p>
              </div>
              <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
                {card.tag}
              </span>
            </div>

            {/* Card body */}
            <div className="px-5 py-4 flex items-center justify-between">
              <p className="text-gray-600 text-sm leading-relaxed flex-1 pr-4">
                {card.description}
              </p>
              <svg
                className="w-5 h-5 text-orange-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Quick tip */}
      <div className="mx-4 mt-6 bg-white rounded-xl p-4 border border-orange-100 shadow-sm">
        <div className="flex gap-3 items-start">
          <span className="text-xl">💡</span>
          <div>
            <p className="text-sm font-semibold text-gray-800">Pro tip</p>
            <p className="text-sm text-gray-500 mt-0.5">
              Download offline maps before your trip — Apple Maps works in China without a VPN.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
