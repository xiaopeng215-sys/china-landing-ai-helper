'use client';

import React, { useState } from 'react';
import { MapPin, Clock, DollarSign, ChevronDown, ChevronUp, ExternalLink, AlertCircle } from 'lucide-react';
import type { Activity, Meal } from '@/lib/itinerary/types';

interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const [expanded, setExpanded] = useState(false);

  const typeColors: Record<string, string> = {
    attraction: 'bg-blue-100 text-blue-700',
    food: 'bg-orange-100 text-orange-700',
    shopping: 'bg-purple-100 text-purple-700',
    experience: 'bg-green-100 text-green-700',
  };

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-3 p-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-0.5 flex-shrink-0 ${typeColors[activity.type] || 'bg-gray-100 text-gray-600'}`}>
          {activity.type}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-800 text-sm">{activity.name}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{activity.duration}</span>
            <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{activity.cost}</span>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />}
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-gray-100 pt-2">
          {activity.address && (
            <p className="text-xs text-gray-500 flex items-start gap-1">
              <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
              {activity.address}
            </p>
          )}
          {activity.tips.length > 0 && (
            <ul className="space-y-1">
              {activity.tips.map((tip, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                  <span className="text-teal-500 mt-0.5">•</span>{tip}
                </li>
              ))}
            </ul>
          )}
          {activity.bookingRequired && (
            <div className="flex items-center gap-1 text-xs text-amber-600">
              <AlertCircle className="w-3 h-3" />
              <span>Booking required</span>
              {activity.bookingUrl && (
                <a href={activity.bookingUrl} target="_blank" rel="noopener noreferrer" className="ml-1 underline flex items-center gap-0.5">
                  Book <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface MealRowProps {
  meal: Meal;
}

export function MealRow({ meal }: MealRowProps) {
  const icons: Record<string, string> = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍡' };
  return (
    <div className="flex items-center gap-2 text-sm">
      <span>{icons[meal.type] || '🍽️'}</span>
      <span className="font-medium text-gray-700 capitalize">{meal.type}:</span>
      <span className="text-gray-600">{meal.name}</span>
      {meal.restaurant && <span className="text-gray-400">@ {meal.restaurant}</span>}
      <span className="ml-auto text-gray-500 text-xs">{meal.cost}</span>
    </div>
  );
}
