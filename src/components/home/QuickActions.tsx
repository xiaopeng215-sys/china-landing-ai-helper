'use client';

import React from 'react';

interface QuickAction {
  emoji: string;
  label: string;
  message?: string;
  tab?: string;
}

const ACTIONS: QuickAction[] = [
  { emoji: '🍜', label: 'Find Food',   message: 'Recommend local food near me in China' },
  { emoji: '🚇', label: 'Get Around',  tab: 'transport' },
  { emoji: '🏨', label: 'Find Hotel',  tab: 'hotels' },
  { emoji: '📅', label: 'Plan Trip',   message: 'Help me plan a trip itinerary in China' },
];

interface QuickActionsProps {
  onAction: (opts: { message?: string; tab?: string }) => void;
}

export default function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <div className="px-4 mb-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Quick Actions</p>
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {ACTIONS.map((a) => (
          <button
            key={a.label}
            onClick={() => onAction({ message: a.message, tab: a.tab })}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm hover:border-teal-300 hover:bg-teal-50 active:scale-95 transition-all"
          >
            <span className="text-2xl">{a.emoji}</span>
            <span className="text-xs font-medium text-gray-700 whitespace-nowrap">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
