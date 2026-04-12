'use client';

import React from 'react';
import { Calendar, MapPin, DollarSign, Star, ChevronRight } from 'lucide-react';
import type { ItineraryRoute } from '@/lib/itineraries';

interface TripCardProps {
  trip: ItineraryRoute;
  onClick: () => void;
}

export function TripCard({ trip, onClick }: TripCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 
                 cursor-pointer transform transition-all duration-200 
                 hover:shadow-2xl hover:-translate-y-1 active:scale-98
                 touch-manipulation"
    >
      {/* Hero Image */}
      <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-white text-lg font-bold drop-shadow-lg">{trip.name}</h3>
          <p className="text-white/90 text-xs truncate">{trip.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Day highlights */}
        {trip.days.slice(0, 3).map((day, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center text-sm font-bold text-emerald-600">
              D{idx + 1}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{day.title}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {day.activities.length} 个活动
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {trip.days.length}天
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> {trip.price}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {trip.rating}
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
