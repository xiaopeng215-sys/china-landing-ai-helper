'use client';

import React from 'react';
import { useClientI18n } from '@/lib/i18n/client';

interface ExploreViewProps {
  onNavigate: (tab: 'food-encyclopedia' | 'food' | 'hotels' | 'transport') => void;
}

export default function ExploreView({ onNavigate }: ExploreViewProps) {
  const { t } = useClientI18n();

  const EXPLORE_CARDS = [
    {
      id: 'food' as const,
      icon: '🍽️',
      title: t('ExploreView.cardFoodTitle'),
      subtitle: t('ExploreView.cardFoodSubtitle'),
      description: t('ExploreView.cardFoodDesc'),
      gradient: 'from-red-400 to-teal-400',
      bg: 'bg-red-50',
      border: 'border-red-100',
      tag: t('ExploreView.cardFoodTag'),
    },
    {
      id: 'food-encyclopedia' as const,
      icon: '🍜',
      title: t('ExploreView.cardEncyclopediaTitle'),
      subtitle: t('ExploreView.cardEncyclopediaSubtitle'),
      description: t('ExploreView.cardEncyclopediaDesc'),
      gradient: 'from-teal-400 to-red-400',
      bg: 'bg-teal-50',
      border: 'border-teal-100',
      tag: t('ExploreView.cardEncyclopediaTag'),
    },
    {
      id: 'hotels' as const,
      icon: '🏨',
      title: t('ExploreView.cardHotelsTitle'),
      subtitle: t('ExploreView.cardHotelsSubtitle'),
      description: t('ExploreView.cardHotelsDesc'),
      gradient: 'from-amber-400 to-teal-400',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      tag: t('ExploreView.cardHotelsTag'),
    },
    {
      id: 'transport' as const,
      icon: '🚇',
      title: t('ExploreView.cardTransportTitle'),
      subtitle: t('ExploreView.cardTransportSubtitle'),
      description: t('ExploreView.cardTransportDesc'),
      gradient: 'from-teal-500 to-teal-400',
      bg: 'bg-teal-50',
      border: 'border-teal-100',
      tag: t('ExploreView.cardTransportTag'),
    },
  ];

  const FAQ_ITEMS = [
    { q: t('ExploreView.faq1Q'), a: t('ExploreView.faq1A'), icon: '💳' },
    { q: t('ExploreView.faq2Q'), a: t('ExploreView.faq2A'), icon: '🔐' },
    { q: t('ExploreView.faq3Q'), a: t('ExploreView.faq3A'), icon: '✅' },
    { q: t('ExploreView.faq4Q'), a: t('ExploreView.faq4A'), icon: '🆘' },
    { q: t('ExploreView.faq5Q'), a: t('ExploreView.faq5A'), icon: '📦' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-4 pt-6 pb-8">
        <h1 className="text-2xl font-bold">{t('ExploreView.title')}</h1>
        <p className="text-teal-100 text-sm mt-1">{t('ExploreView.subtitle')}</p>
      </div>

      {/* SIM Card / Data Plan Section */}
      <div className="px-4 -mt-4 mb-2">
        <section className="mb-6 bg-white rounded-2xl p-4 shadow-sm border border-teal-100">
          <h2 className="text-lg font-bold text-gray-800 mb-1">{t('ExploreView.stayConnected')}</h2>
          <p className="text-sm text-gray-500 mb-3">{t('ExploreView.stayConnectedDesc')}</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'eSIM (Recommended)', duration: '7 days', price: '¥69', badge: '⚡ Instant', popular: true },
              { name: 'China Unicom SIM', duration: '30 days', price: '¥199', badge: '📦 Physical', popular: false },
              { name: 'HK SIM Card', duration: '7 days', price: '¥79', badge: '🇭🇰 HK Based', popular: false },
              { name: 'China Mobile', duration: '30 days', price: '¥179', badge: '📱 Local', popular: false },
            ].map((plan) => (
              <a
                key={plan.name}
                href="https://www.trip.com/t/gBO6LQDOIU2"
                target="_blank"
                rel="noopener noreferrer"
                className={`relative p-3 rounded-xl border-2 ${plan.popular ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-white'} block`}
              >
                {plan.popular && (
                  <span className="absolute -top-2 left-3 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">{t('ExploreView.mostPopular')}</span>
                )}
                <div className="text-xs text-gray-500 mb-1">{plan.badge}</div>
                <div className="font-semibold text-gray-800 text-sm">{plan.name}</div>
                <div className="text-xs text-gray-500">{plan.duration}</div>
                <div className="text-teal-600 font-bold mt-1">{plan.price}</div>
              </a>
            ))}
          </div>
          <a
            href="https://www.trip.com/t/gBO6LQDOIU2"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-3 rounded-xl font-semibold text-sm"
          >
            {t('ExploreView.browseAllPlans')}
          </a>
        </section>
      </div>

      {/* Cards */}
      <div className="px-4 space-y-4">
        {EXPLORE_CARDS.map((card) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className={`w-full text-left ${card.bg} border ${card.border} rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform`}
            type="button"
          >
            {/* Card gradient banner */}
            <div className={`bg-gradient-to-r ${card.gradient} px-5 py-4 flex items-center gap-4`}>
              <span className="text-4xl" aria-hidden="true">{card.icon}</span>
              <div className="flex-1">
                <h2 className="text-white text-xl font-bold">{card.title}</h2>
                <p className="text-white/80 text-sm">{card.subtitle}</p>
              </div>
              <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
                {card.tag}
              </span>
            </div>

            {/* Card body */}
            <div className="px-5 py-4 flex items-center justify-between">
              <p className="text-gray-600 text-sm leading-relaxed flex-1 pr-4">
                {card.description}
              </p>
              <svg
                className="w-5 h-5 text-teal-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Quick tip */}
      <div className="mx-4 mt-6 bg-white rounded-xl p-4 border border-teal-100 shadow-sm">
        <div className="flex gap-3 items-start">
          <span className="text-xl">💡</span>
          <div>
            <p className="text-sm font-semibold text-gray-800">{t('ExploreView.proTip')}</p>
            <p className="text-sm text-gray-500 mt-0.5">{t('ExploreView.proTipContent')}</p>
          </div>
        </div>
      </div>

      {/* China Travel FAQ - Fear Busters */}
      <section className="px-4 mt-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-1">{t('ExploreView.faqTitle')}</h2>
        <p className="text-sm text-gray-500 mb-3">{t('ExploreView.faqSubtitle')}</p>
        <div className="space-y-2">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <summary className="flex items-center gap-3 p-3 cursor-pointer list-none">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium text-gray-800 flex-1">{item.q}</span>
                <span className="text-gray-400 text-xs">▼</span>
              </summary>
              <div className="px-4 pb-3 pt-1">
                <p className="text-sm text-gray-600">{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
