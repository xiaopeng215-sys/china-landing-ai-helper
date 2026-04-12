'use client';

import React, { useEffect, useState } from 'react';

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white text-center py-2 text-sm font-medium animate-slide-down">
      <div className="flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.828-2.828m2.828 2.828L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.828-2.828m-4.244 2.828a5 5 0 01-1.414-1.414M6 6a9 9 0 019 9M6 6l2.828 2.828M6 6L3.172 8.828m2.828-2.828L3 3m15.364 12.728L21 18.364" />
        </svg>
        <span>当前处于离线状态，部分功能可能不可用</span>
      </div>
    </div>
  );
}
