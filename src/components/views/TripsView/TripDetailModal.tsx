'use client';

import React from 'react';
import { X, Calendar, MapPin, DollarSign, Star } from 'lucide-react';
import type { ItineraryRoute } from '@/lib/itineraries';
import { ActivityItem } from './ActivityItem';

interface TripDetailModalProps {
  trip: ItineraryRoute;
  onClose: () => void;
}

export function TripDetailModal({ trip, onClose }: TripDetailModalProps) {
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
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">{trip.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{trip.description}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-50 rounded-2xl p-3 text-center border border-emerald-100">
              <Calendar className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-emerald-700">{trip.days.length}天</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-3 text-center border border-blue-100">
              <DollarSign className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-blue-700">{trip.price}</p>
            </div>
            <div className="bg-yellow-50 rounded-2xl p-3 text-center border border-yellow-100">
              <Star className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-yellow-700">{trip.rating}</p>
            </div>
          </div>

          {/* Days */}
          {trip.days.map((day, dayIdx) => (
            <div key={dayIdx} className="space-y-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  D{dayIdx + 1}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{day.title}</h3>
                  <p className="text-xs text-gray-500">{day.activities.length} 个活动</p>
                </div>
              </div>

              {/* Activities */}
              <div className="space-y-2">
                {day.activities.map((activity, actIdx) => (
                  <ActivityItem key={actIdx} activity={activity} index={actIdx} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Padding */}
        <div className="h-8" />
      </div>
    </div>
  );
}
