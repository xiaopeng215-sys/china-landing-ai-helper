'use client';

import React from 'react';

export default function TripCardSkeleton() {
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
