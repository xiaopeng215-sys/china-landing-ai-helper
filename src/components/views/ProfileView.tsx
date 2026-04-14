'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useClientI18n } from '@/lib/i18n/client';

export default function ProfileView() {
  const { t } = useClientI18n();
  const router = useRouter();

  const settings = [
    { icon: '👤', labelKey: 'ProfileViewPage.account', valueKey: 'ProfileViewPage.notLoggedIn', showArrow: true, onClick: () => router.push('/auth/signin?callbackUrl=/profile') },
    { icon: '🌐', labelKey: 'ProfileViewPage.language', valueKey: 'ProfileViewPage.language', showArrow: true, onClick: () => alert('Language settings coming soon!') },
    { icon: '🔔', labelKey: 'ProfileViewPage.notifications', valueKey: 'ProfileViewPage.notificationsOn', showArrow: true, onClick: () => alert('Notification settings coming soon!') },
    { icon: '🎨', labelKey: 'ProfileViewPage.theme', valueKey: 'ProfileViewPage.themeLight', showArrow: true, onClick: () => alert('Theme settings coming soon!') },
  ];

  const support = [
    { icon: '❓', labelKey: 'ProfileViewPage.helpCenter', showArrow: true },
    { icon: '📧', labelKey: 'ProfileViewPage.contactUs', showArrow: true },
    { icon: '⭐', labelKey: 'ProfileViewPage.rateApp', showArrow: true },
    { icon: '📋', labelKey: 'ProfileViewPage.privacyPolicy', showArrow: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-[#484848]">{t('ProfileViewPage.title')}</h1>
          <p className="text-sm text-[#767676]">{t('ProfileViewPage.subtitle')}</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* User Card */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl shadow-xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl">
              👤
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{t('ProfileViewPage.guestUser')}</h2>
              <p className="text-white/80 text-sm">{t('ProfileViewPage.guestDesc')}</p>
            </div>
            <button
              onClick={() => router.push('/auth/signin?callbackUrl=/profile')}
              className="px-4 py-2 bg-white text-teal-600 rounded-xl font-semibold text-sm hover:bg-white/90 transition-all"
            >
              {t('ProfileViewPage.signIn')}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { labelKey: 'ProfileViewPage.trips', value: '0', icon: '📅' },
            { labelKey: 'ProfileViewPage.favorites', value: '0', icon: '❤️' },
            { labelKey: 'ProfileViewPage.reviews', value: '0', icon: '⭐' },
          ].map((stat) => (
            <div key={stat.labelKey} className="bg-white rounded-2xl shadow-md p-4 text-center border border-gray-100">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-[#484848]">{stat.value}</div>
              <div className="text-xs text-[#767676]">{t(stat.labelKey)}</div>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-[#484848]">{t('ProfileViewPage.settings')}</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {settings.map((item) => (
              <button
                key={item.labelKey}
                onClick={item.onClick}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 transition-all cursor-pointer"
              >
                <div className="text-2xl">{item.icon}</div>
                <div className="flex-1 text-left rtl:text-right">
                  <p className="font-medium text-[#484848]">{t(item.labelKey)}</p>
                  {item.valueKey && <p className="text-sm text-[#767676]">{t(item.valueKey)}</p>}
                </div>
                {item.showArrow && <div className="text-[#767676] rtl:rotate-180">→</div>}
              </button>
            ))}
          </div>
        </div>

        {/* Support */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-[#484848]">{t('ProfileViewPage.support')}</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {support.map((item) => (
              <button
                key={item.labelKey}
                onClick={() => {
                  if (item.labelKey === 'ProfileViewPage.privacyPolicy') router.push('/privacy');
                  else if (item.labelKey === 'ProfileViewPage.contactUs') window.open('mailto:support@travelerlocal.ai');
                  else if (item.labelKey === 'ProfileViewPage.helpCenter') window.open('https://travelerlocal.ai/help', '_blank', 'noopener,noreferrer');
                  else if (item.labelKey === 'ProfileViewPage.rateApp') window.open('https://apps.apple.com', '_blank', 'noopener,noreferrer');
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 transition-all cursor-pointer"
              >
                <div className="text-2xl">{item.icon}</div>
                <div className="flex-1 text-left rtl:text-right">
                  <p className="font-medium text-[#484848]">{t(item.labelKey)}</p>
                </div>
                {item.showArrow && <div className="text-[#767676] rtl:rotate-180">→</div>}
              </button>
            ))}
          </div>
        </div>

        {/* App Info */}
        <div className="text-center py-6">
          <div className="text-4xl mb-2">🇨🇳</div>
          <p className="font-bold text-[#484848]">{t('ProfileViewPage.appName')}</p>
          <p className="text-sm text-[#767676]">{t('ProfileViewPage.version')}</p>
          <p className="text-xs text-[#767676] mt-4">{t('ProfileViewPage.madeWith')}</p>
        </div>
      </main>
    </div>
  );
}
