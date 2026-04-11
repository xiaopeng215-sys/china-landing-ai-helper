'use client';

import React from 'react';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export default function Header({
  title,
  showBack = false,
  onBack,
  rightAction,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="h-safe-area-top bg-white" />
      
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={onBack}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <span className="text-xl">←</span>
            </button>
          )}
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </div>
        
        {rightAction && <div>{rightAction}</div>}
      </div>
    </header>
  );
}
