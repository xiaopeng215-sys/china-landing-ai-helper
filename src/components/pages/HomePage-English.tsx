'use client';

import React, { useState } from 'react';

export default function HomePageEnglish() {
  const [messages] = useState([
    { role: 'assistant', content: '👋 Welcome to China! I\'m your AI travel companion, here to help you plan itineraries, discover local food, and navigate transportation!' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    setInputValue('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      {/* International Header - Airbnb Style */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/90 border-b border-gray-200/50 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#ff5a5f] to-[#ff3b3f] rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                🇨🇳
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#484848]">
                  Welcome to China!
                </h1>
                <p className="text-xs text-[#767676]">Your AI Travel Companion</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs font-medium bg-[#1a73e8] text-white rounded-full shadow-md hover:shadow-lg transition-all">
                Trips
              </button>
              <button className="px-3 py-1.5 text-xs font-medium bg-[#ff5a5f] text-white rounded-full shadow-md hover:shadow-lg transition-all">
                Food
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        
        {/* Hero Welcome Card - Google Travel Style */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#ff5a5f] via-[#ff3b3f] to-[#e62e2e]"></div>
          <div className="absolute inset-0 opacity-15" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zm-6 6V0h-2v4h-4v2h4v4h2V6h4V4h-4zm0 60V60h-2v4h-4v2h4v4h2v-4h4v-2h-4zm30-60V0h-2v4h-4v2h4v4h2V6h4V4h-4zm-6 6V0h-2v4h-4v2h4v4h2V6h4V4h-4zm0 60V60h-2v4h-4v2h4v4h2v-4h4v-2h-4zm30-60V0h-2v4h-4v2h4v4h2V6h4V4h-4zm-6 6V0h-2v4h-4v2h4v4h2V6h4V4h-4zm0 60V60h-2v4h-4v2h4v4h2v-4h4v-2h-4z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}></div>
          <div className="relative p-8 text-white">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center text-4xl flex-shrink-0 border border-white/30">
                🤖
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">🇨🇳 Welcome to China!</h2>
                <p className="text-white/95 mb-4 leading-relaxed">
                  Your AI-powered travel companion for perfect itineraries, authentic local experiences, and seamless navigation
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: '✈️', text: 'Smart Itinerary' },
                    { icon: '🍜', text: 'Local Food Guide' },
                    { icon: '🚇', text: 'Transport Help' },
                    { icon: '💳', text: 'Payment Setup' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/25">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards - Airbnb Style */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-[#484848] mb-4 flex items-center gap-2">
            <span className="text-xl">🎯</span>
            Start Your Journey
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '🗺️', gradient: 'from-[#1a73e8] to-[#174ea6]', title: 'Smart Itinerary', desc: 'AI-powered trip planning' },
              { icon: '🍜', gradient: 'from-[#ff5a5f] to-[#e62e2e]', title: 'Local Food Guide', desc: 'Authentic recommendations' },
              { icon: '🚇', gradient: 'from-[#34a853] to-[#2d8e47]', title: 'Transport Help', desc: 'Metro, bike & taxi' },
              { icon: '💳', gradient: 'from-[#fbbc04] to-[#ea8600]', title: 'Payment Setup', desc: 'Alipay & WeChat Pay' }
            ].map((card, i) => (
              <button
                key={i}
                className="group relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg transition-all duration-300 text-left border border-gray-200 hover:border-transparent"
              >
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${card.gradient} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>
                <div className="relative">
                  <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center text-2xl mb-3 shadow-md group-hover:shadow-lg transition-all`}>
                    {card.icon}
                  </div>
                  <div className="font-bold text-[#484848] mb-1">{card.title}</div>
                  <div className="text-sm text-[#767676]">{card.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sample Itinerary - TripAdvisor/Google Travel Style */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1a73e8] to-[#174ea6] rounded-2xl flex items-center justify-center text-xl shadow-md">
                📍
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#484848]">Day 1: Classic Shanghai</h3>
                <p className="text-xs text-[#767676]">Full Day · Cycling · Local Food</p>
              </div>
            </div>
            <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-[#34a853] to-[#2d8e47] text-white rounded-full shadow-md">
              ⭐ 4.9
            </span>
          </div>
          
          <div className="space-y-4">
            {[
              { time: '09:00', icon: '🌉', title: 'The Bund', desc: 'Iconic skyline & photo spots', color: 'from-[#1a73e8] to-[#174ea6]' },
              { time: '10:30', icon: '🏛️', title: 'Yu Garden', desc: 'Classical Chinese garden · ¥40', color: 'from-[#fbbc04] to-[#ea8600]' },
              { time: '12:00', icon: '🥟', title: 'Nanxiang Steamed Bun', desc: 'Famous xiaolongbao · ¥60/pp', color: 'from-[#ff5a5f] to-[#e62e2e]' },
              { time: '14:00', icon: '🚴', title: 'Riverside Cycling', desc: '8km scenic route along Huangpu', color: 'from-[#34a853] to-[#2d8e47]' },
              { time: '18:00', icon: '🌃', title: 'Bund Night View', desc: 'Spectacular light show · Free', color: 'from-[#a855f7] to-[#9333ea]' }
            ].map((item, i) => (
              <div key={i} className="group flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-md transition-all duration-200 border border-gray-200">
                <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-xl shadow-md flex-shrink-0 group-hover:shadow-lg transition-all`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-[#1a73e8]">{item.time}</span>
                    <span className="font-semibold text-[#484848]">{item.title}</span>
                  </div>
                  <div className="text-sm text-[#767676] truncate">{item.desc}</div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white rounded-xl">
                  →
                </button>
              </div>
            ))}
          </div>
          
          <button className="mt-6 w-full py-4 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200">
            View Full Itinerary →
          </button>
        </div>

        {/* CTA Section - Booking.com Style */}
        <div className="bg-gradient-to-br from-[#1a73e8] to-[#174ea6] rounded-3xl shadow-xl p-6 text-white">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Ready to Explore China?</h3>
            <p className="text-white/90">Let AI plan your perfect trip with local insights</p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button className="flex-1 py-3 bg-white text-[#1a73e8] rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                Start Planning
              </button>
              <button className="flex-1 py-3 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-semibold border border-white/30 hover:bg-white/30 transition-all duration-200">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Chat Input - Modern Style */}
        <div className="sticky bottom-4">
          <div className="bg-white rounded-3xl shadow-2xl p-4 border border-gray-100">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Tell me what you need, e.g., 'Plan a 4-day Shanghai trip'..."
                className="flex-1 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent transition-all"
              />
              <button
                onClick={handleSendMessage}
                className="px-6 py-3 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
