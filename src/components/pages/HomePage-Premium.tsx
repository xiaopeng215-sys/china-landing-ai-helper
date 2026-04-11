'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import DayCard from '@/components/DayCard';
import RestaurantCard from '@/components/RestaurantCard';

/**
 * HomePage-Premium - 现代中国风视觉设计
 * 
 * 设计参考:
 * - Wanderlog: 大图卡片 + 时间线
 * - GuideGeek: 气泡聊天 + 富媒体
 * - Airbnb: 大图展示 + 收藏功能
 * - Apple Maps: 毛玻璃效果 + 平滑动画
 */

// Modern China 配色方案
const CHINA_COLORS = {
  chinaRed: '#DC2626',
  chinaGold: '#D97706',
  bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  cardShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
  cardRadius: '24px',
};

interface Activity {
  time: string;
  title: string;
  description?: string;
  cost?: string;
  icon?: string;
}

interface Message {
  role: 'assistant' | 'user';
  content: string;
  image?: string;
  timestamp?: Date;
}

export default function HomePagePremium() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: '👋 欢迎来到中国！我是你的旅行助手，可以帮你规划行程、推荐美食、查询交通！',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  // 卡片进入动画
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // 模拟助手回复
    setTimeout(() => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: '收到！正在为你规划最佳行程... 🗺️',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // 示例数据
  const dayActivities: Activity[] = [
    { time: '09:00', icon: '🌉', title: '外滩', description: '经典地标，拍照打卡', cost: '免费' },
    { time: '10:30', icon: '🏛️', title: '豫园', description: '古典园林，明代建筑', cost: '¥40' },
    { time: '12:00', icon: '🥟', title: '南翔馒头店', description: '百年老字号小笼包', cost: '人均 ¥60' },
    { time: '14:00', icon: '🚴', title: '滨江骑行', description: '8km 滨江大道，风景优美', cost: '¥15/小时' },
    { time: '18:00', icon: '🌃', title: '外滩夜景', description: '灯光秀，魔都精华', cost: '免费' },
  ];

  const restaurants = [
    {
      id: 1,
      name: '南翔馒头店',
      rating: 4.8,
      reviewCount: 12580,
      pricePerPerson: '¥60',
      cuisine: '本帮菜',
      location: '黄浦区豫园路 85 号',
      distance: '300m',
      imageUrl: '/images/food/xiaolongbao.jpg',
    },
    {
      id: 2,
      name: '老正兴菜馆',
      rating: 4.7,
      reviewCount: 8920,
      pricePerPerson: '¥120',
      cuisine: '本帮菜',
      location: '黄浦区福州路 556 号',
      distance: '1.2km',
      imageUrl: '/images/food/benbang.jpg',
    },
    {
      id: 3,
      name: '佳家汤包',
      rating: 4.6,
      reviewCount: 6540,
      pricePerPerson: '¥45',
      cuisine: '小吃',
      location: '黄浦区黄河路 90 号',
      distance: '800m',
      imageUrl: '/images/food/tangbao.jpg',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* 自定义样式 */}
      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.5;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .hover-lift {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), 
                      box-shadow 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 60px -15px rgba(0,0,0,0.15);
        }
        
        .btn-ripple {
          position: relative;
          overflow: hidden;
        }
        
        .btn-ripple::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100px;
          height: 100px;
          background: rgba(255,255,255,0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          opacity: 0;
        }
        
        .btn-ripple:active::after {
          animation: ripple 0.6s ease-out;
        }
        
        .glass-effect {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        
        .china-gradient {
          background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%);
        }
        
        .gold-accent {
          color: #D97706;
        }
      `}</style>

      {/* Premium Header with Glassmorphism - Apple Maps 风格 */}
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
              <button className="px-4 py-2 text-xs font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-md hover:shadow-lg hover-lift btn-ripple transition-all">
                📅 行程
              </button>
              <button className="px-4 py-2 text-xs font-medium bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-md hover:shadow-lg hover-lift btn-ripple transition-all">
                🍜 美食
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        
        {/* 🏔️ Hero Welcome Card - Wanderlog 风格 */}
        <div 
          className={`relative overflow-hidden rounded-3xl shadow-2xl hover-lift ${isAnimating ? 'animate-slideUp' : ''}`}
          style={{ 
            borderRadius: CHINA_COLORS.cardRadius,
            boxShadow: CHINA_COLORS.cardShadow,
          }}
        >
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
                <h2 className="text-3xl font-bold mb-3 drop-shadow-lg">🇨🇳 欢迎来到中国！</h2>
                <p className="text-white/95 text-lg mb-6 leading-relaxed drop-shadow">
                  我是你的 AI 旅行助手，帮你规划完美行程、发现地道美食、轻松出行
                </p>
                
                {/* 功能网格 */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: '✈️', text: '智能行程规划', sub: 'AI 定制路线' },
                    { icon: '🍜', text: '地道美食推荐', sub: '本地人最爱' },
                    { icon: '🚇', text: '交通出行指导', sub: '地铁 + 公交' },
                    { icon: '💳', text: '支付实名认证', sub: 'Alipay + WeChat' }
                  ].map((item, i) => (
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
                    🚀 开始规划行程
                  </button>
                  <button className="px-6 py-4 bg-white/20 glass-effect text-white rounded-2xl font-semibold border border-white/30 hover:bg-white/30 hover-lift btn-ripple transition-all">
                    ▶️ 观看教程
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 📅 行程卡片 - Day Card (Wanderlog 时间线风格) */}
        <div className={`bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover-lift ${isAnimating ? 'animate-slideUp' : ''}`} style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-md">
                📍
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Day 1 · 经典上海</h3>
                <p className="text-sm text-gray-600">全天 · 骑行探索 · 美食之旅</p>
              </div>
            </div>
            <span className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-full shadow-md flex items-center gap-1">
              ⭐ 4.9
            </span>
          </div>
          
          {/* 时间线展示 */}
          <div className="space-y-4">
            {dayActivities.map((activity, index) => (
              <div 
                key={index} 
                className="group flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-red-200 hover-lift"
                style={{ borderRadius: '16px' }}
              >
                {/* 时间线节点 */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-lg shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all`}>
                    {activity.icon}
                  </div>
                  {index < dayActivities.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gradient-to-b from-red-300 to-transparent my-2"></div>
                  )}
                </div>
                
                {/* 活动内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                      {activity.time}
                    </span>
                    <span className="font-semibold text-gray-900 text-base">{activity.title}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{activity.description}</div>
                  <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                    💰 {activity.cost}
                  </span>
                </div>
                
                {/* 操作按钮 */}
                <button className="opacity-0 group-hover:opacity-100 transition-all p-3 hover:bg-white rounded-xl hover:shadow-md btn-ripple">
                  <span className="text-red-500 text-lg">→</span>
                </button>
              </div>
            ))}
          </div>
          
          <button className="mt-6 w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] btn-ripple transition-all duration-300 flex items-center justify-center gap-2">
            📋 查看完整行程
            <span>→</span>
          </button>
        </div>

        {/* 🍜 美食卡片 - Restaurant Card (Airbnb 风格) */}
        <div className={`bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover-lift ${isAnimating ? 'animate-slideUp' : ''}`} style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-2xl shadow-md">
                🍜
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">必吃美食推荐</h3>
                <p className="text-sm text-gray-600">本地人最爱的地道餐厅</p>
              </div>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors btn-ripple">
              查看全部 →
            </button>
          </div>
          
          {/* 餐厅列表 */}
          <div className="space-y-4">
            {restaurants.map((restaurant) => (
              <div 
                key={restaurant.id}
                className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover-lift"
                style={{ borderRadius: CHINA_COLORS.cardRadius }}
              >
                <div className="flex">
                  {/* 美食大图 - 占 60% 面积 */}
                  <div className="relative w-[60%] h-40 flex-shrink-0 bg-gradient-to-br from-orange-100 to-yellow-100 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-6xl">
                      🍜
                    </div>
                    {/* 评分徽章 */}
                    <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/95 glass-effect rounded-full shadow-lg flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-bold text-gray-900">{restaurant.rating}</span>
                    </div>
                    {/* 收藏心形按钮 */}
                    <button 
                      onClick={() => toggleFavorite(restaurant.id)}
                      className="absolute top-3 right-3 w-10 h-10 bg-white/95 glass-effect rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform btn-ripple"
                    >
                      <span className="text-xl">
                        {favorites.has(restaurant.id) ? '❤️' : '🤍'}
                      </span>
                    </button>
                  </div>
                  
                  {/* 内容区域 */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
                        {restaurant.name}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <span>{restaurant.cuisine}</span>
                        <span>•</span>
                        <span className="text-green-600 font-medium">{restaurant.pricePerPerson}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span>📍</span>
                        <span className="truncate">{restaurant.location}</span>
                      </div>
                      {restaurant.distance && (
                        <div className="text-xs text-gray-500 mt-1">
                          🚇 距离 {restaurant.distance}
                        </div>
                      )}
                    </div>
                    
                    {/* 快速操作按钮 */}
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover-lift btn-ripple transition-all">
                        导航
                      </button>
                      <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 hover-lift btn-ripple transition-all">
                        菜单
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 💬 Chat Input - GuideGeek 气泡聊天风格 */}
        <div className="sticky bottom-4">
          <div 
            className="bg-white rounded-3xl shadow-2xl p-4 border border-gray-100 glass-effect"
            style={{ borderRadius: CHINA_COLORS.cardRadius, boxShadow: CHINA_COLORS.cardShadow }}
          >
            {/* 消息历史 - 气泡样式 */}
            {messages.length > 1 && (
              <div className="mb-4 space-y-3 max-h-48 overflow-y-auto">
                {messages.slice(-3).map((msg, i) => (
                  <div 
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white rounded-br-md' 
                          : 'bg-gray-100 text-gray-900 rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* 输入区域 */}
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="告诉我你的需求，比如'帮我规划上海 4 天行程'..."
                className="flex-1 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                style={{ borderRadius: '20px' }}
              />
              <button
                onClick={handleSendMessage}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 btn-ripple transition-all duration-200"
                style={{ borderRadius: '20px' }}
              >
                发送 🚀
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
