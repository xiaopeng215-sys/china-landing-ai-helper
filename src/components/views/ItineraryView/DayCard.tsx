'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Bus } from 'lucide-react';
import type { DayPlan } from '@/lib/itinerary/types';
import { ActivityItem, MealRow } from './ActivityItem';

interface DayCardProps {
  plan: DayPlan;
  defaultOpen?: boolean;
}

export function DayCard({ plan, defaultOpen = false }: DayCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {plan.day}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800">{plan.theme}</p>
          <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
            {plan.date && <span>{plan.date}</span>}
            <span className="text-teal-600 font-medium">{plan.estimatedCost}</span>
          </div>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
          {/* Time slots */}
          {[
            { label: '🌅 Morning', activities: plan.morning },
            { label: '☀️ Afternoon', activities: plan.afternoon },
            { label: '🌙 Evening', activities: plan.evening },
          ].map(({ label, activities }) =>
            activities.length > 0 ? (
              <div key={label}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-3">{label}</p>
                <div className="space-y-2">
                  {activities.map((a, i) => <ActivityItem key={i} activity={a} />)}
                </div>
              </div>
            ) : null
          )}

          {/* Meals */}
          {plan.meals.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-3">🍽️ Meals</p>
              <div className="bg-orange-50 rounded-xl p-3 space-y-2">
                {plan.meals.map((m, i) => <MealRow key={i} meal={m} />)}
              </div>
            </div>
          )}

          {/* Transport */}
          {plan.transport && (
            <div className="flex items-start gap-2 bg-blue-50 rounded-xl p-3">
              <Bus className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-700">{plan.transport}</p>
            </div>
          )}

          {/* Tips */}
          {plan.tips.length > 0 && (
            <div className="bg-amber-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-amber-700 mb-1">💡 Tips</p>
              <ul className="space-y-1">
                {plan.tips.map((tip, i) => (
                  <li key={i} className="text-xs text-amber-800 flex items-start gap-1">
                    <span className="mt-0.5">•</span>{tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
