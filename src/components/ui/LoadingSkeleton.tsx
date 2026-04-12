'use client';

import React from 'react';

interface LoadingSkeletonProps {
  type?: 'chat' | 'trips' | 'food' | 'transport' | 'profile' | 'default';
}

export default function LoadingSkeleton({ type = 'default' }: LoadingSkeletonProps) {
  if (type === 'chat') {
    return (
      <div className="space-y-4 p-4 animate-pulse">
        {/* Header */}
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3" />
        
        {/* Message bubbles */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-emerald-100 rounded w-2/3 ml-auto" />
            </div>
            <div className="w-8 h-8 bg-emerald-200 rounded-full" />
          </div>
        </div>
        
        {/* Input area */}
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t">
          <div className="h-10 bg-gray-100 rounded-full" />
        </div>
      </div>
    );
  }

  if (type === 'trips') {
    return (
      <div className="space-y-4 p-4 animate-pulse">
        {/* Header */}
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 mb-4" />
        
        {/* Trip cards */}
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl mb-4" />
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-1/2 mb-3" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-50 rounded w-full" />
              <div className="h-3 bg-gray-50 rounded w-5/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'food') {
    return (
      <div className="space-y-4 p-4 animate-pulse">
        {/* Header */}
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 mb-4" />
        
        {/* Food cards grid */}
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow">
              <div className="h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'transport') {
    return (
      <div className="space-y-4 p-4 animate-pulse">
        {/* Header */}
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3 mb-4" />
        
        {/* Transport options */}
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow flex gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className="space-y-4 p-4 animate-pulse">
        {/* Profile header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-100 rounded w-1/3" />
          </div>
        </div>
        
        {/* Menu items */}
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="bg-white rounded-xl p-4 shadow flex items-center gap-4">
            <div className="w-8 h-8 bg-gray-200 rounded-lg" />
            <div className="h-4 bg-gray-100 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  // Default skeleton
  return (
    <div className="space-y-4 p-4 animate-pulse">
      <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 mb-4" />
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-gray-100 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
