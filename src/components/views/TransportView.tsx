'use client';

import React, { useState } from 'react';
import { useClientI18n } from '@/lib/i18n/client';

type City = 'shanghai' | 'beijing' | 'chengdu' | 'xian' | 'guangzhou';

interface AirportInfo {
  name: string;
  code: string;
  options: { mode: string; icon: string; duration: string; price: string; tip: string }[];
}

interface MetroInfo {
  lines: string;
  hours: string;
  price: string;
  app: string;
  tips: string[];
}

interface CityTransportData {
  airport: AirportInfo;
  metro: MetroInfo;
}

const CITY_DATA: Record<City, CityTransportData> = {
  shanghai: {
    airport: {
      name: 'Pudong International Airport',
      code: 'PVG',
      options: [
        { mode: 'Maglev + Metro', icon: '🚄', duration: '~50 min', price: '¥55', tip: 'Fastest option — maglev to Longyang Rd, then metro' },
        { mode: 'Metro Line 2', icon: '🚇', duration: '~70 min', price: '¥8', tip: 'Cheapest — direct to People\'s Square' },
        { mode: 'DiDi / Taxi', icon: '🚕', duration: '~60 min', price: '¥150-200', tip: 'Convenient with luggage, use DiDi app' },
        { mode: 'Airport Bus', icon: '🚌', duration: '~90 min', price: '¥22-30', tip: 'Multiple routes to different city areas' },
      ],
    },
    metro: {
      lines: '20 lines covering the whole city',
      hours: '5:30am – 11:00pm',
      price: '¥3–8 per trip',
      app: 'Metro Man / Alipay',
      tips: [
        'Use Alipay or WeChat to scan QR at turnstile',
        'Line 2 connects both airports',
        'Avoid 8–9am and 5–7pm rush hours',
        'Most signs and announcements in English',
      ],
    },
  },
  beijing: {
    airport: {
      name: 'Beijing Capital International Airport',
      code: 'PEK',
      options: [
        { mode: 'Airport Express', icon: '🚄', duration: '~20 min', price: '¥25', tip: 'Fastest — runs every 10 min to Dongzhimen' },
        { mode: 'Metro Line 10', icon: '🚇', duration: '~60 min', price: '¥6', tip: 'Transfer at Sanyuanqiao to Line 10' },
        { mode: 'DiDi / Taxi', icon: '🚕', duration: '~45 min', price: '¥100-150', tip: 'Use DiDi — avoid unlicensed touts' },
        { mode: 'Airport Bus', icon: '🚌', duration: '~60 min', price: '¥24-30', tip: '7 routes to different city areas' },
      ],
    },
    metro: {
      lines: '27 lines, extensive network',
      hours: '5:00am – 11:30pm',
      price: '¥3–10 per trip',
      app: 'Beijing Subway / Alipay',
      tips: [
        'Security check required at every station',
        'Line 1 runs east-west through city center',
        'Avoid rush hours — very crowded',
        'English announcements on all lines',
      ],
    },
  },
  chengdu: {
    airport: {
      name: 'Chengdu Tianfu International Airport',
      code: 'TFU',
      options: [
        { mode: 'Metro Line 18', icon: '🚇', duration: '~40 min', price: '¥10', tip: 'Direct express metro to city center' },
        { mode: 'DiDi / Taxi', icon: '🚕', duration: '~50 min', price: '¥120-180', tip: 'Convenient, use DiDi for English interface' },
        { mode: 'Airport Bus', icon: '🚌', duration: '~60 min', price: '¥30', tip: 'Multiple routes to downtown' },
      ],
    },
    metro: {
      lines: '13 lines',
      hours: '6:00am – 11:00pm',
      price: '¥2–6 per trip',
      app: 'Chengdu Metro / Alipay',
      tips: [
        'Line 1 and 2 cover main tourist areas',
        'Very affordable compared to other cities',
        'Panda Base accessible via Line 3',
        'Scan Alipay QR for easy payment',
      ],
    },
  },
  xian: {
    airport: {
      name: "Xi'an Xianyang International Airport",
      code: 'XIY',
      options: [
        { mode: 'Metro Line 14', icon: '🚇', duration: '~40 min', price: '¥8', tip: 'New direct metro line to city center' },
        { mode: 'DiDi / Taxi', icon: '🚕', duration: '~45 min', price: '¥80-120', tip: 'Reliable option, use DiDi app' },
        { mode: 'Airport Bus', icon: '🚌', duration: '~60 min', price: '¥30', tip: 'Multiple routes, check destination carefully' },
      ],
    },
    metro: {
      lines: '8 lines',
      hours: '6:00am – 11:00pm',
      price: '¥2–5 per trip',
      app: 'Xi\'an Metro / Alipay',
      tips: [
        'Line 2 runs north-south through city center',
        'Muslim Quarter is a short walk from Bell Tower station',
        'Terracotta Warriors accessible via bus from North Square',
        'City Wall area well-served by metro',
      ],
    },
  },
  guangzhou: {
    airport: {
      name: 'Guangzhou Baiyun International Airport',
      code: 'CAN',
      options: [
        { mode: 'Metro Line 3', icon: '🚇', duration: '~45 min', price: '¥8', tip: 'Direct metro to city center' },
        { mode: 'DiDi / Taxi', icon: '🚕', duration: '~40 min', price: '¥100-150', tip: 'Use DiDi for English interface' },
        { mode: 'Airport Bus', icon: '🚌', duration: '~60 min', price: '¥25', tip: 'Multiple routes to different areas' },
      ],
    },
    metro: {
      lines: '18 lines',
      hours: '6:00am – 11:30pm',
      price: '¥2–8 per trip',
      app: 'Guangzhou Metro / Alipay',
      tips: [
        'One of China\'s most extensive metro networks',
        'Line 1 connects major tourist spots',
        'Cantonese and Mandarin announcements',
        'Alipay QR code payment widely accepted',
      ],
    },
  },
};

const DIDI_STEPS = [
  { step: '1', title: 'Download DiDi', desc: 'Available on App Store & Google Play. Select "International" version.', icon: '📱' },
  { step: '2', title: 'Register with Phone', desc: 'Use your international phone number. SMS verification required.', icon: '📞' },
  { step: '3', title: 'Add Payment', desc: 'Link international Visa/Mastercard or use Alipay/WeChat Pay.', icon: '💳' },
  { step: '4', title: 'Book a Ride', desc: 'Enter destination in English or Chinese. Driver will find you.', icon: '🚕' },
  { step: '5', title: 'Show Driver', desc: 'Show your phone screen — driver sees your destination in Chinese.', icon: '📍' },
];

const RAIL_TIPS = [
  { icon: '🎫', title: 'Buy Tickets', desc: 'Use Trip.com or 12306.cn (requires Chinese ID for some routes). Book early for holidays.' },
  { icon: '🪪', title: 'Passport Required', desc: 'Bring your passport to collect tickets at station kiosks. Foreign passport works fine.' },
  { icon: '⏰', title: 'Arrive Early', desc: 'Arrive 30–45 min before departure. Security check + ticket collection takes time.' },
  { icon: '🚄', title: 'G-Train vs D-Train', desc: 'G-trains are fastest (350km/h). D-trains are slightly slower but cheaper.' },
  { icon: '🍱', title: 'Food on Board', desc: 'Dining car available on most trains. Bring snacks for long journeys.' },
];

const CITIES: { id: City; label: string; flag: string }[] = [
  { id: 'shanghai', label: 'Shanghai', flag: '🏙️' },
  { id: 'beijing', label: 'Beijing', flag: '🏯' },
  { id: 'chengdu', label: 'Chengdu', flag: '🐼' },
  { id: 'xian', label: "Xi'an", flag: '🏺' },
  { id: 'guangzhou', label: 'Guangzhou', flag: '🌸' },
];

type Section = 'airport' | 'metro' | 'didi' | 'rail';

export default function TransportView() {
  const { t } = useClientI18n();
  const [selectedCity, setSelectedCity] = useState<City>('shanghai');
  const [activeSection, setActiveSection] = useState<Section>('airport');
  const [fromInput, setFromInput] = useState('');
  const [toInput, setToInput] = useState('');

  const cityData = CITY_DATA[selectedCity];

  const sections: { id: Section; label: string; icon: string }[] = [
    { id: 'airport', label: t('TransportPage.sectionAirport'), icon: '✈️' },
    { id: 'metro', label: t('TransportPage.sectionMetro'), icon: '🚇' },
    { id: 'didi', label: t('TransportPage.sectionDidi'), icon: '🚕' },
    { id: 'rail', label: t('TransportPage.sectionRail'), icon: '🚄' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-[#484848]">{t('TransportPage.title')}</h1>
          <p className="text-sm text-[#767676]">{t('TransportPage.subtitle')}</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Route Planner */}
        <div className="bg-white rounded-3xl shadow-xl p-5 border border-gray-100">
          <h3 className="text-base font-bold text-[#484848] mb-4">🗺️ {t('TransportPage.routePlanner')}</h3>
          <div className="space-y-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#767676] text-sm">🟢</span>
              <input
                type="text"
                value={fromInput}
                onChange={(e) => setFromInput(e.target.value)}
                placeholder={t('TransportPage.fromPlaceholder')}
                className="w-full pl-9 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] text-sm transition-all"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#767676] text-sm">🔴</span>
              <input
                type="text"
                value={toInput}
                onChange={(e) => setToInput(e.target.value)}
                placeholder={t('TransportPage.toPlaceholder')}
                className="w-full pl-9 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] text-sm transition-all"
              />
            </div>
            <button
              onClick={() => {
                if (fromInput || toInput) {
                  // Route planning via AI chat
                  window.location.href = `/?tab=chat&q=${encodeURIComponent(`How do I get from ${fromInput || 'my location'} to ${toInput || 'my destination'} in China?`)}`;
                }
              }}
              className="w-full py-3 bg-gradient-to-r from-[#1a73e8] to-[#174ea6] text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all"
            >
              {t('TransportPage.planRoute')} →
            </button>
          </div>
        </div>

        {/* City Selector */}
        <div>
          <p className="text-sm font-medium text-[#484848] mb-2">{t('TransportPage.selectCity')}</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CITIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCity(c.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCity === c.id
                    ? 'bg-[#1a73e8] text-white shadow-md'
                    : 'bg-white text-[#484848] border border-gray-200 hover:border-[#1a73e8]'
                }`}
              >
                {c.flag} {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section Tabs */}
        <div className="grid grid-cols-4 gap-2">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl text-xs font-medium transition-all ${
                activeSection === s.id
                  ? 'bg-[#1a73e8] text-white shadow-md'
                  : 'bg-white text-[#484848] border border-gray-200 hover:border-[#1a73e8]'
              }`}
            >
              <span className="text-xl">{s.icon}</span>
              <span className="text-center leading-tight">{s.label.replace(/^[^\s]+\s/, '')}</span>
            </button>
          ))}
        </div>

        {/* Airport Section */}
        {activeSection === 'airport' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <h3 className="font-bold text-[#484848] mb-1">{cityData.airport.name}</h3>
              <p className="text-xs text-[#767676] mb-4">IATA: {cityData.airport.code}</p>
              <div className="space-y-3">
                {cityData.airport.options.map((opt, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="text-2xl flex-shrink-0">{opt.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm text-[#484848]">{opt.mode}</p>
                        <div className="text-right">
                          <p className="text-xs font-bold text-[#34a853]">{opt.price}</p>
                          <p className="text-xs text-[#767676]">{opt.duration}</p>
                        </div>
                      </div>
                      <p className="text-xs text-[#767676] mt-1">{opt.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Metro Section */}
        {activeSection === 'metro' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-amber-50 rounded-xl p-3">
                  <p className="text-xs text-[#767676]">Network</p>
                  <p className="font-semibold text-sm text-[#484848]">{cityData.metro.lines}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3">
                  <p className="text-xs text-[#767676]">Hours</p>
                  <p className="font-semibold text-sm text-[#484848]">{cityData.metro.hours}</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-3">
                  <p className="text-xs text-[#767676]">Price</p>
                  <p className="font-semibold text-sm text-[#484848]">{cityData.metro.price}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-3">
                  <p className="text-xs text-[#767676]">App</p>
                  <p className="font-semibold text-sm text-[#484848]">{cityData.metro.app}</p>
                </div>
              </div>
              <h4 className="font-semibold text-sm text-[#484848] mb-3">{t('TransportPage.proTips')}</h4>
              <ul className="space-y-2">
                {cityData.metro.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#767676]">
                    <span className="text-[#34a853] mt-0.5 flex-shrink-0">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* DiDi Section */}
        {activeSection === 'didi' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <h3 className="font-bold text-[#484848] mb-4">How to Use DiDi in China</h3>
              <div className="space-y-4">
                {DIDI_STEPS.map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <div className="w-8 h-8 bg-[#ff5a5f] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {s.step}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#484848]">{s.icon} {s.title}</p>
                      <p className="text-xs text-[#767676] mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
              <p className="text-sm font-semibold text-yellow-800 mb-1">⚠️ Heads up</p>
              <p className="text-xs text-yellow-700">DiDi requires a Chinese phone number or international number with country code. Some features may need VPN outside China.</p>
            </div>
          </div>
        )}

        {/* High-Speed Rail Section */}
        {activeSection === 'rail' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <h3 className="font-bold text-[#484848] mb-4">High-Speed Rail Guide</h3>
              <div className="space-y-4">
                {RAIL_TIPS.map((tip, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="text-2xl flex-shrink-0">{tip.icon}</div>
                    <div>
                      <p className="font-semibold text-sm text-[#484848]">{tip.title}</p>
                      <p className="text-xs text-[#767676] mt-0.5">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
              <p className="text-sm font-semibold text-amber-800 mb-1">💡 Best booking apps</p>
              <p className="text-xs text-amber-700">Trip.com (English) or Ctrip — both support international passports and credit cards. Book 2–4 weeks ahead for popular routes.</p>
            </div>
          </div>
        )}

        {/* Essential Apps */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-base font-bold text-[#484848] mb-4">{t('TransportPage.essentialApps')}</h3>
          <div className="space-y-3">
            {[
              { name: 'DiDi', desc: 'Ride-hailing with English interface', icon: '🚕', badge: 'Must Have' },
              { name: 'Alipay', desc: 'Metro QR codes + payment', icon: '💳', badge: 'Must Have' },
              { name: 'Trip.com', desc: 'Train & flight booking in English', icon: '🚄', badge: 'Recommended' },
              { name: 'Maps.me', desc: 'Offline maps — works without internet', icon: '🗺️', badge: 'Useful' },
            ].map((app) => (
              <div key={app.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="text-2xl">{app.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-[#484848]">{app.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      app.badge === 'Must Have' ? 'bg-red-100 text-red-600' :
                      app.badge === 'Recommended' ? 'bg-amber-100 text-amber-600' :
                      'bg-gray-200 text-gray-600'
                    }`}>{app.badge}</span>
                  </div>
                  <p className="text-xs text-[#767676]">{app.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
