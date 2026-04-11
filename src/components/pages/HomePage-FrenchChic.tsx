'use client';

import React, { useState } from 'react';

export default function HomePageFrenchChic() {
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    setInputValue('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      {/* French Chic Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-[#1a1a2e]/80 border-b border-[#c9a962]/30 shadow-2xl">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#c9a962] to-[#f4e5c2] rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-[#c9a962]/50">
                🇨🇳
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#c9a962] to-[#f4e5c2] bg-clip-text text-transparent" style={{ fontFamily: 'Playfair Display, serif' }}>
                  China AI Helper
                </h1>
                <p className="text-xs text-[#c9a962]/70">Votre assistant de voyage intelligent</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-[#c9a962] to-[#f4e5c2] text-[#1a1a2e] rounded-full shadow-lg hover:shadow-xl transition-all border border-[#c9a962]/50">
                Itinéraire
              </button>
              <button className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-[#c9a962] to-[#f4e5c2] text-[#1a1a2e] rounded-full shadow-lg hover:shadow-xl transition-all border border-[#c9a962]/50">
                Gastronomie
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        
        {/* Hero Welcome Card - French Luxury Style */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-[#c9a962]/30">
          <div className="absolute inset-0 bg-gradient-to-br from-[#c9a962]/20 via-[#1a1a2e]/80 to-[#0f3460]/80"></div>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #c9a962 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
          <div className="relative p-8">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#c9a962] to-[#f4e5c2] rounded-3xl flex items-center justify-center text-4xl flex-shrink-0 shadow-xl border border-[#c9a962]/50">
                🤖
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[#f4e5c2] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  🇨🇳 Bienvenue en Chine!
                </h2>
                <p className="text-[#c9a962]/90 mb-4 leading-relaxed text-[#e8e8e8]">
                  我是你的 AI 旅行助手，帮你规划完美行程、发现地道美食、轻松出行
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: '✈️', text: '智能行程规划' },
                    { icon: '🍜', text: '地道美食推荐' },
                    { icon: '🚇', text: '交通出行指导' },
                    { icon: '💳', text: '支付实名认证' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-[#c9a962]/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-[#c9a962]/20">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm font-medium text-[#e8e8e8]">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - French Luxury Cards */}
        <div className="bg-[#f5f5f5]/5 backdrop-blur-lg rounded-3xl shadow-2xl p-6 border border-[#c9a962]/20">
          <h3 className="text-lg font-bold text-[#f4e5c2] mb-4 flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <span className="text-xl">🎯</span>
            Commencez rapidement
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '🗺️', gradient: 'from-[#c9a962] to-[#f4e5c2]', title: '上海 4 天行程', desc: '经典地标 + 美食' },
              { icon: '🍜', gradient: 'from-[#d4af37] to-[#f4e5c2]', title: '必吃美食', desc: '本地人推荐' },
              { icon: '🚇', gradient: 'from-[#b8926a] to-[#f4e5c2]', title: '地铁指南', desc: '购票 + 线路图' },
              { icon: '🚴', gradient: 'from-[#c9a962] to-[#e8d5a3]', title: '共享单车', desc: '租车教程' }
            ].map((card, i) => (
              <button
                key={i}
                className="group relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-[#1a1a2e]/50 to-[#16213e]/50 hover:shadow-2xl transition-all duration-300 text-left border border-[#c9a962]/20 hover:border-[#c9a962]/40"
              >
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${card.gradient} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>
                <div className="relative">
                  <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center text-2xl mb-3 shadow-lg group-hover:shadow-xl transition-all border border-[#c9a962]/30`}>
                    {card.icon}
                  </div>
                  <div className="font-bold text-[#f4e5c2] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>{card.title}</div>
                  <div className="text-sm text-[#c9a962]/70">{card.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Day Itinerary Card - French Timeline Style */}
        <div className="bg-[#f5f5f5]/5 backdrop-blur-lg rounded-3xl shadow-2xl p-6 border border-[#c9a962]/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#c9a962] to-[#f4e5c2] rounded-2xl flex items-center justify-center text-xl shadow-lg border border-[#c9a962]/50">
                📍
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#f4e5c2]" style={{ fontFamily: 'Playfair Display, serif' }}>Day 1 · 经典上海</h3>
                <p className="text-xs text-[#c9a962]/70">全天 · 骑行 · 美食</p>
              </div>
            </div>
            <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-[#c9a962] to-[#f4e5c2] text-[#1a1a2e] rounded-full shadow-lg border border-[#c9a962]/50">
              ⭐ 4.9
            </span>
          </div>
          
          <div className="space-y-4">
            {[
              { time: '09:00', icon: '🌉', title: '外滩', desc: '经典地标，拍照打卡', color: 'from-[#c9a962] to-[#f4e5c2]' },
              { time: '10:30', icon: '🏛️', title: '豫园', desc: '古典园林，门票 ¥40', color: 'from-[#d4af37] to-[#f4e5c2]' },
              { time: '12:00', icon: '🥟', title: '南翔馒头店', desc: '小笼包，人均 ¥60', color: 'from-[#b8926a] to-[#f4e5c2]' },
              { time: '14:00', icon: '🚴', title: '滨江骑行', desc: '8km，风景优美', color: 'from-[#c9a962] to-[#e8d5a3]' },
              { time: '18:00', icon: '🌃', title: '外滩夜景', desc: '灯光秀，免费', color: 'from-[#d4af37] to-[#e8d5a3]' }
            ].map((item, i) => (
              <div key={i} className="group flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-[#1a1a2e]/30 to-[#16213e]/30 hover:shadow-xl transition-all duration-200 border border-[#c9a962]/20 hover:border-[#c9a962]/40">
                <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-xl shadow-lg flex-shrink-0 group-hover:shadow-xl transition-all border border-[#c9a962]/30`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-[#c9a962]">{item.time}</span>
                    <span className="font-semibold text-[#f4e5c2]" style={{ fontFamily: 'Playfair Display, serif' }}>{item.title}</span>
                  </div>
                  <div className="text-sm text-[#c9a962]/70 truncate">{item.desc}</div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#c9a962]/10 rounded-xl text-[#c9a962]">
                  →
                </button>
              </div>
            ))}
          </div>
          
          <button className="mt-6 w-full py-4 bg-gradient-to-r from-[#c9a962] to-[#f4e5c2] text-[#1a1a2e] rounded-2xl font-semibold shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-200 border border-[#c9a962]/50" style={{ fontFamily: 'Playfair Display, serif' }}>
            查看完整行程 →
          </button>
        </div>

        {/* Chat Input - French Luxury Style */}
        <div className="sticky bottom-4">
          <div className="bg-[#f5f5f5]/5 backdrop-blur-lg rounded-3xl shadow-2xl p-4 border border-[#c9a962]/20">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="告诉我你的需求，比如'帮我规划上海 4 天行程'..."
                className="flex-1 px-4 py-3 bg-[#1a1a2e]/50 rounded-2xl border border-[#c9a962]/30 focus:outline-none focus:ring-2 focus:ring-[#c9a962] focus:border-transparent transition-all text-[#e8e8e8] placeholder-[#c9a962]/50"
              />
              <button
                onClick={handleSendMessage}
                className="px-6 py-3 bg-gradient-to-r from-[#c9a962] to-[#f4e5c2] text-[#1a1a2e] rounded-2xl font-semibold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-200 border border-[#c9a962]/50"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
