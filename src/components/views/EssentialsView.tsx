'use client';

import React, { useState } from 'react';
import { ESSENTIALS_DATA, ESSENTIALS_TABS, EMERGENCY_DATA, type EssentialsTab } from '@/data/essentials';
import { useClientI18n } from '@/lib/i18n/client';

// ─── Emergency Tab ────────────────────────────────────────────────────────────

function EmergencyView() {
  const [openGuide, setOpenGuide] = useState<number | null>(null);
  const [openCity, setOpenCity] = useState<string>('Beijing');

  return (
    <div className="space-y-4">
      {/* SOS Hero */}
      <div className="bg-red-600 rounded-2xl p-5 text-white shadow-lg">
        <div className="text-center mb-4">
          <div className="text-4xl mb-1">🆘</div>
          <h2 className="text-xl font-bold">Emergency SOS</h2>
          <p className="text-red-200 text-xs mt-0.5">Tap to call immediately</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Police', number: '110', icon: '🚔' },
            { label: 'Ambulance', number: '120', icon: '🚑' },
            { label: 'Fire', number: '119', icon: '🚒' },
          ].map((item) => (
            <a
              key={item.number}
              href={`tel:${item.number}`}
              className="flex flex-col items-center bg-red-700 hover:bg-red-800 active:bg-red-900 rounded-xl py-3 px-2 transition-colors"
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-lg font-bold leading-none">{item.number}</span>
              <span className="text-red-200 text-xs mt-0.5">{item.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* National Emergency Numbers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 bg-red-50 border-b border-red-100">
          <h3 className="text-sm font-semibold text-red-700">📞 National Emergency Numbers</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {EMERGENCY_DATA.nationalNumbers.map((item) => (
            <div key={item.number} className="flex items-center gap-3 px-4 py-3">
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-500 truncate">{item.description}</p>
              </div>
              <a
                href={`tel:${item.number}`}
                className="flex-shrink-0 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
              >
                {item.number}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Embassies & Consulates */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
          <h3 className="text-sm font-semibold text-blue-700">🏛️ Embassies & Consulates</h3>
        </div>
        {/* City tabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
          {EMERGENCY_DATA.embassies.map((cityGroup) => (
            <button
              key={cityGroup.city}
              type="button"
              onClick={() => setOpenCity(cityGroup.city)}
              className={`flex-shrink-0 px-4 py-2 text-xs font-medium transition-colors border-b-2 ${
                openCity === cityGroup.city
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {cityGroup.city}
            </button>
          ))}
        </div>
        {/* Embassy list for selected city */}
        {EMERGENCY_DATA.embassies
          .filter((g) => g.city === openCity)
          .map((cityGroup) => (
            <div key={cityGroup.city} className="divide-y divide-gray-100">
              {cityGroup.entries.map((entry) => (
                <div key={entry.phone} className="flex items-center gap-3 px-4 py-3">
                  <span className="text-xl flex-shrink-0">{entry.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{entry.name}</p>
                    <p className="text-xs text-gray-500">{entry.phone}</p>
                  </div>
                  <a
                    href={`tel:${entry.phone}`}
                    className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Call
                  </a>
                </div>
              ))}
            </div>
          ))}
      </div>

      {/* Emergency Guides */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 bg-amber-50 border-b border-amber-100">
          <h3 className="text-sm font-semibold text-amber-700">📋 Emergency Guides</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {EMERGENCY_DATA.guides.map((guide, i) => (
            <div key={i}>
              <button
                type="button"
                onClick={() => setOpenGuide(openGuide === i ? null : i)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-xl flex-shrink-0">{guide.icon}</span>
                <p className="flex-1 text-sm font-semibold text-gray-800">{guide.title}</p>
                <span className="text-gray-400 text-xs">{openGuide === i ? '▲' : '▼'}</span>
              </button>
              {openGuide === i && (
                <div className="px-4 pb-3 space-y-1.5">
                  {guide.steps.map((step, j) => (
                    <div key={j} className="flex gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center mt-0.5">
                        {j + 1}
                      </span>
                      <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Phrases */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 bg-green-50 border-b border-green-100">
          <h3 className="text-sm font-semibold text-green-700">🗣️ Emergency Chinese Phrases</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {EMERGENCY_DATA.phrases.map((phrase, i) => (
            <div key={i} className="px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-base font-bold text-gray-900">{phrase.chinese}</p>
                  <p className="text-xs text-gray-400 italic">{phrase.pinyin}</p>
                </div>
                <p className="text-sm text-gray-600 text-right">{phrase.english}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────

export default function EssentialsView() {
  const { t } = useClientI18n();
  const [activeTab, setActiveTab] = useState<EssentialsTab>('payment');
  const section = ESSENTIALS_DATA[activeTab];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold">{t('EssentialsView.title')}</h1>
        <p className="text-orange-100 text-sm mt-1">{t('EssentialsView.subtitle')}</p>
      </div>

      {/* Tab Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex overflow-x-auto scrollbar-hide">
          {ESSENTIALS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex flex-col items-center px-4 py-3 text-xs font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? tab.id === 'emergency'
                    ? 'border-red-500 text-red-600'
                    : 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              type="button"
            >
              <span className="text-lg mb-0.5">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-4">
        {activeTab === 'emergency' ? (
          <EmergencyView />
        ) : (
          <>
            {/* Section Header */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{section.icon}</span>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
                  <p className="text-sm text-gray-500">{section.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Steps (if any) */}
            {section.steps && section.steps.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 bg-orange-50 border-b border-orange-100">
                  <h3 className="text-sm font-semibold text-orange-700">{t('EssentialsView.stepByStep')}</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {section.steps.map((s) => (
                    <div key={s.step} className="flex gap-3 px-4 py-3">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                        {s.step}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{s.title}</p>
                        <p className="text-sm text-gray-600 mt-0.5">{s.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="space-y-3">
              {section.tips.map((tip, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex gap-3">
                    <span className="text-xl flex-shrink-0">{tip.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{tip.title}</p>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">{tip.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
