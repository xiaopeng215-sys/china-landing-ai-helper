'use client';

import React from 'react';
import { Skeleton } from '../ui';

interface FoodCardProps {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  pricePerPerson: string;
  cuisine: string;
  location: string;
  distance: string;
  onClick?: () => void;
  isLoading?: boolean;
}

export default function FoodCard({
  name,
  rating,
  reviewCount,
  pricePerPerson,
  cuisine,
  location,
  distance,
  onClick,
  isLoading = false,
}: FoodCardProps) {
  // 加载状态显示骨架屏
  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <div className="flex justify-between items-start mb-2">
          <Skeleton height="1.25rem" width="60%" />
          <Skeleton height="1rem" width="4rem" />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Skeleton height="0.875rem" width="4rem" />
          <Skeleton height="0.875rem" width="3rem" />
          <Skeleton height="0.875rem" width="3rem" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton height="0.75rem" width="50%" />
          <Skeleton height="0.75rem" width="30%" />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-900">{name}</h3>
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">⭐</span>
          <span className="text-sm font-medium">{rating}</span>
          <span className="text-xs text-gray-500">({reviewCount})</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <span>{cuisine}</span>
        <span>•</span>
        <span>{pricePerPerson}</span>
      </div>
      
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>📍 {location}</span>
        <span>🚶 {distance}</span>
      </div>
    </div>
  );
}
