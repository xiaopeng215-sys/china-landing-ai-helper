'use client';

import React, { useEffect, useState } from 'react';
import {
  PremiumHeader,
  WelcomeCard,
  ItineraryCard,
  RestaurantGrid,
  ChatInput,
} from './home/index';

/**
 * HomePage-Premium - 现代中国风视觉设计 (重构版)
 * 
 * 设计参考:
 * - Wanderlog: 大图卡片 + 时间线
 * - GuideGeek: 气泡聊天 + 富媒体
 * - Airbnb: 大图展示 + 收藏功能
 * - Apple Maps: 毛玻璃效果 + 平滑动画
 * 
 * 优化: 拆分为 5 个子组件，减少单文件行数，提升可维护性
 */

const CHINA_COLORS = {
  chinaRed: '#DC2626',
  chinaGold: '#D97706',
  bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  cardShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
  cardRadius: '24px',
};

export default function HomePagePremium() {
  const [isAnimating, setIsAnimating] = useState(false);

  // 卡片进入动画
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = (_message: string) => {
    // 消息处理由 ChatView 组件负责
  };

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

      {/* Header */}
      <PremiumHeader />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        
        {/* Welcome Card */}
        <WelcomeCard />

        {/* Itinerary Card */}
        <ItineraryCard />

        {/* Restaurant Grid */}
        <RestaurantGrid />

        {/* Chat Input */}
        <ChatInput onSendMessage={handleSendMessage} />
      </main>
    </div>
  );
}
