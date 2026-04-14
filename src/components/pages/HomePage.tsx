'use client';

import React, { useState } from 'react';

export default function HomePage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '👋 欢迎来到中国！我是你的旅行助手，可以帮你规划行程、推荐美食、查询交通！' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    setMessages([...messages, { role: 'user', content: inputValue }]);
    setInputValue('');
    // Mock 回复
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '收到！让我为你规划上海 4 天行程...' 
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">🇨🇳 China Landing AI</h1>
              <p className="text-sm text-gray-600">你的中国旅行智能助手</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm bg-teal-100 text-teal-700 rounded-full hover:bg-teal-200">
                行程
              </button>
              <button className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-full hover:bg-green-200">
                美食
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
              🤖
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                👋 欢迎来到中国！
              </h2>
              <p className="text-gray-600 leading-relaxed">
                我是你的旅行助手，可以帮你：
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  { icon: '✈️', text: '规划个性化行程' },
                  { icon: '🍜', text: '推荐地道美食' },
                  { icon: '🚇', text: '交通指导 (地铁/共享单车/打车)' },
                  { icon: '🏨', text: '预订住宿' },
                  { icon: '💳', text: '支付/实名认证教程' }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🎯 快速开始
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '🗺️', title: '上海 4 天行程', desc: '经典地标 + 美食' },
              { icon: '🍜', title: '必吃美食', desc: '本地人推荐' },
              { icon: '🚇', title: '地铁指南', desc: '购票 + 线路图' },
              { icon: '🚴', title: '共享单车', desc: '租车教程' }
            ].map((card, i) => (
              <button 
                key={i}
                className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all text-left border border-gray-200"
              >
                <div className="text-2xl mb-2">{card.icon}</div>
                <div className="font-medium text-gray-900">{card.title}</div>
                <div className="text-sm text-gray-600">{card.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Sample Itinerary Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              📍 Day 1: 经典上海
            </h3>
            <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
              推荐
            </span>
          </div>
          <div className="space-y-4">
            {[
              { time: '09:00', icon: '🌉', title: '外滩', desc: '经典地标，拍照打卡' },
              { time: '10:30', icon: '🏛️', title: '豫园', desc: '古典园林，门票 ¥40' },
              { time: '12:00', icon: '🥟', title: '南翔馒头店', desc: '小笼包，人均 ¥60' },
              { time: '14:00', icon: '🚴', title: '滨江骑行', desc: '8km，风景优美' },
              { time: '18:00', icon: '🌃', title: '外滩夜景', desc: '灯光秀，免费' }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-teal-600 w-12 flex-shrink-0">
                  {item.time}
                </div>
                <div className="text-xl flex-shrink-0">{item.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{item.title}</div>
                  <div className="text-sm text-gray-600">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors">
            查看完整行程 →
          </button>
        </div>

        {/* Chat Input */}
        <div className="sticky bottom-4">
          <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="告诉我你的需求，比如'帮我规划上海 4 天行程'..."
                className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                className="px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors"
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
