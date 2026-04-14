'use client';

import React from 'react';
import { DollarSign, MapPin } from 'lucide-react';
import type { ItineraryRoute } from '@/lib/itineraries';
import { useClientI18n } from '@/lib/i18n/client';

interface TripCardProps {
  trip: ItineraryRoute;
  onViewDetails: (trip: ItineraryRoute) => void;
}

const cityEmojis: Record<string, string> = {
  Shanghai: '🗼',
  Beijing: '🏯',
  "Xi'an": '🏛️',
  Chengdu: '🐼',
  Guilin: '🏞️',
  Hangzhou: '🌸',
};

export default function TripCard({ trip, onViewDetails }: TripCardProps) {
  const { t } = useClientI18n();
  const emoji = cityEmojis[trip.cityEn] ?? '📍';

  return (
    <article className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 touch-manipulation">
      {/* Trip Header */}
      <div 
        className="bg-gradient-to-r from-orange-500 to-amber-500 p-5 cursor-pointer active:brightness-95"
        onClick={() => onViewDetails(trip)}
      >
        <div className="flex items-start justify-between">
          <div className="text-white">
            <h3 className="text-xl font-bold">{trip.city}</h3>
            <p className="text-white/80 text-sm">{trip.subtitle}</p>
          </div>
          <div className="text-right text-white/90">
            <p className="text-2xl font-bold">{trip.days}</p>
            <p className="text-xs">days</p>
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {trip.theme.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Quick Info */}
      <div className="px-5 py-4 flex items-center gap-4 text-sm text-gray-600 border-b border-gray-100">
        <span className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-orange-500" />
          {trip.budget}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="w-4 h-4 text-orange-500" />
          {trip.highlights.slice(0, 2).join(' · ')}
        </span>
      </div>

      {/* Day Preview */}
      <div className="px-5 py-4">
        <p className="text-xs font-semibold text-gray-500 mb-2">{t('TripsPage.quickPreview')}</p>
        <div className="space-y-2">
          {trip.dayPlans.slice(0, 2).map(day => (
            <div key={day.day} className="flex items-center gap-3">
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                Day {day.day}
              </span>
              <span className="text-sm text-gray-700 truncate">{day.title}</span>
            </div>
          ))}
          {trip.dayPlans.length > 2 && (
            <p className="text-xs text-gray-400">+{trip.dayPlans.length - 2} {t('TripsPage.moreDays', 'more days...')}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 pb-5 flex gap-3">
        <button 
          onClick={() => onViewDetails(trip)}
          className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-2xl shadow-md active:scale-[0.98] transition-transform touch-manipulation"
        >
          {t('TripsPage.viewDetails')}
        </button>
        <button className="px-4 py-3 bg-gray-100 text-gray-600 font-semibold rounded-2xl active:bg-gray-200 transition-colors touch-manipulation">
          {t('TripsPage.share')}
        </button>
      </div>
    </article>
  );
}
