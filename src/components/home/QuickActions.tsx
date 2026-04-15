'use client';

import React from 'react';
import { useClientI18n } from '@/lib/i18n/client';

interface QuickActionsProps {
  onAction: (opts: { message?: string; tab?: string }) => void;
}

export default function QuickActions({ onAction }: QuickActionsProps) {
  const { t } = useClientI18n();

  const ACTIONS = [
    { emoji: '🍜', label: t('QuickActions.findFood'), message: t('QuickActions.findFoodMsg') },
    { emoji: '🚇', label: t('QuickActions.getAround'), tab: 'transport' },
    { emoji: '🏨', label: t('QuickActions.findHotel'), tab: 'hotels' },
    { emoji: '📅', label: t('QuickActions.planTrip'), message: t('QuickActions.planTripMsg') },
  ];

  return (
    <div className="px-4 mb-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
        {t('QuickActions.sectionTitle')}
      </p>
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
