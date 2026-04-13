'use client';

import React, { useState } from 'react';
import { useClientI18n } from '@/lib/i18n/client';

interface TripsHeroCardProps {
  onPlanTrip?: () => void;
}

/**
 * TripsView 英雄卡片 — 包含用户旅程引导 (Chat → Save → Share)
 */
export default function TripsHeroCard({ onPlanTrip }: TripsHeroCardProps) {
  const { t } = useClientI18n();
  const [expanded, setExpanded] = useState(false);

  const steps = [
    {
      num: '1',
      icon: '💬',
      title: t('TripsPage.onboardingStep1'),
      desc: t('TripsPage.onboardingStep1Desc'),
      color: 'bg-blue-100 text-blue-700',
    },
    {
      num: '2',
      icon: '📋',
      title: t('TripsPage.onboardingStep2'),
      desc: t('TripsPage.onboardingStep2Desc'),
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      num: '3',
      icon: '🔗',
      title: t('TripsPage.onboardingStep3'),
      desc: t('TripsPage.onboardingStep3Desc'),
      color: 'bg-purple-100 text-purple-700',
    },
  ];

  return (
    <div className="space-y-3">
      {/* Main CTA Card */}
      <div
        className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl shadow-xl p-6 text-white cursor-pointer active:scale-[0.98] transition-transform"
        onClick={onPlanTrip}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-3xl">✈️</div>
            <h2 className="text-xl font-bold">{t('TripsPage.planTrip')}</h2>
            <p className="text-white/90 text-sm">{t('TripsPage.planTripDesc')}</p>
          </div>
          <button
            className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-2xl text-sm font-semibold hover:bg-white/30 transition-all"
            onClick={(e) => { e.stopPropagation(); onPlanTrip?.(); }}
          >
            {t('TripsPage.startChat')}
          </button>
        </div>
      </div>

      {/* How It Works — collapsible */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <button
          className="w-full flex items-center justify-between px-5 py-4 text-left"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="font-semibold text-sm text-[#484848]">❓ {t('TripsPage.howItWorks')}</span>
          <span className={`text-[#767676] transition-transform ${expanded ? 'rotate-180' : ''}`}>▾</span>
        </button>

        {expanded && (
          <div className="px-5 pb-5 space-y-3 border-t border-gray-100 pt-4">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-3 items-start">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${step.color}`}>
                  {step.num}
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#484848]">{step.icon} {step.title}</p>
                  <p className="text-xs text-[#767676] mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
