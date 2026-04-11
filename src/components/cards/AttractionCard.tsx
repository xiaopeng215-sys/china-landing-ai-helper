'use client';

import React from 'react';
import { Skeleton } from '../ui';

interface AttractionCardProps {
  id: string;
  name: string;
  rating: number;
  description: string;
  location: string;
  openingHours: string;
  ticketPrice: string;
  tags: string[];
  onClick?: () => void;
  isLoading?: boolean;
}

export default function AttractionCard({
  name,
  rating,
  description,
  location,
  openingHours,
  ticketPrice,
  tags,
  onClick,
  isLoading = false,
}: AttractionCardProps) {
  // 加载状态显示骨架屏
  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <div className="flex justify-between items-start mb-2">
          <Skeleton height="1.25rem" width="60%" />
          <Skeleton height="1rem" width="3rem" />
        </div>
        <Skeleton className="mb-3" height="0.75rem" width="100%" />
        <Skeleton className="mb-3" height="0.75rem" width="80%" />
        <div className="flex gap-1 mb-3">
          <Skeleton height="1.5rem" width="4rem" borderRadius="9999px" />
          <Skeleton height="1.5rem" width="4rem" borderRadius="9999px" />
          <Skeleton height="1.5rem" width="4rem" borderRadius="9999px" />
        </div>
        <div className="space-y-1">
          <Skeleton height="0.75rem" width="70%" />
          <Skeleton height="0.75rem" width="60%" />
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
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="space-y-1 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span>📍 {location}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🕐 {openingHours}</span>
          <span>•</span>
          <span>🎫 {ticketPrice}</span>
        </div>
      </div>
    </div>
  );
}
