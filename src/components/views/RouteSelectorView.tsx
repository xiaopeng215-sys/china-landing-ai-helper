'use client';

import React, { useState } from 'react';

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
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'fastest' | 'scenic' | 'easy'>('all');

  const routes: RouteOption[] = [
    {
      id: 'route-1',
      title: '外滩滨江绿道',
      description: '沿黄浦江骑行，欣赏陆家嘴天际线',
      duration: '25 分钟',
      distance: '6.2 km',
      calories: 180,
      carbonSaved: 2.1,
      difficulty: 'easy',
      elevation: '平坦',
      highlights: ['外滩观景台', '滨江步道', '陆家嘴全景'],
      image: 'https://images.unsplash.com/photo-1548266652-99cf277df75e?w=1200&h=600&fit=crop',
      recommended: true,
      popular: true,
    },
    {
      id: 'route-2',
      title: '法租界文艺之旅',
      description: '穿梭梧桐树荫，感受老上海风情',
      duration: '40 分钟',
      distance: '8.5 km',
      calories: 240,
      carbonSaved: 2.8,
      difficulty: 'easy',
      elevation: '平坦',
      highlights: ['武康大楼', '田子坊', '思南公馆'],
      image: 'https://images.unsplash.com/photo-1558273611-58e3a63d7f4e?w=1200&h=600&fit=crop',
      popular: true,
    },
    {
      id: 'route-3',
      title: '苏州河沿岸路线',
      description: '沿苏州河骑行，体验城市慢生活',
      duration: '35 分钟',
      distance: '7.8 km',
      calories: 210,
      carbonSaved: 2.5,
      difficulty: 'medium',
      elevation: '少量起伏',
      highlights: ['苏州河步道', '四行仓库', '外滩源'],
      image: 'https://images.unsplash.com/photo-1508807671390-9280b2e17074?w=1200&h=600&fit=crop',
    },
    {
      id: 'route-4',
      title: '快速直达路线',
      description: '最短路径，适合赶时间',
      duration: '18 分钟',
      distance: '4.5 km',
      calories: 130,
      carbonSaved: 1.5,
      difficulty: 'easy',
      elevation: '平坦',
      highlights: ['城市街道'],
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
      case 'easy':
        return 'bg-emerald-100 text-emerald-700';
      case 'medium':
        return 'bg-amber-100 text-amber-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 mb-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900">选择骑行路线</h1>
          </div>
          
          {/* Route Summary */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-4 border border-emerald-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  {from}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  {to}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">总距离</p>
                <p className="text-lg font-bold text-gray-900">4.5-8.5 km</p>
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
              { id: 'all', label: '全部路线', icon: '🗺️' },
              { id: 'fastest', label: '最快', icon: '⚡' },
              { id: 'scenic', label: '风景最美', icon: '🌸' },
              { id: 'easy', label: '最轻松', icon: '😊' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  filter === tab.id
                    ? 'bg-emerald-500 text-white shadow-md'
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
                ? 'border-emerald-500 shadow-lg ring-2 ring-emerald-200'
                : 'border-gray-100 shadow-md hover:shadow-lg hover:border-emerald-200'
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
                  <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
                    ⭐ 推荐
                  </span>
                )}
                {route.popular && (
                  <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
                    🔥 热门
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
                  <p className="text-xs text-gray-500 mb-1">⏱️ 时长</p>
                  <p className="font-bold text-gray-900">{route.duration}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">📏 距离</p>
                  <p className="font-bold text-gray-900">{route.distance}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">🔥 卡路里</p>
                  <p className="font-bold text-gray-900">{route.calories}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">🌱 减碳</p>
                  <p className="font-bold text-emerald-600">{route.carbonSaved}kg</p>
                </div>
              </div>

              {/* Difficulty & Elevation */}
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(route.difficulty)}`}>
                  {route.difficulty === 'easy' && '轻松'}
                  {route.difficulty === 'medium' && '中等'}
                  {route.difficulty === 'hard' && '挑战'}
                </span>
                <span className="text-sm text-gray-600">🏔️ {route.elevation}</span>
              </div>

              {/* Highlights */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">✨ 沿途亮点:</p>
                <div className="flex flex-wrap gap-2">
                  {route.highlights.map((highlight, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  selectedRoute === route.id
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                }`}
              >
                {selectedRoute === route.id ? '✓ 已选择' : '选择此路线'}
              </button>
            </div>
          </div>
        ))}

        {/* Map Preview */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">🗺️ 地图预览</h3>
            <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">
              打开高德地图 →
            </button>
          </div>
          <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-4xl mb-2">🗺️</p>
              <p className="text-sm">地图加载中...</p>
              <p className="text-xs mt-1">集成高德/Google Maps API</p>
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div className="flex-1">
              <h4 className="font-bold text-amber-800 mb-2">安全提示</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• 请佩戴头盔，遵守交通规则</li>
                <li>• 使用非机动车道，注意行人</li>
                <li>• 雨天路滑，谨慎骑行</li>
                <li>• 夜间骑行请开车灯</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
