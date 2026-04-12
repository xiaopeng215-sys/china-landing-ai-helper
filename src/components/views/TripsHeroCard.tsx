'use client';

import React from 'react';

interface TripsHeroCardProps {
  onPlanTrip?: () => void;
}

/**
 * TripsView 英雄卡片组件
 * AI 行程规划入口
 */
export default function TripsHeroCard({ onPlanTrip }: TripsHeroCardProps) {
  return (
    <div 
      className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl shadow-xl p-6 text-white cursor-pointer active:scale-[0.98] transition-transform"
      onClick={onPlanTrip}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="text-4xl">✈️</div>
          <h2 className="text-xl font-bold">Plan Your Trip</h2>
          <p className="text-white/90 text-sm">AI-powered itinerary tailored to you</p>
        </div>
        <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-2xl text-sm font-semibold">
          Create →
        </button>
      </div>
    </div>
  );
}
