'use client';

import React from 'react';
import { useClientI18n } from '@/lib/i18n/client';

interface Restaurant {
  id: string;
  nameKey: string;
  cuisineKey: string;
  rating: number;
  price: string;
  distance: string;
  image: string;
  tagsKeys: string[];
}

export default function FoodView() {
  const { t } = useClientI18n();

  const restaurants: Restaurant[] = [
    {
      id: '1',
      nameKey: 'nanxiang',
      cuisineKey: 'shanghaiDumplings',
      rating: 4.8,
      price: '¥¥',
      distance: '0.5 km',
      image: '🥟',
      tagsKeys: ['tagXiaolongbao', 'tagLocalFav', 'tagHistoric'],
    },
    {
      id: '2',
      nameKey: 'dinTaiFung',
      cuisineKey: 'taiwaneseSoupDumplings',
      rating: 4.7,
      price: '¥¥¥',
      distance: '1.2 km',
      image: '🍜',
      tagsKeys: ['tagMichelin', 'tagClean', 'tagPopular'],
    },
    {
      id: '3',
      nameKey: 'haidilao',
      cuisineKey: 'sichuanHotPot',
      rating: 4.9,
      price: '¥¥¥',
      distance: '2.0 km',
      image: '🍲',
      tagsKeys: ['tagService', 'tagSpicy', 'tagGroup'],
    },
    {
      id: '4',
      nameKey: 'jiajia',
      cuisineKey: 'shanghaiSoupBuns',
      rating: 4.6,
      price: '¥',
      distance: '0.8 km',
      image: '🥠',
      tagsKeys: ['tagBudget', 'tagLocal', 'tagBreakfast'],
    },
  ];

  // Restaurant name/cuisine translations (hardcoded bilingual data)
  const restaurantNames: Record<string, Record<string, string>> = {
    nanxiang: { 'en-US': 'Nanxiang Steamed Bun Restaurant', 'zh-CN': '南翔馒头店', 'ko-KR': '난샹 만두 레스토랑', 'ja-JP': '南翔饅頭店' },
    dinTaiFung: { 'en-US': 'Din Tai Fung', 'zh-CN': '鼎泰丰', 'ko-KR': '딘타이펑', 'ja-JP': '鼎泰豊' },
    haidilao: { 'en-US': 'Haidilao Hot Pot', 'zh-CN': '海底捞火锅', 'ko-KR': '하이디라오 훠궈', 'ja-JP': '海底撈火鍋' },
    jiajia: { 'en-US': 'Jia Jia Tang Bao', 'zh-CN': '佳家汤包', 'ko-KR': '지아지아 탕바오', 'ja-JP': '佳家湯包' },
  };

  const cuisineNames: Record<string, Record<string, string>> = {
    shanghaiDumplings: { 'en-US': 'Shanghai · Dumplings', 'zh-CN': '上海 · 小笼包', 'ko-KR': '상하이 · 만두', 'ja-JP': '上海・餃子' },
    taiwaneseSoupDumplings: { 'en-US': 'Taiwanese · Soup Dumplings', 'zh-CN': '台湾 · 汤包', 'ko-KR': '대만 · 탕바오', 'ja-JP': '台湾・スープ餃子' },
    sichuanHotPot: { 'en-US': 'Sichuan · Hot Pot', 'zh-CN': '四川 · 火锅', 'ko-KR': '쓰촨 · 훠궈', 'ja-JP': '四川・火鍋' },
    shanghaiSoupBuns: { 'en-US': 'Shanghai · Soup Buns', 'zh-CN': '上海 · 汤包', 'ko-KR': '상하이 · 탕바오', 'ja-JP': '上海・スープ包子' },
  };

  const tagNames: Record<string, Record<string, string>> = {
    tagXiaolongbao: { 'en-US': 'Xiaolongbao', 'zh-CN': '小笼包', 'ko-KR': '샤오롱바오', 'ja-JP': '小籠包' },
    tagLocalFav: { 'en-US': 'Local Favorite', 'zh-CN': '本地人爱去', 'ko-KR': '현지인 추천', 'ja-JP': '地元の人気店' },
    tagHistoric: { 'en-US': 'Historic', 'zh-CN': '百年老店', 'ko-KR': '역사적', 'ja-JP': '老舗' },
    tagMichelin: { 'en-US': 'Michelin', 'zh-CN': '米其林', 'ko-KR': '미슐랭', 'ja-JP': 'ミシュラン' },
    tagClean: { 'en-US': 'Clean', 'zh-CN': '干净卫生', 'ko-KR': '청결', 'ja-JP': '清潔' },
    tagPopular: { 'en-US': 'Popular', 'zh-CN': '人气爆棚', 'ko-KR': '인기', 'ja-JP': '人気' },
    tagService: { 'en-US': 'Service', 'zh-CN': '服务好', 'ko-KR': '서비스', 'ja-JP': 'サービス' },
    tagSpicy: { 'en-US': 'Spicy', 'zh-CN': '麻辣', 'ko-KR': '매운맛', 'ja-JP': '辛い' },
    tagGroup: { 'en-US': 'Group Friendly', 'zh-CN': '适合聚餐', 'ko-KR': '단체 가능', 'ja-JP': 'グループ向け' },
    tagBudget: { 'en-US': 'Budget', 'zh-CN': '实惠', 'ko-KR': '저렴', 'ja-JP': 'リーズナブル' },
    tagLocal: { 'en-US': 'Local', 'zh-CN': '本地特色', 'ko-KR': '현지', 'ja-JP': 'ローカル' },
    tagBreakfast: { 'en-US': 'Breakfast', 'zh-CN': '早餐', 'ko-KR': '아침식사', 'ja-JP': '朝食' },
  };

  const { locale } = useClientI18n();
  const loc = locale as string;

  const getName = (map: Record<string, Record<string, string>>, key: string) =>
    map[key]?.[loc] ?? map[key]?.['en-US'] ?? key;

  const categories = [
    { icon: '🥟', labelKey: 'FoodPage.catDumplings' },
    { icon: '🍜', labelKey: 'FoodPage.catNoodles' },
    { icon: '🍲', labelKey: 'FoodPage.catHotPot' },
    { icon: '🦆', labelKey: 'FoodPage.catPekingDuck' },
    { icon: '🍢', labelKey: 'FoodPage.catStreetFood' },
    { icon: '🍚', labelKey: 'FoodPage.catRice' },
    { icon: '🥗', labelKey: 'FoodPage.catVegetarian' },
    { icon: '🍰', labelKey: 'FoodPage.catDesserts' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-[#484848]">{t('FoodPage.title')}</h1>
          <p className="text-sm text-[#767676]">{t('FoodPage.subtitle')}</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder={t('FoodPage.searchPlaceholder')}
              className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] transition-all"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all">
              {t('FoodPage.search')}
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-[#484848] mb-4">{t('FoodPage.categories')}</h3>
          <div className="grid grid-cols-4 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.labelKey}
                className="flex flex-col items-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 hover:border-[#ff5a5f] hover:shadow-md transition-all"
              >
                <span className="text-3xl mb-2">{cat.icon}</span>
                <span className="text-xs font-medium text-[#484848]">{t(cat.labelKey)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Restaurant Cards */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#484848]">{t('FoodPage.recommended')}</h3>
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-[#ff5a5f] to-[#ff3b3f] rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                  {restaurant.image}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[#484848] mb-1">{getName(restaurantNames, restaurant.nameKey)}</h4>
                  <p className="text-sm text-[#767676] mb-2">{getName(cuisineNames, restaurant.cuisineKey)}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-[#34a853]">⭐ {restaurant.rating}</span>
                    <span className="text-sm text-[#767676]">{restaurant.price}</span>
                    <span className="text-sm text-[#767676]">{restaurant.distance}</span>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {restaurant.tagsKeys.map((tagKey) => (
                      <span
                        key={tagKey}
                        className="px-2 py-1 bg-gray-100 text-[#767676] text-xs rounded-lg"
                      >
                        {getName(tagNames, tagKey)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-[#34a853] to-[#2d8e47] rounded-3xl shadow-xl p-6 text-white text-center">
          <div className="text-5xl mb-4">🗺️</div>
          <h3 className="text-xl font-bold mb-2">{t('FoodPage.aiCta')}</h3>
          <p className="text-white/90 mb-4">{t('FoodPage.aiCtaDesc')}</p>
          <button className="px-6 py-3 bg-white text-[#34a853] rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all">
            {t('FoodPage.askAI')}
          </button>
        </div>
      </main>
    </div>
  );
}
