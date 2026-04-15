'use client';

import React, { useEffect } from 'react';
import type { Recommendation } from '@/lib/recommendations/engine';

const SPECIAL_OFFERS = [
  { code: 'CHINA10', label: '10% off your first booking', icon: '🎁' },
  { code: 'WEEKDAY', label: 'Free entry on weekdays (select attractions)', icon: '📅' },
  { code: 'KLOOK5', label: '¥5 off orders over ¥100', icon: '💵' },
];

const TYPE_ICONS: Record<Recommendation['type'], string> = {
  attraction: '🏛️',
  food: '🍜',
  hotel: '🏨',
  experience: '✨',
  tip: '💡',
};

interface ItemDetailModalProps {
  item: Recommendation | null;
  onClose: () => void;
  onAskAI: (message: string) => void;
}

export default function ItemDetailModal({ item, onClose, onAskAI }: ItemDetailModalProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (!item) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [item]);

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!item) return null;

  const klookUrl = item.actionUrl
    ? `${item.actionUrl}${item.actionUrl.includes('?') ? '&' : '?'}aff_id=china-helper&utm_source=pwa&utm_medium=modal`
    : '#';

  const handleAskAI = () => {
    onAskAI(`Tell me more about "${item.title}" in ${item.city} — tips, best time to visit, how to get there, and what to expect.`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm"
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div className="w-full bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Hero image */}
        <div className="relative h-52 bg-gray-100 overflow-hidden">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl bg-teal-50">
              {TYPE_ICONS[item.type]}
            </div>
          )}
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg leading-none"
            aria-label="Close"
          >
            ×
          </button>
          {/* City badge */}
          <span className="absolute bottom-3 left-3 bg-teal-600/90 text-white text-xs font-medium px-3 py-1 rounded-full">
            📍 {item.city}
          </span>
        </div>

        {/* Content */}
        <div className="px-5 pt-4 pb-6 space-y-4">
          {/* Title + type */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{TYPE_ICONS[item.type]}</span>
              <span className="text-xs text-gray-500 capitalize">{item.type}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{item.title}</h2>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-teal-50 text-teal-700 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Special Offers */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-amber-800 mb-3">💰 Special Offers</h3>
            <div className="space-y-2">
              {SPECIAL_OFFERS.map(offer => (
                <div key={offer.code} className="flex items-center gap-3">
                  <span className="text-base">{offer.icon}</span>
                  <div className="flex-1">
                    <span className="text-xs text-gray-700">{offer.label}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    {offer.code}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 pt-1">
            <a
              href={klookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold py-3.5 rounded-2xl transition-colors text-sm"
            >
              Book on Klook →
            </a>
            <button
              onClick={handleAskAI}
              className="w-full text-center bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800 font-semibold py-3.5 rounded-2xl transition-colors text-sm"
              type="button"
            >
              🤖 Ask AI about this
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
