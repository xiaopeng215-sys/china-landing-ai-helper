'use client';

import React from 'react';
import { Calendar, DollarSign, Star } from 'lucide-react';
import { useClientI18n } from '@/lib/i18n/client';
import type { ItineraryRoute } from '@/lib/itineraries';
import ActivityItem from './ActivityItem';

interface TripDetailModalProps {
  trip: ItineraryRoute;
  onClose: () => void;
}

export default function TripDetailModal({ trip, onClose }: TripDetailModalProps) {
  const { t } = useClientI18n();
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-4 pt-4 pb-2 border-b">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{trip.title}</h2>
              <p className="text-sm text-gray-500">{trip.subtitle}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 -m-2 text-gray-400 hover:text-gray-600 active:bg-gray-100 rounded-full transition-colors"
              aria-label={t('Common.close', 'Close')}
            >
              ✕
            </button>
          </div>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {trip.theme.map(tag => (
              <span key={tag} className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="px-4 py-3 grid grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-2xl p-3 text-center">
            <Calendar className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
            <p className="text-xs text-gray-500">{t('TripsPage.duration')}</p>
            <p className="font-bold text-gray-900">{trip.days} {t('TripsPage.days')}</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-3 text-center">
            <DollarSign className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
            <p className="text-xs text-gray-500">{t('TripsPage.budget')}</p>
            <p className="font-bold text-gray-900">{trip.budget}</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-3 text-center">
            <Star className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
            <p className="text-xs text-gray-500">{t('TripsPage.best')}</p>
            <p className="font-bold text-gray-900">{trip.bestSeason.split('/')[0]}</p>
          </div>
        </div>

        {/* Description */}
        <div className="px-4 pb-3">
          <p className="text-sm text-gray-600 leading-relaxed">{trip.description}</p>
        </div>

        {/* Day Plans */}
        <div className="px-4 pb-24 space-y-4">
          {trip.dayPlans.map(dayPlan => (
            <div key={dayPlan.day}>
              <div className="sticky top-[73px] bg-gray-50 -mx-4 px-4 py-2 z-[5]">
                <h3 className="font-bold text-gray-900">
                  {t('TripsPage.day')} {dayPlan.day}: <span className="text-emerald-600">{dayPlan.title}</span>
                </h3>
                <p className="text-xs text-gray-500">{dayPlan.theme}</p>
              </div>
              <div className="mt-2 space-y-2">
                {dayPlan.activities.map((activity, idx) => (
                  <ActivityItem key={idx} activity={activity} index={idx} />
                ))}
              </div>
              {/* Tips */}
              {dayPlan.tips.length > 0 && (
                <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-xs font-semibold text-amber-700 mb-1">{t('TripsPage.tips')}</p>
                  <ul className="space-y-1">
                    {dayPlan.tips.map((tip, i) => (
                      <li key={i} className="text-xs text-amber-600">• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Action */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t safe-area-bottom">
          <button className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-transform">
            {t('TripsPage.planWithAI')}
          </button>
        </div>
      </div>
    </div>
  );
}
