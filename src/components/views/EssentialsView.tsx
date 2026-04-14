'use client';

import React, { useState } from 'react';
import { ESSENTIALS_DATA, ESSENTIALS_TABS, type EssentialsTab } from '@/data/essentials';

export default function EssentialsView() {
  const [activeTab, setActiveTab] = useState<EssentialsTab>('payment');
  const section = ESSENTIALS_DATA[activeTab];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold">🛡️ Essentials</h1>
        <p className="text-orange-100 text-sm mt-1">Everything you need before & during your trip</p>
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
                  ? 'border-orange-500 text-orange-600'
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
              <h3 className="text-sm font-semibold text-orange-700">Step-by-Step Guide</h3>
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
      </div>
    </div>
  );
}
