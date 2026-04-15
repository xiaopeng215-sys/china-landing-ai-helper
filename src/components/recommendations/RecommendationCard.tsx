'use client';

import React from 'react';
import type { Recommendation } from '@/lib/recommendations/engine';
import ItemDetailModal from '@/components/explore/ItemDetailModal';

const TYPE_ICONS: Record<Recommendation['type'], string> = {
  attraction: '🏛️',
  food: '🍜',
  hotel: '🏨',
  experience: '✨',
  tip: '💡',
};

const TYPE_LABELS: Record<Recommendation['type'], string> = {
  attraction: 'Attraction',
  food: 'Food',
  hotel: 'Hotel',
  experience: 'Experience',
  tip: 'Tip',
};

interface RecommendationCardProps {
  recommendation: Recommendation;
  onAskAI?: (message: string) => void;
}

export default function RecommendationCard({ recommendation: rec, onAskAI }: RecommendationCardProps) {
  const { title, description, city, imageUrl, tags, type } = rec;
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleAskAI = (message: string) => {
    if (onAskAI) {
      onAskAI(message);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col">
        {/* Image */}
        <div className="relative h-36 bg-gray-100 overflow-hidden">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-teal-50">
              {TYPE_ICONS[type]}
            </div>
          )}
          {/* Type badge */}
          <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 px-2 py-0.5 rounded-full flex items-center gap-1">
            {TYPE_ICONS[type]} {TYPE_LABELS[type]}
          </span>
          {/* City badge */}
          <span className="absolute top-2 right-2 bg-teal-600/90 text-white text-xs px-2 py-0.5 rounded-full">
            {city}
          </span>
        </div>

        {/* Body */}
        <div className="p-3 flex flex-col flex-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1">{title}</h3>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">{description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-teal-50 text-teal-700 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {/* CTA — opens modal instead of external link */}
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-3 w-full text-center bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-semibold py-2 rounded-xl transition-colors"
          >
            Explore →
          </button>
        </div>
      </div>

      <ItemDetailModal
        item={modalOpen ? rec : null}
        onClose={() => setModalOpen(false)}
        onAskAI={handleAskAI}
      />
    </>
  );
}
