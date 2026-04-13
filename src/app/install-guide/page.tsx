'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useClientI18n } from '@/lib/i18n/client';

export default function InstallGuidePage() {
  const router = useRouter();
  const { t } = useClientI18n();

  const steps = [
    {
      icon: '📱',
      title: 'iOS Safari',
      steps: [
        t('InstallGuide.ios.step1', 'Tap the Share button in the bottom toolbar'),
        t('InstallGuide.ios.step2', 'Scroll down and tap "Add to Home Screen"'),
        t('InstallGuide.ios.step3', 'Tap "Add" in the top right corner'),
      ],
    },
    {
      icon: '🤖',
      title: 'Android Chrome',
      steps: [
        t('InstallGuide.android.step1', 'Tap the three-dot menu in the top right'),
        t('InstallGuide.android.step2', 'Tap "Add to Home Screen"'),
        t('InstallGuide.android.step3', 'Tap "Add" to confirm'),
      ],
    },
    {
      icon: '💻',
      title: t('InstallGuide.desktop.title', 'Desktop Browser'),
      steps: [
        t('InstallGuide.desktop.step1', 'Look for the install icon in the address bar'),
        t('InstallGuide.desktop.step2', 'Click the "Install" button'),
        t('InstallGuide.desktop.step3', 'Confirm in the dialog that appears'),
      ],
    },
  ];

  const benefits = [
    { icon: '⚡', title: t('InstallGuide.benefits.fast.title', 'Fast Launch'), desc: t('InstallGuide.benefits.fast.desc', 'Launch directly from your home screen, no browser needed') },
    { icon: '📶', title: t('InstallGuide.benefits.offline.title', 'Offline Access'), desc: t('InstallGuide.benefits.offline.desc', 'Some features work without an internet connection') },
    { icon: '🔔', title: t('InstallGuide.benefits.notifications.title', 'Notifications'), desc: t('InstallGuide.benefits.notifications.desc', 'Receive important reminders and updates') },
    { icon: '💾', title: t('InstallGuide.benefits.storage.title', 'Saves Space'), desc: t('InstallGuide.benefits.storage.desc', 'Smaller than a native app, uses minimal storage') },
  ];

  const faqs = [
    {
      q: t('InstallGuide.faq.free.q', 'Is it free to install?'),
      a: t('InstallGuide.faq.free.a', 'Completely free! This is a Progressive Web App (PWA) — no cost at all.'),
    },
    {
      q: t('InstallGuide.faq.storage.q', 'Does it use a lot of storage?'),
      a: t('InstallGuide.faq.storage.a', 'No, PWAs are very lightweight — typically just a few MB.'),
    },
    {
      q: t('InstallGuide.faq.uninstall.q', 'How do I uninstall?'),
      a: t('InstallGuide.faq.uninstall.a', 'Just like a regular app — long press the icon and select Remove.'),
    },
    {
      q: t('InstallGuide.faq.updates.q', 'Does it update automatically?'),
      a: t('InstallGuide.faq.updates.a', 'Yes, PWAs update automatically to the latest version — no manual action needed.'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white py-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-10 w-20 h-20 bg-white rounded-full animate-float"></div>
          <div className="absolute bottom-8 left-20 w-24 h-24 bg-white rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2 text-white/80 hover:text-white transition-colors tap-feedback"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>{t('Common.back', 'Back')}</span>
          </button>
          <h1 className="text-3xl font-bold mb-2 animate-slide-up">📲 {t('InstallGuide.title', 'Install App')}</h1>
          <p className="text-white/80 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {t('InstallGuide.subtitle', 'Add China AI Helper to your device')}
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        {/* Benefits */}
        <section className="animate-slide-up">
          <h2 className="text-xl font-bold text-[#484848] mb-4">✨ {t('InstallGuide.whyInstall', 'Why install?')}</h2>
          <div className="grid grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 hover-lift stagger-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl mb-2 animate-float">{benefit.icon}</div>
                <h3 className="font-bold text-[#484848] mb-1">{benefit.title}</h3>
                <p className="text-sm text-[#767676]">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Installation Steps */}
        <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-bold text-[#484848] mb-4">📖 {t('InstallGuide.howToInstall', 'How to install')}</h2>
          <div className="space-y-4">
            {steps.map((platform, index) => (
              <div
                key={platform.title}
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover-lift stagger-item"
                style={{ animationDelay: `${0.3 + index * 0.15}s` }}
              >
                <div className="bg-gradient-to-r from-[#ff5a5f]/10 to-[#ff3b3f]/10 p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl animate-wiggle">{platform.icon}</span>
                    <h3 className="font-bold text-[#484848]">{platform.title}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <ol className="space-y-3">
                    {platform.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${stepIndex * 0.1}s` }}>
                        <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-[#ff5a5f] to-[#ff3b3f] text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                          {stepIndex + 1}
                        </span>
                        <span className="text-[#767676] pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-xl font-bold text-[#484848] mb-4">❓ {t('InstallGuide.faqTitle', 'FAQ')}</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 hover-lift stagger-item"
                style={{ animationDelay: `${0.7 + index * 0.1}s` }}
              >
                <p className="font-bold text-[#484848] mb-2">❓ {faq.q}</p>
                <p className="text-sm text-[#767676]">💡 {faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-[#ff5a5f] to-[#ff3b3f] rounded-3xl shadow-xl p-6 text-white text-center animate-bounce-in" style={{ animationDelay: '1s' }}>
          <div className="text-5xl mb-4 animate-float">🚀</div>
          <h2 className="text-2xl font-bold mb-2">{t('InstallGuide.readyToInstall', 'Ready to install?')}</h2>
          <p className="text-white/80 mb-6">{t('InstallGuide.readyDesc', 'Just a few seconds for a better experience')}</p>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 bg-white text-[#ff5a5f] rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover-lift tap-feedback"
          >
            🏠 {t('Actions.goBack', 'Back to Home')}
          </button>
        </div>
      </main>
    </div>
  );
}
