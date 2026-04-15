'use client';

import React from 'react';
import { useClientI18n } from '@/lib/i18n/client';

const CITY_KEYS = [
  { key: 'beijing', name: 'Beijing', emoji: '🏯', gradient: 'from-red-500 to-orange-400' },
  { key: 'shanghai', name: 'Shanghai', emoji: '🌆', gradient: 'from-blue-500 to-teal-400' },
  { key: 'chengdu', name: 'Chengdu', emoji: '🐼', gradient: 'from-green-500 to-emerald-400' },
  { key: 'xian', name: "Xi'an", emoji: '🏺', gradient: 'from-amber-500 to-yellow-400' },
  { key: 'hangzhou', name: 'Hangzhou', emoji: '🌿', gradient: 'from-teal-500 to-cyan-400' },
  { key: 'xiamen', name: 'Xiamen', emoji: '🌊', gradient: 'from-sky-500 to-blue-400' },
];

interface DailyRecommendationProps {
  onCitySelect: (city: string) => void;
}

export default function DailyRecommendation({ onCitySelect }: DailyRecommendationProps) {
  const { t } = useClientI18n();

  const cityMeta = React.useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return CITY_KEYS[dayOfYear % CITY_KEYS.length];
  }, []);

  const title = t(`DailyRecommendation.${cityMeta.key}_title`);
  const description = t(`DailyRecommendation.${cityMeta.key}_desc`);

  return (
    <div className="px-4 mb-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
        {t('DailyRecommendation.todaysPick')}
      </p>
      <button
        onClick={() => onCitySelect(cityMeta.name)}
        className="w-full text-left rounded-2xl overflow-hidden shadow-md active:scale-[0.98] transition-transform"
      >
        <div className={`bg-gradient-to-r ${cityMeta.gradient} px-5 pt-5 pb-4 text-white`}>
          <div className="flex items-start gap-3">
            <span className="text-4xl">{cityMeta.emoji}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base leading-snug">{title}</h3>
              <p className="text-sm opacity-90 mt-1 leading-relaxed">{description}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end">
            <span className="text-sm font-semibold bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors">
              {t('DailyRecommendation.exploreCta')}
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
