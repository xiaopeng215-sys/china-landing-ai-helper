'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useClientI18n } from '@/lib/i18n/client';

interface DestinationCard {
  id: string;
  emoji: string;
  gradient: string;
  tag: string;
  titleKey: string;
  descKey: string;
  duration: string;
  prompt: string;
}

const DESTINATIONS: DestinationCard[] = [
  {
    id: 'beijing-essential',
    emoji: '🏯',
    gradient: 'from-red-500 to-orange-400',
    tag: 'Classic 3 Days',
    titleKey: 'FeaturedDestinations.beijingEssential_title',
    descKey: 'FeaturedDestinations.beijingEssential_desc',
    duration: '3 days',
    prompt: 'Plan a 3-day Beijing itinerary covering the Great Wall, Forbidden City, Temple of Heaven, and authentic Peking duck dinner. Include local tips and transport advice.',
  },
  {
    id: 'shanghai-food',
    emoji: '🌆',
    gradient: 'from-blue-500 to-cyan-400',
    tag: 'Food & Culture',
    titleKey: 'FeaturedDestinations.shanghaiFood_title',
    descKey: 'FeaturedDestinations.shanghaiFood_desc',
    duration: '2 days',
    prompt: 'Plan a 2-day Shanghai food and culture tour covering The Bund, Yu Garden, French Concession, Nanjing Road, and the best local street food and soup dumpling spots.',
  },
  {
    id: 'chengdu-pandas',
    emoji: '🐼',
    gradient: 'from-green-500 to-emerald-400',
    tag: 'Nature & Food',
    titleKey: 'FeaturedDestinations.chengduPandas_title',
    descKey: 'FeaturedDestinations.chengduPandas_desc',
    duration: '3 days',
    prompt: 'Plan a 3-day Chengdu itinerary: Giant Panda Base in the morning, People\'s Park tea house, Jinli Street, Sichuan Opera, and the best spicy hot pot restaurants. Include transport from airport.',
  },
  {
    id: 'xian-history',
    emoji: '🏺',
    gradient: 'from-amber-500 to-yellow-400',
    tag: 'History & Food',
    titleKey: 'FeaturedDestinations.xianHistory_title',
    descKey: 'FeaturedDestinations.xianHistory_desc',
    duration: '2 days',
    prompt: 'Plan a 2-day Xi\'an itinerary covering the Terracotta Warriors, City Wall, Big Wild Goose Pagoda, Muslim Quarter night market, and the best roujiamo and lamian spots.',
  },
  {
    id: 'hangzhou-westlake',
    emoji: '🌿',
    gradient: 'from-teal-500 to-cyan-400',
    tag: 'Scenery & Tea',
    titleKey: 'FeaturedDestinations.hangzhouWestLake_title',
    descKey: 'FeaturedDestinations.hangzhouWestLake_desc',
    duration: '2 days',
    prompt: 'Plan a 2-day Hangzhou itinerary focusing on West Lake, Lingyin Temple, tea plantation experience, and the famous "叫化鸡" and Longjing shrimp dishes.',
  },
];

interface FeaturedDestinationsProps {
  onPrompt: (prompt: string) => void;
}

export default function FeaturedDestinations({ onPrompt }: FeaturedDestinationsProps) {
  const { t } = useClientI18n();

  return (
    <div className="px-4 mb-5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        {t('FeaturedDestinations.sectionTitle')}
      </p>

      {/* Horizontal scroll cards */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
        {DESTINATIONS.map((dest, index) => (
          <motion.button
            key={dest.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07, duration: 0.35, ease: [0.16, 1, 0.3, 1] as any }}
            onClick={() => onPrompt(dest.prompt)}
            className="flex-shrink-0 w-44 snap-start text-left rounded-2xl overflow-hidden shadow-md active:scale-[0.97] transition-transform border border-gray-100"
          >
            {/* Gradient header */}
            <div className={`bg-gradient-to-br ${dest.gradient} px-4 pt-4 pb-3 text-white`}>
              <span className="text-3xl block mb-2">{dest.emoji}</span>
              <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">
                {dest.tag}
              </span>
            </div>
            {/* Card body */}
            <div className="bg-white px-4 py-3">
              <p className="font-bold text-gray-800 text-sm leading-tight mb-1">
                {t(dest.titleKey)}
              </p>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-2">
                {t(dest.descKey)}
              </p>
              <div className="flex items-center gap-1">
                <span className="text-xs text-teal-600 font-medium">⏱ {dest.duration}</span>
                <span className="text-teal-600 text-xs ml-auto">→</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
