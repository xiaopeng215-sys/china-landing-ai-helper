'use client';

import React from 'react';

interface SettingItem {
  icon: string;
  label: string;
  value?: string;
  showArrow?: boolean;
}

export default function ProfileView() {
  const settings: SettingItem[] = [
    { icon: '👤', label: 'Account', value: 'Not logged in', showArrow: true },
    { icon: '🌐', label: 'Language', value: 'English', showArrow: true },
    { icon: '🔔', label: 'Notifications', value: 'On', showArrow: true },
    { icon: '🎨', label: 'Theme', value: 'Light', showArrow: true },
  ];

  const support: SettingItem[] = [
    { icon: '❓', label: 'Help Center', showArrow: true },
    { icon: '📧', label: 'Contact Us', showArrow: true },
    { icon: '⭐', label: 'Rate App', showArrow: true },
    { icon: '📋', label: 'Privacy Policy', showArrow: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-[#484848]">Profile</h1>
          <p className="text-sm text-[#767676]">Manage your settings</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* User Card */}
        <div className="bg-gradient-to-br from-[#ff5a5f] to-[#ff3b3f] rounded-3xl shadow-xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl">
              👤
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">Guest User</h2>
              <p className="text-white/80 text-sm">Sign in to sync your trips</p>
            </div>
            <button className="px-4 py-2 bg-white text-[#ff5a5f] rounded-xl font-semibold text-sm hover:bg-white/90 transition-all">
              Sign In
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Trips', value: '0', icon: '📅' },
            { label: 'Favorites', value: '0', icon: '❤️' },
            { label: 'Reviews', value: '0', icon: '⭐' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl shadow-md p-4 text-center border border-gray-100">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-[#484848]">{stat.value}</div>
              <div className="text-xs text-[#767676]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-[#484848]">Settings</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {settings.map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-all"
              >
                <div className="text-2xl">{item.icon}</div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-[#484848]">{item.label}</p>
                  {item.value && <p className="text-sm text-[#767676]">{item.value}</p>}
                </div>
                {item.showArrow && <div className="text-[#767676]">→</div>}
              </button>
            ))}
          </div>
        </div>

        {/* Support */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-[#484848]">Support</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {support.map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-all"
              >
                <div className="text-2xl">{item.icon}</div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-[#484848]">{item.label}</p>
                </div>
                {item.showArrow && <div className="text-[#767676]">→</div>}
              </button>
            ))}
          </div>
        </div>

        {/* App Info */}
        <div className="text-center py-6">
          <div className="text-4xl mb-2">🇨🇳</div>
          <p className="font-bold text-[#484848]">China Landing AI Helper</p>
          <p className="text-sm text-[#767676]">Version 1.0.0-beta</p>
          <p className="text-xs text-[#767676] mt-4">
            Made with ❤️ for travelers
          </p>
        </div>
      </main>
    </div>
  );
}
