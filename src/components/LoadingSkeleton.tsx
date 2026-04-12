'use client';

import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'text' | 'image' | 'profile';
  count?: number;
}

export default function LoadingSkeleton({ type = 'card', count = 3 }: LoadingSkeletonProps) {
  if (type === 'card') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-md p-4 animate-pulse">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className="space-y-2 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    );
  }

  if (type === 'image') {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-200 rounded-2xl w-full h-48"></div>
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className="animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
