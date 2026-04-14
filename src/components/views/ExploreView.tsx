'use client';

import React from 'react';

interface ExploreViewProps {
  onNavigate: (tab: 'food-encyclopedia' | 'food' | 'hotels' | 'transport') => void;
}

const EXPLORE_CARDS = [
  {
    id: 'food' as const,
    icon: '🍽️',
    title: 'Restaurant Guide',
    subtitle: 'Best restaurants by city',
    description: 'Curated restaurants in Beijing, Shanghai, Chengdu, Xi\'an, Guangzhou & Shenzhen',
    gradient: 'from-red-400 to-orange-400',
    bg: 'bg-red-50',
    border: 'border-red-100',
    tag: '6 cities',
  },
  {
    id: 'food-encyclopedia' as const,
    icon: '🍜',
    title: 'Food Encyclopedia',
    subtitle: 'Discover authentic Chinese cuisine',
    description: 'Regional dishes, must-try foods, ordering tips & dietary guides',
    gradient: 'from-orange-400 to-red-400',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    tag: '200+ dishes',
  },
  {
    id: 'hotels' as const,
    icon: '🏨',
    title: 'Hotels',
    subtitle: 'Find the perfect stay',
    description: 'Curated hotels across China — budget to luxury, with booking tips',
    gradient: 'from-amber-400 to-orange-400',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    tag: 'All budgets',
  },
  {
    id: 'transport' as const,
    icon: '🚇',
    title: 'Transport',
    subtitle: 'Get around with ease',
    description: 'Metro, high-speed rail, Didi, buses — everything you need to move',
    gradient: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    tag: 'Step-by-step',
  },
];

export default function ExploreView({ onNavigate }: ExploreViewProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 pt-6 pb-8">
        <h1 className="text-2xl font-bold">🔍 Explore</h1>
        <p className="text-orange-100 text-sm mt-1">Food, hotels & getting around China</p>
      </div>

      {/* SIM Card / Data Plan Section */}
      <div className="px-4 -mt-4 mb-2">
        <section className="mb-6 bg-white rounded-2xl p-4 shadow-sm border border-orange-100">
          <h2 className="text-lg font-bold text-gray-800 mb-1">📶 Stay Connected</h2>
          <p className="text-sm text-gray-500 mb-3">Get a local SIM or data plan before you explore</p>
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
                  <span className="absolute -top-2 left-3 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">Most Popular</span>
                )}
                <div className="text-xs text-gray-500 mb-1">{plan.badge}</div>
                <div className="font-semibold text-gray-800 text-sm">{plan.name}</div>
                <div className="text-xs text-gray-500">{plan.duration}</div>
                <div className="text-orange-600 font-bold mt-1">{plan.price}</div>
              </a>
            ))}
          </div>
          <a
            href="https://www.trip.com/t/gBO6LQDOIU2"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-xl font-semibold text-sm"
          >
            Browse All Plans on Trip.com →
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
                className="w-5 h-5 text-orange-400 flex-shrink-0"
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
      <div className="mx-4 mt-6 bg-white rounded-xl p-4 border border-orange-100 shadow-sm">
        <div className="flex gap-3 items-start">
          <span className="text-xl">💡</span>
          <div>
            <p className="text-sm font-semibold text-gray-800">Pro tip</p>
            <p className="text-sm text-gray-500 mt-0.5">
              Download offline maps before your trip — Apple Maps works in China without a VPN.
            </p>
          </div>
        </div>
      </div>

      {/* China Travel FAQ - Fear Busters */}
      <section className="px-4 mt-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-1">🛡️ Common Concerns, Solved</h2>
        <p className="text-sm text-gray-500 mb-3">Everything foreigners worry about — answered</p>
        <div className="space-y-2">
          {[
            { q: "Can I pay without a Chinese bank account?", a: "Yes! Since 2023, Alipay & WeChat Pay accept international Visa/Mastercard. Setup takes 5 minutes.", icon: "💳" },
            { q: "Do I need a VPN?", a: "Yes, for Google/WhatsApp/Instagram. Download ExpressVPN or NordVPN BEFORE arriving in China.", icon: "🔐" },
            { q: "Is it safe to travel alone in China?", a: "China is one of the safest countries for solo travel. Low crime, excellent public transport, and locals are helpful.", icon: "✅" },
            { q: "What if I get sick or have an emergency?", a: "Dial 120 (ambulance) or 110 (police). Our SOS page has embassy contacts for 20+ countries.", icon: "🆘" },
            { q: "How do I get a SIM card at the airport?", a: "China Unicom/Mobile booths are in arrivals. Bring passport. Or buy an eSIM before departure — instant activation.", icon: "📦" },
          ].map((item) => (
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
