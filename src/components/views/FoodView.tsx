'use client';

import React from 'react';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  price: string;
  distance: string;
  image: string;
  tags: string[];
}

export default function FoodView() {
  const restaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Nanxiang Steamed Bun Restaurant',
      cuisine: 'Shanghai · Dumplings',
      rating: 4.8,
      price: '¥¥',
      distance: '0.5 km',
      image: '🥟',
      tags: ['Xiaolongbao', 'Local Favorite', 'Historic'],
    },
    {
      id: '2',
      name: 'Din Tai Fung',
      cuisine: 'Taiwanese · Soup Dumplings',
      rating: 4.7,
      price: '¥¥¥',
      distance: '1.2 km',
      image: '🍜',
      tags: ['Michelin', 'Clean', 'Popular'],
    },
    {
      id: '3',
      name: 'Haidilao Hot Pot',
      cuisine: 'Sichuan · Hot Pot',
      rating: 4.9,
      price: '¥¥¥',
      distance: '2.0 km',
      image: '🍲',
      tags: ['Service', 'Spicy', 'Group Friendly'],
    },
    {
      id: '4',
      name: 'Jia Jia Tang Bao',
      cuisine: 'Shanghai · Soup Buns',
      rating: 4.6,
      price: '¥',
      distance: '0.8 km',
      image: '🥠',
      tags: ['Budget', 'Local', 'Breakfast'],
    },
  ];

  const categories = [
    { icon: '🥟', name: 'Dumplings' },
    { icon: '🍜', name: 'Noodles' },
    { icon: '🍲', name: 'Hot Pot' },
    { icon: '🦆', name: 'Peking Duck' },
    { icon: '🍢', name: 'Street Food' },
    { icon: '🍚', name: 'Rice Dishes' },
    { icon: '🥗', name: 'Vegetarian' },
    { icon: '🍰', name: 'Desserts' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-[#484848]">Food Guide</h1>
          <p className="text-sm text-[#767676]">Discover authentic local flavors</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search restaurants or dishes..."
              className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] transition-all"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all">
              Search
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-[#484848] mb-4">Categories</h3>
          <div className="grid grid-cols-4 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.name}
                className="flex flex-col items-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 hover:border-[#ff5a5f] hover:shadow-md transition-all"
              >
                <span className="text-3xl mb-2">{cat.icon}</span>
                <span className="text-xs font-medium text-[#484848]">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Restaurant Cards */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#484848]">Recommended Near You</h3>
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-[#ff5a5f] to-[#ff3b3f] rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                  {restaurant.image}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[#484848] mb-1">{restaurant.name}</h4>
                  <p className="text-sm text-[#767676] mb-2">{restaurant.cuisine}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-[#34a853]">⭐ {restaurant.rating}</span>
                    <span className="text-sm text-[#767676]">{restaurant.price}</span>
                    <span className="text-sm text-[#767676]">{restaurant.distance}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {restaurant.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-[#767676] text-xs rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-[#34a853] to-[#2d8e47] rounded-3xl shadow-xl p-6 text-white text-center">
          <div className="text-5xl mb-4">🗺️</div>
          <h3 className="text-xl font-bold mb-2">Need Personalized Recommendations?</h3>
          <p className="text-white/90 mb-4">Tell me your preferences and I'll suggest the best local spots!</p>
          <button className="px-6 py-3 bg-white text-[#34a853] rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all">
            Ask AI for Recommendations
          </button>
        </div>
      </main>
    </div>
  );
}
