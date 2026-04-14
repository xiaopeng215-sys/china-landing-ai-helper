'use client';

import React from 'react';

interface HeaderProps {
  onTripClick?: () => void;
  onFoodClick?: () => void;
}

const CHINA_COLORS = {
  chinaRed: '#DC2626',
  chinaGold: '#D97706',
  cardRadius: '24px',
};

export default function PremiumHeader({ onTripClick, onFoodClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass-effect bg-white/80 border-b border-gray-200/50 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 china-gradient rounded-2xl flex items-center justify-center text-2xl shadow-lg hover-lift cursor-pointer"
              style={{ borderRadius: CHINA_COLORS.cardRadius }}
            >
              🇨🇳
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent">
                China AI Helper
              </h1>
              <p className="text-xs text-gray-600">你的智能旅行助手</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onTripClick}
              className="px-4 py-2 text-xs font-medium bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-md hover:shadow-lg hover-lift btn-ripple transition-all"
            >
              📅 行程
            </button>
            <button 
              onClick={onFoodClick}
              className="px-4 py-2 text-xs font-medium bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-md hover:shadow-lg hover-lift btn-ripple transition-all"
            >
              🍜 美食
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
