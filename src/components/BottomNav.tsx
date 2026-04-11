import React from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

type Tab = 'chat' | 'trips' | 'food' | 'transport' | 'profile';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tabId: Tab) => void;
}

/**
 * 底部固定导航栏
 * 移动优先设计，5 个核心 Tab
 */
export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const navItems: { id: Tab; label: string; icon: string }[] = [
    { id: 'chat', label: '聊天', icon: '💬' },
    { id: 'trips', label: '行程', icon: '📅' },
    { id: 'food', label: '美食', icon: '🍜' },
    { id: 'transport', label: '交通', icon: '🚇' },
    { id: 'profile', label: '我的', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
      <div className="flex items-center justify-around py-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center w-full py-2 px-1 transition-colors ${
                isActive
                  ? 'text-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 bg-emerald-600 rounded-full mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
