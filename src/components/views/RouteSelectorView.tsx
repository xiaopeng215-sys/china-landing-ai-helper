'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClientI18n } from '@/lib/i18n/client';

interface RouteOption {
  id: string;
  title: string;
  description: string;
  duration: string;
  distance: string;
  calories: number;
  carbonSaved: number;
  difficulty: 'easy' | 'medium' | 'hard';
  elevation: string;
  highlights: string[];
  image: string;
  recommended?: boolean;
  popular?: boolean;
}

interface RouteSelectorViewProps {
  from: string;
  to: string;
  onSelectRoute?: (route: RouteOption) => void;
}

export default function RouteSelectorView({
  from = 'Current Location',
  to = 'Destination',
  onSelectRoute,
}: RouteSelectorViewProps) {
  const router = useRouter();
  const { t } = useClientI18n();
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'fastest' | 'scenic' | 'easy'>('all');

  const routes: RouteOption[] = [
    {
      id: 'route-1',
      title: 'Bund Riverside Greenway',
      description: 'Ride along the Huangpu River with views of the Lujiazui skyline',
      duration: '25 min',
      distance: '6.2 km',
      calories: 180,
      carbonSaved: 2.1,
      difficulty: 'easy',
      elevation: 'Flat',
      highlights: ['Bund Viewpoint', 'Riverside Promenade', 'Lujiazui Panorama'],
      image: 'https://images.unsplash.com/photo-1548266652-99cf277df75e?w=1200&h=600&fit=crop',
      recommended: true,
      popular: true,
    },
    {
      id: 'route-2',
      title: 'French Concession Cultural Tour',
      description: 'Weave through plane tree canopies and feel old Shanghai charm',
      duration: '40 min',
      distance: '8.5 km',
      calories: 240,
      carbonSaved: 2.8,
      difficulty: 'easy',
      elevation: 'Flat',
      highlights: ['Wukang Mansion', 'Tianzifang', 'Sinan Mansions'],
      image: 'https://images.unsplash.com/photo-1558273611-58e3a63d7f4e?w=1200&h=600&fit=crop',
      popular: true,
    },
    {
      id: 'route-3',
      title: 'Suzhou Creek Riverside Route',
      description: 'Ride along Suzhou Creek and enjoy a relaxed city pace',
      duration: '35 min',
      distance: '7.8 km',
      calories: 210,
      carbonSaved: 2.5,
      difficulty: 'medium',
      elevation: 'Slight hills',
      highlights: ['Suzhou Creek Trail', 'Sihang Warehouse', 'Bund Source'],
      image: 'https://images.unsplash.com/photo-1508807671390-9280b2e17074?w=1200&h=600&fit=crop',
    },
    {
      id: 'route-4',
      title: 'Express Direct Route',
      description: 'Shortest path — ideal when you\'re in a hurry',
      duration: '18 min',
      distance: '4.5 km',
      calories: 130,
      carbonSaved: 1.5,
      difficulty: 'easy',
      elevation: 'Flat',
      highlights: ['City Streets'],
      image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&h=600&fit=crop',
    },
  ];

  const filteredRoutes = routes.filter((route) => {
    if (filter === 'all') return true;
    if (filter === 'fastest') return route.id === 'route-4';
    if (filter === 'scenic') return route.popular;
    if (filter === 'easy') return route.difficulty === 'easy';
    return true;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-teal-100 text-teal-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return t('RouteSelectorView.difficultyEasy');
      case 'medium': return t('RouteSelectorView.difficultyMedium');
      case 'hard': return t('RouteSelectorView.difficultyHard');
      default: return difficulty;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 mb-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={() => router.back()}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900">{t('RouteSelectorView.title')}</h1>
          </div>

          {/* Route Summary */}
          <div className="bg-gradient-to-r from-teal-50 to-teal-50 rounded-2xl p-4 border border-teal-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
                  {from}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  {to}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{t('RouteSelectorView.totalDistance')}</p>
                <p className="text-lg font-bold text-gray-900">4.5–8.5 km</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="sticky top-[140px] z-40 bg-gray-50 py-3">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
                        { id: 'all', label: t('RouteSelectorView.filterAll'), icon: '🗺️' },
              { id: 'fastest', label: t('RouteSelectorView.filterFastest'), icon: '⚡' },
              { id: 'scenic', label: t('RouteSelectorView.filterScenic'), icon: '🌸' },
              { id: 'easy', label: t('RouteSelectorView.filterEasy'), icon: '😊' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as 'all' | 'fastest' | 'scenic' | 'easy')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  filter === tab.id
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Route List */}
      <main className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        {filteredRoutes.map((route) => (
          <div
            key={route.id}
            onClick={() => {
              setSelectedRoute(route.id);
              onSelectRoute?.(route);
            }}
            className={`bg-white rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
              selectedRoute === route.id
                ? 'border-teal-600 shadow-lg ring-2 ring-teal-200'
                : 'border-gray-100 shadow-md hover:shadow-lg hover:border-teal-200'
            }`}
          >
            {/* Hero Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={route.image}
                alt={route.title}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                                {route.recommended && (
                  <span className="px-3 py-1 bg-teal-600 text-white text-xs font-bold rounded-full shadow-lg">
                    {t('RouteSelectorView.badgeRecommended')}
                  </span>
                )}
                {route.popular && (
                  <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg">
                    {t('RouteSelectorView.badgePopular')}
                  </span>
                )}
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="text-lg font-bold mb-1">{route.title}</h3>
                <p className="text-sm text-white/90">{route.description}</p>
              </div>
            </div>

            {/* Route Details */}
            <div className="p-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">{t('RouteSelectorView.statTime')}</p>
                  <p className="font-bold text-gray-900">{route.duration}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">{t('RouteSelectorView.statDistance')}</p>
                  <p className="font-bold text-gray-900">{route.distance}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">{t('RouteSelectorView.statCalories')}</p>
                  <p className="font-bold text-gray-900">{route.calories}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">{t('RouteSelectorView.statCO2')}</p>
                  <p className="font-bold text-teal-600">{route.carbonSaved}kg</p>
                </div>
              </div>

              {/* Difficulty & Elevation */}
              <div className="flex items-center gap-3 mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(route.difficulty)}`}>
                  {getDifficultyLabel(route.difficulty)}
                </span>
                <span className="text-sm text-gray-600">🏔️ {route.elevation}</span>
              </div>

              {/* Highlights */}
                            <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">{t('RouteSelectorView.highlights')}</p>
                <div className="flex flex-wrap gap-2">
                  {route.highlights.map((highlight, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  selectedRoute === route.id
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : 'bg-teal-50 text-teal-600 hover:bg-teal-100'
                }`}
              >
                                {selectedRoute === route.id ? t('RouteSelectorView.selectedRoute') : t('RouteSelectorView.selectRoute')}
              </button>
            </div>
          </div>
        ))}

        {/* Map Preview */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-900">{t('RouteSelectorView.mapPreview')}</h3>
            <button className="text-sm text-teal-600 font-medium hover:text-teal-700" onClick={() => window.open('https://amap.com', '_blank', 'noopener,noreferrer')}>
              {t('RouteSelectorView.openInAmap')}
            </button>
          </div>
          <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-4xl mb-2">🗺️</p>
                            <p className="text-sm">{t('RouteSelectorView.mapLoading')}</p>
              <p className="text-xs mt-1">{t('RouteSelectorView.mapIntegration')}</p>
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div className="flex-1">
                            <h4 className="font-bold text-amber-800 mb-2">{t('RouteSelectorView.safetyTitle')}</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• {t('RouteSelectorView.safety1')}</li>
                <li>• {t('RouteSelectorView.safety2')}</li>
                <li>• {t('RouteSelectorView.safety3')}</li>
                <li>• {t('RouteSelectorView.safety4')}</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
