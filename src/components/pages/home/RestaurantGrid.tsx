'use client';

import React, { useState } from 'react';

interface Restaurant {
  id: number;
  name: string;
  rating: number;
  reviewCount: number;
  pricePerPerson: string;
  cuisine: string;
  location: string;
  distance: string;
  imageUrl: string;
}

interface RestaurantGridProps {
  restaurants?: Restaurant[];
}

const DEFAULT_RESTAURANTS: Restaurant[] = [
  {
    id: 1,
    name: '南翔馒头店',
    rating: 4.8,
    reviewCount: 12580,
    pricePerPerson: '¥60',
    cuisine: '本帮菜',
    location: '黄浦区豫园路 85 号',
    distance: '300m',
    imageUrl: '/images/food/xiaolongbao.jpg',
  },
  {
    id: 2,
    name: '老正兴菜馆',
    rating: 4.7,
    reviewCount: 8920,
    pricePerPerson: '¥120',
    cuisine: '本帮菜',
    location: '黄浦区福州路 556 号',
    distance: '1.2km',
    imageUrl: '/images/food/benbang.jpg',
  },
  {
    id: 3,
    name: '佳家汤包',
    rating: 4.6,
    reviewCount: 6540,
    pricePerPerson: '¥45',
    cuisine: '小吃',
    location: '黄浦区黄河路 90 号',
    distance: '800m',
    imageUrl: '/images/food/tangbao.jpg',
  },
];

export default function RestaurantGrid({ restaurants = DEFAULT_RESTAURANTS }: RestaurantGridProps) {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover-lift animate-slideUp" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-2xl shadow-md">
            🍜
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">必吃美食推荐</h3>
            <p className="text-sm text-gray-600">本地人最爱的地道餐厅</p>
          </div>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors btn-ripple">
          查看全部 →
        </button>
      </div>
      
      {/* 餐厅列表 */}
      <div className="space-y-4">
        {restaurants.map((restaurant) => (
          <div 
            key={restaurant.id}
            className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover-lift"
          >
            <div className="flex">
              {/* 美食大图 - 占 60% 面积 */}
              <div className="relative w-[60%] h-40 flex-shrink-0 bg-gradient-to-br from-orange-100 to-yellow-100 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-6xl">
                  🍜
                </div>
                {/* 评分徽章 */}
                <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/95 glass-effect rounded-full shadow-lg flex items-center gap-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-bold text-gray-900">{restaurant.rating}</span>
                </div>
                {/* 收藏心形按钮 */}
                <button 
                  onClick={() => toggleFavorite(restaurant.id)}
                  className="absolute top-3 right-3 w-10 h-10 bg-white/95 glass-effect rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform btn-ripple"
                >
                  <span className="text-xl">
                    {favorites.has(restaurant.id) ? '❤️' : '🤍'}
                  </span>
                </button>
              </div>
              
              {/* 内容区域 */}
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
                    {restaurant.name}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span>{restaurant.cuisine}</span>
                    <span>•</span>
                    <span className="text-green-600 font-medium">{restaurant.pricePerPerson}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span>📍</span>
                    <span className="truncate">{restaurant.location}</span>
                  </div>
                  {restaurant.distance && (
                    <div className="text-xs text-gray-500 mt-1">
                      🚇 距离 {restaurant.distance}
                    </div>
                  )}
                </div>
                
                {/* 快速操作按钮 */}
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover-lift btn-ripple transition-all">
                    导航
                  </button>
                  <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 hover-lift btn-ripple transition-all">
                    菜单
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
