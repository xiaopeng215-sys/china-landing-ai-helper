'use client';

import React from 'react';
import { CityFilterChips } from '@/components/trips';
import { useClientI18n } from '@/lib/i18n/client';

interface TripsViewHeaderProps {
  selectedCity: string;
  onCitySelect: (city: string) => void;
}

/**
 * TripsView 头部组件
 * 包含页面标题、副标题和城市筛选器
 */
export default function TripsViewHeader({ selectedCity, onCitySelect }: TripsViewHeaderProps) {
  const { t } = useClientI18n();
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm safe-area-top">
      <div className="max-w-3xl mx-auto px-4 pt-4 pb-3">
        <h1 className="text-2xl font-bold text-gray-900">{t('TripsPage.title')}</h1>
        <p className="text-sm text-gray-500">{t('TripsPage.subtitle')}</p>
      </div>

      {/* City Filter */}
      <CityFilterChips selectedCity={selectedCity} onCitySelect={onCitySelect} />
    </header>
  );
}
