'use client';

import React, { useState, useMemo } from 'react';
import { allItineraries, getFeaturedItineraries } from '@/lib/itineraries';
import type { ItineraryRoute, DayPlan } from '@/lib/itineraries';
import { ChevronRight, Calendar, MapPin, DollarSign, Star } from 'lucide-react';

// ─── Skeleton Loader ───────────────────────────────────────────────────────────

function TripCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="bg-gradient-to-r from-gray-300 to-gray-400 h-32" />
      <div className="p-6 space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Activity Item ─────────────────────────────────────────────────────────────

function ActivityItem({ activity, index }: { activity: DayPlan['activities'][0]; index: number }) {
  const typeIcons: Record<string, string> = {
    attraction: '🏛️',
    food: '🍜',
    transport: '🚇',
    shopping: '🛍️',
  };

  return (
    <div
      className="group flex items-start gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-emerald-50 
                 transition-all duration-200 active:bg-emerald-100 touch-manipulation
                 border border-transparent hover:border-emerald-200"
    >
      {/* Time badge */}
      <div className="flex-shrink-0 w-14 text-center">
        <span className="text-xs font-mono font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg">
          {activity.time}
        </span>
      </div>

      {/* Icon */}
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-lg shadow-sm">
        {typeIcons[activity.type] ?? '📍'}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-gray-800 text-sm truncate">{activity.name}</span>
        </div>
        <p className="text-xs text-gray-500 truncate">{activity.description}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span className="text-xs">⏱️</span> {activity.duration}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> {activity.price}
          </span>
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className="flex-shrink-0 w-5 h-5 text-gray-300 group-active:text-emerald-500 transition-colors" />
    </div>
  );
}

// ─── Trip Detail Modal ────────────────────────────────────────────────────────

function TripDetailModal({ 
  trip, 
  onClose 
}: { 
  trip: ItineraryRoute; 
  onClose: () => void;
}) {
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
            <p className="text-xs text-gray-500">Duration</p>
            <p className="font-bold text-gray-900">{trip.days} Days</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-3 text-center">
            <DollarSign className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
            <p className="text-xs text-gray-500">Budget</p>
            <p className="font-bold text-gray-900">{trip.budget}</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-3 text-center">
            <Star className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
            <p className="text-xs text-gray-500">Best</p>
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
                  Day {dayPlan.day}: <span className="text-emerald-600">{dayPlan.title}</span>
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
                  <p className="text-xs font-semibold text-amber-700 mb-1">💡 Tips</p>
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
            Plan This Trip with AI ✈️
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── City Filter Chips ────────────────────────────────────────────────────────

const CITY_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'shanghai-4days', label: '🇨🇳 Shanghai' },
  { key: 'beijing-5days', label: '🏯 Beijing' },
  { key: 'xian-3days', label: '🏛️ Xi\'an' },
  { key: 'chengdu-3days', label: '🐼 Chengdu' },
  { key: 'guilin-3days', label: '🏞️ Guilin' },
  { key: 'hangzhou-2days', label: '🌸 Hangzhou' },
];

// ─── Main TripsView ────────────────────────────────────────────────────────────

export default function TripsView() {
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedTrip, setSelectedTrip] = useState<ItineraryRoute | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredTrips = useMemo(() => {
    if (selectedCity === 'all') return allItineraries;
    return allItineraries.filter(t => t.id === selectedCity);
  }, [selectedCity]);

  const featuredTrips = getFeaturedItineraries(3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm safe-area-top">
        <div className="max-w-3xl mx-auto px-4 pt-4 pb-3">
          <h1 className="text-2xl font-bold text-gray-900">My Trips</h1>
          <p className="text-sm text-gray-500">Plan your perfect China journey ✨</p>
        </div>

        {/* City Filter */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-4 pb-3">
            {CITY_FILTERS.map(city => (
              <button
                key={city.key}
                onClick={() => setSelectedCity(city.key)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all
                  active:scale-95 touch-manipulation
                  ${selectedCity === city.key
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {city.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-4 space-y-6">
        {/* Hero Card */}
        <div 
          className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl shadow-xl p-6 text-white cursor-pointer active:scale-[0.98] transition-transform"
          onClick={() => {/* TODO: Navigate to AI trip planner */}}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="text-4xl">✈️</div>
              <h2 className="text-xl font-bold">Plan Your Trip</h2>
              <p className="text-white/90 text-sm">AI-powered itinerary tailored to you</p>
            </div>
            <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-2xl text-sm font-semibold">
              Create →
            </button>
          </div>
        </div>

        {/* Featured Section */}
        {selectedCity === 'all' && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">🌟 Featured Routes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {featuredTrips.map(trip => (
                <button
                  key={trip.id}
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => {
                      setSelectedTrip(trip);
                      setIsLoading(false);
                    }, 150);
                  }}
                  className="bg-white rounded-2xl p-4 text-left shadow-md hover:shadow-lg transition-all active:scale-[0.98] border border-gray-100 touch-manipulation"
                >
                  <div className="text-3xl mb-2">
                    {trip.cityEn === 'Shanghai' ? '🗼' :
                     trip.cityEn === 'Beijing' ? '🏯' :
                     trip.cityEn === "Xi'an" ? '🏛️' :
                     trip.cityEn === 'Chengdu' ? '🐼' :
                     trip.cityEn === 'Guilin' ? '🏞️' : '🌸'}
                  </div>
                  <h3 className="font-bold text-gray-900">{trip.city}</h3>
                  <p className="text-xs text-gray-500">{trip.days} days · {trip.budget}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {trip.theme.slice(0, 2).map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* All Trips */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            {selectedCity === 'all' ? '📍 All Routes' : `📍 ${filteredTrips[0]?.city ?? 'Routes'}`}
          </h2>
          
          <div className="space-y-4">
            {filteredTrips.map(trip => (
              <article
                key={trip.id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 touch-manipulation"
              >
                {/* Trip Header */}
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 p-5 cursor-pointer active:brightness-95"
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => {
                      setSelectedTrip(trip);
                      setIsLoading(false);
                    }, 150);
                  }}
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
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    {trip.budget}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    {trip.highlights.slice(0, 2).join(' · ')}
                  </span>
                </div>

                {/* Day Preview */}
                <div className="px-5 py-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Quick Preview</p>
                  <div className="space-y-2">
                    {trip.dayPlans.slice(0, 2).map(day => (
                      <div key={day.day} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          Day {day.day}
                        </span>
                        <span className="text-sm text-gray-700 truncate">{day.title}</span>
                      </div>
                    ))}
                    {trip.dayPlans.length > 2 && (
                      <p className="text-xs text-gray-400">+{trip.dayPlans.length - 2} more days...</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="px-5 pb-5 flex gap-3">
                  <button 
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => {
                        setSelectedTrip(trip);
                        setIsLoading(false);
                      }, 150);
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-2xl shadow-md active:scale-[0.98] transition-transform touch-manipulation"
                  >
                    View Details
                  </button>
                  <button className="px-4 py-3 bg-gray-100 text-gray-600 font-semibold rounded-2xl active:bg-gray-200 transition-colors touch-manipulation">
                    Share
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* More Destinations */}
        <section className="bg-white rounded-3xl shadow-lg p-5 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🗺️ More Destinations</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Xi'an", emoji: '🏛️', tag: 'History' },
              { name: 'Guilin', emoji: '🏞️', tag: 'Nature' },
              { name: 'Chengdu', emoji: '🐼', tag: 'Food' },
              { name: 'Hangzhou', emoji: '🌸', tag: 'Culture' },
            ].map(city => (
              <button
                key={city.name}
                onClick={() => setSelectedCity(city.name.toLowerCase().replace("'", '-') + '-3days')}
                className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl text-left active:scale-[0.98] transition-transform border border-gray-200 hover:border-emerald-400 touch-manipulation"
              >
                <span className="text-2xl mb-1 block">{city.emoji}</span>
                <span className="font-semibold text-gray-900 text-sm">{city.name}</span>
                <span className="text-xs text-gray-400">{city.tag}</span>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Detail Modal */}
      {selectedTrip && (
        <TripDetailModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
}
