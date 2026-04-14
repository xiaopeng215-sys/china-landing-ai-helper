'use client';

import React from 'react';
import { DollarSign } from 'lucide-react';
import type { DayPlan } from '@/lib/itineraries';

interface ActivityItemProps {
  activity: DayPlan['activities'][number];
  index: number;
}

const typeIcons: Record<string, string> = {
  attraction: '🏛️',
  food: '🍜',
  transport: '🚇',
  shopping: '🛍️',
};

export default function ActivityItem({ activity, index }: ActivityItemProps) {
  return (
    <div
      className="group flex items-start gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-orange-50 
                 transition-all duration-200 active:bg-orange-100 touch-manipulation
                 border border-transparent hover:border-orange-200"
    >
      {/* Time badge */}
      <div className="flex-shrink-0 w-14 text-center">
        <span className="text-xs font-mono font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-lg">
          {activity.time}
        </span>
      </div>

      {/* Icon */}
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center text-lg shadow-sm">
        {typeIcons[activity.type] ?? '📍'}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-gray-800 text-sm truncate">{activity.nameEn || activity.name}</span>
        </div>
        <p className="text-xs text-gray-500 truncate">{activity.descriptionEn ?? activity.description}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span className="text-xs">⏱️</span> {activity.durationEn ?? activity.duration}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> {activity.priceEn ?? activity.price}
          </span>
        </div>
      </div>

      {/* Arrow */}
      <svg className="flex-shrink-0 w-5 h-5 text-gray-300 group-active:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}
