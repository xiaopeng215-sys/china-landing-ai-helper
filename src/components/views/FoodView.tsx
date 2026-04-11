'use client';

import React from 'react';
import RestaurantCard from '@/components/RestaurantCard';
import Header from '@/components/layout/Header';
import { ListSkeleton } from '@/components/ui/Skeleton';
import type { Restaurant } from '@/lib/types';

interface FoodViewProps {
  restaurants: Restaurant[];
  loading: boolean;
  category: string | undefined;
  setCategory: (category: string | undefined) => void;
  onSearch: () => void;
}

export default function FoodView({
  restaurants,
  loading,
  category,
  setCategory,
  onSearch,
}: FoodViewProps) {
  const categories = ['本帮菜', '小吃', '火锅', '咖啡', '烧烤'];

  return (
    <div className="p-4 pb-24">
      <Header
        title="美食地图"
        rightAction={
          <button
            onClick={onSearch}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            🔍 搜索
          </button>
        }
      />
      <div className="h-48 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl mb-4 flex items-center justify-center mt-4">
        <span className="text-4xl">🗺️</span>
      </div>
      <div className="flex gap-2 overflow-x-auto mb-4 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat === category ? undefined : cat)}
            className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
              category === cat
                ? 'bg-emerald-500 text-white'
                : 'bg-white border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {loading ? (
          <ListSkeleton count={3} />
        ) : (
          restaurants.map((restaurant) => <RestaurantCard key={restaurant.id} {...restaurant} />)
        )}
      </div>
    </div>
  );
}
