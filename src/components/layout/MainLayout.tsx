'use client';

import React from 'react';
import BottomNav from '@/components/BottomNav';

type Tab = 'chat' | 'trips' | 'food' | 'transport' | 'profile';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function MainLayout({ children, activeTab, onTabChange }: MainLayoutProps) {
  return (
    <main className="min-h-screen bg-gray-50 safe-area-top">
      {/* 顶部状态栏占位 */}
      <div className="h-safe-area-top bg-white" />
      
      {/* 主内容区域 */}
      {children}
      
      {/* 底部导航 */}
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </main>
  );
}
