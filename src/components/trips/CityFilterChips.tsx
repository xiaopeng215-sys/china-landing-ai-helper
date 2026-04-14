'use client';

import React from 'react';
import { useClientI18n } from '@/lib/i18n/client';

interface CityFilter {
  key: string;
  label: string;
}

interface CityFilterChipsProps {
  selectedCity: string;
  onCitySelect: (city: string) => void;
}


export default function CityFilterChips({ selectedCity, onCitySelect }: CityFilterChipsProps) {
  const { t } = useClientI18n();

  const CITY_FILTERS: CityFilter[] = [
    { key: 'all', label: t('TripsPage.all') },
    { key: 'shanghai-4days', label: '🇨🇳 Shanghai' },
    { key: 'beijing-5days', label: '🏯 Beijing' },
    { key: 'xian-3days', label: "🏛️ Xi'an" },
    { key: 'chengdu-3days', label: '🐼 Chengdu' },
    { key: 'guilin-3days', label: '🏞️ Guilin' },
    { key: 'hangzhou-2days', label: '🌸 Hangzhou' },
  ];

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 px-4 pb-3">
        {CITY_FILTERS.map(city => (
          <button
            key={city.key}
            onClick={() => onCitySelect(city.key)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all
              active:scale-95 touch-manipulation
              ${selectedCity === city.key
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {city.label}
          </button>
        ))}
      </div>
    </div>
  );
}
