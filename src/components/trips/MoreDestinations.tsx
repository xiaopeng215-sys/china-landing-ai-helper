'use client';

import React from 'react';
import { useClientI18n } from '@/lib/i18n/client';

interface Destination {
  name: string;
  emoji: string;
  tag: string;
}

interface MoreDestinationsProps {
  onDestinationSelect: (city: string) => void;
}

const destinations: Destination[] = [
  { name: "Xi'an", emoji: '🏛️', tag: 'History' },
  { name: 'Guilin', emoji: '🏞️', tag: 'Nature' },
  { name: 'Chengdu', emoji: '🐼', tag: 'Food' },
  { name: 'Hangzhou', emoji: '🌸', tag: 'Culture' },
];

export default function MoreDestinations({ onDestinationSelect }: MoreDestinationsProps) {
  const { t } = useClientI18n();
  return (
    <section className="bg-white rounded-3xl shadow-lg p-5 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{t('TripsPage.moreDestinations')}</h3>
      <div className="grid grid-cols-2 gap-3">
        {destinations.map(city => (
          <button
            key={city.name}
            onClick={() => onDestinationSelect(city.name.toLowerCase().replace("'", '-') + '-3days')}
            className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl text-left active:scale-[0.98] transition-transform border border-gray-200 hover:border-orange-400 touch-manipulation"
          >
            <span className="text-2xl mb-1 block">{city.emoji}</span>
            <span className="font-semibold text-gray-900 text-sm">{city.name}</span>
            <span className="text-xs text-gray-400">{t(`TripsPage.tag${city.tag}`)}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
