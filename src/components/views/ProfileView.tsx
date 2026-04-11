'use client';

import React from 'react';
import Header from '@/components/layout/Header';

interface ProfileViewProps {
  user?: { name: string; email: string; avatar?: string };
}

export default function ProfileView({ user = { name: 'John Doe', email: 'john@example.com' } }: ProfileViewProps) {
  const menuItems = ['我的行程', '我的收藏', '支付设置', '语言设置', '帮助中心'];

  return (
    <div className="p-4 pb-24">
      <Header title="我的" />
      <div className="bg-white rounded-2xl p-4 mb-4 border border-gray-200 mt-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <div className="font-bold text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-600">{user.email}</div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item}
            className="w-full p-4 bg-white rounded-xl border border-gray-200 text-left font-medium hover:bg-gray-50 transition-colors"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
