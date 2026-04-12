'use client';

import React from 'react';

/**
 * TripsView 加载覆盖层组件
 */
export default function TripsLoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
