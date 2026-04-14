'use client';

import React from 'react';

interface FeatureItem {
  icon: string;
  text: string;
  sub: string;
}

const FEATURES: FeatureItem[] = [
  { icon: '✈️', text: 'AI Trip Planning', sub: 'Custom routes' },
  { icon: '🍜', text: 'Local Food', sub: 'Locals\' favorites' },
  { icon: '🚇', text: 'Transport Guide', sub: 'Metro + Bus' },
  { icon: '💳', text: 'Payment & ID', sub: 'Alipay + WeChat' }
];

export default function WelcomeCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl shadow-2xl hover-lift animate-slideUp">
      {/* 大图背景 - 中国风景 */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-br from-red-500 via-red-600 to-red-700">
          {/* 装饰性图案 - 中国风 */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <pattern id="chinese-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0L60 30L30 60L0 30Z" fill="#ffffff" fillOpacity="0.3"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#chinese-pattern)"/>
          </svg>
        </div>
      </div>
      
      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      
      {/* 内容 - 白色文字 */}
      <div className="relative p-8 text-white">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-white/20 glass-effect rounded-3xl flex items-center justify-center text-4xl flex-shrink-0 border border-white/30 hover-lift cursor-pointer">
            🤖
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-3 drop-shadow-lg">🇨🇳 Welcome to China!</h2>
            <p className="text-white/95 text-lg mb-6 leading-relaxed drop-shadow">
              I'm your AI travel assistant — helping you plan trips, find local food, and get around with ease.
            </p>
            
            {/* 功能网格 */}
            <div className="grid grid-cols-2 gap-3">
              {FEATURES.map((item, i) => (
                <div 
                  key={i} 
                  className="group flex items-center gap-3 bg-white/15 glass-effect rounded-2xl px-4 py-3 border border-white/20 hover:bg-white/25 transition-all hover-lift cursor-pointer"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                  <div>
                    <div className="text-sm font-semibold">{item.text}</div>
                    <div className="text-xs text-white/70">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* CTA 按钮 */}
            <div className="mt-6 flex gap-3">
              <button className="flex-1 py-4 bg-white text-red-600 rounded-2xl font-bold shadow-lg hover:shadow-xl hover-lift btn-ripple transition-all">
                🚀 Start Planning
              </button>
              <button className="px-6 py-4 bg-white/20 glass-effect text-white rounded-2xl font-semibold border border-white/30 hover:bg-white/30 hover-lift btn-ripple transition-all">
                ▶️ Watch Tutorial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
