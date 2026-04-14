'use client';

import React, { useState, useMemo } from 'react';
import { useClientI18n } from '@/lib/i18n/client';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  city: 'shanghai' | 'beijing' | 'chengdu' | 'xian' | 'guangzhou' | 'shenzhen';
  rating: number;
  priceLevel: 1 | 2 | 3; // 1=budget, 2=mid, 3=upscale
  image: string;
  signatureDish: string;
  travelerFriendly: boolean;
  englishMenu: boolean;
  spicy: boolean;
  vegetarianOk: boolean;
  tags: string[];
}

const RESTAURANTS: Restaurant[] = [
  // Shanghai
  {
    id: 'sh-1',
    name: 'Nanxiang Steamed Bun Restaurant',
    cuisine: 'Shanghai · Xiaolongbao',
    city: 'shanghai',
    rating: 4.8,
    priceLevel: 2,
    image: '🥟',
    signatureDish: 'Xiaolongbao (Soup Dumplings)',
    travelerFriendly: true,
    englishMenu: true,
    spicy: false,
    vegetarianOk: false,
    tags: ['Historic', 'Local Fav', 'Must Try'],
  },
  {
    id: 'sh-2',
    name: 'Din Tai Fung',
    cuisine: 'Taiwanese · Soup Dumplings',
    city: 'shanghai',
    rating: 4.7,
    priceLevel: 3,
    image: '🍜',
    signatureDish: 'Pork Xiaolongbao',
    travelerFriendly: true,
    englishMenu: true,
    spicy: false,
    vegetarianOk: true,
    tags: ['Michelin', 'Clean', 'Popular'],
  },
  {
    id: 'sh-3',
    name: 'Haidilao Hot Pot',
    cuisine: 'Sichuan · Hot Pot',
    city: 'shanghai',
    rating: 4.9,
    priceLevel: 3,
    image: '🍲',
    signatureDish: 'Spicy Mala Broth',
    travelerFriendly: true,
    englishMenu: true,
    spicy: true,
    vegetarianOk: true,
    tags: ['Service', 'Group Friendly', 'Spicy'],
  },
  {
    id: 'sh-4',
    name: 'Jia Jia Tang Bao',
    cuisine: 'Shanghai · Soup Buns',
    city: 'shanghai',
    rating: 4.6,
    priceLevel: 1,
    image: '🥠',
    signatureDish: 'Crab Roe Tang Bao',
    travelerFriendly: false,
    englishMenu: false,
    spicy: false,
    vegetarianOk: false,
    tags: ['Budget', 'Local', 'Breakfast'],
  },
  {
    id: 'sh-5',
    name: 'Lost Heaven',
    cuisine: 'Yunnan · Folk Cuisine',
    city: 'shanghai',
    rating: 4.5,
    priceLevel: 3,
    image: '🌿',
    signatureDish: 'Yunnan Mushroom Platter',
    travelerFriendly: true,
    englishMenu: true,
    spicy: false,
    vegetarianOk: true,
    tags: ['Upscale', 'Unique', 'Vegetarian-friendly'],
  },
  // Beijing
  {
    id: 'bj-1',
    name: 'Quanjude Roast Duck',
    cuisine: 'Beijing · Peking Duck',
    city: 'beijing',
    rating: 4.7,
    priceLevel: 3,
    image: '🦆',
    signatureDish: 'Whole Peking Duck',
    travelerFriendly: true,
    englishMenu: true,
    spicy: false,
    vegetarianOk: false,
    tags: ['Historic', 'Must Try', 'Famous'],
  },
  {
    id: 'bj-2',
    name: 'Da Dong Roast Duck',
    cuisine: 'Beijing · Peking Duck',
    city: 'beijing',
    rating: 4.8,
    priceLevel: 3,
    image: '🍽️',
    signatureDish: 'Crispy Skin Peking Duck',
    travelerFriendly: true,
    englishMenu: true,
    spicy: false,
    vegetarianOk: false,
    tags: ['Michelin', 'Modern', 'Popular'],
  },
  {
    id: 'bj-3',
    name: 'Gui Jie Crayfish Street',
    cuisine: 'Beijing · Street Food',
    city: 'beijing',
    rating: 4.5,
    priceLevel: 2,
    image: '🦞',
    signatureDish: 'Spicy Crayfish (Mala)',
    travelerFriendly: false,
    englishMenu: false,
    spicy: true,
    vegetarianOk: false,
    tags: ['Night Market', 'Local', 'Spicy'],
  },
  {
    id: 'bj-4',
    name: 'Baoyuan Jiaozi Wu',
    cuisine: 'Beijing · Dumplings',
    city: 'beijing',
    rating: 4.6,
    priceLevel: 1,
    image: '🥟',
    signatureDish: 'Colorful Dumplings',
    travelerFriendly: true,
    englishMenu: true,
    spicy: false,
    vegetarianOk: true,
    tags: ['Budget', 'Fun', 'Colorful'],
  },
  {
    id: 'bj-5',
    name: 'Siji Minfu',
    cuisine: 'Beijing · Traditional',
    city: 'beijing',
    rating: 4.7,
    priceLevel: 2,
    image: '🏮',
    signatureDish: 'Zhajiangmian (Noodles)',
    travelerFriendly: true,
    englishMenu: true,
    spicy: false,
    vegetarianOk: false,
    tags: ['Traditional', 'Hutong', 'Authentic'],
  },
  // Chengdu
  {
    id: 'cd-1',
    name: 'Chen Mapo Tofu',
    cuisine: 'Sichuan · Mapo Tofu',
    city: 'chengdu',
    rating: 4.8,
    priceLevel: 1,
    image: '🌶️',
    signatureDish: 'Mapo Tofu',
    travelerFriendly: true,
    englishMenu: true,
    spicy: true,
    vegetarianOk: false,
    tags: ['Historic', 'Must Try', 'Spicy'],
  },
  {
    id: 'cd-2',
    name: 'Long Chao Shou',
    cuisine: 'Sichuan · Wontons',
    city: 'chengdu',
    rating: 4.6,
    priceLevel: 1,
    image: '🍜',
    signatureDish: 'Red Oil Wontons',
    travelerFriendly: false,
    englishMenu: false,
    spicy: true,
    vegetarianOk: false,
    tags: ['Budget', 'Local', 'Breakfast'],
  },
  {
    id: 'cd-3',
    name: 'Haidilao (Chengdu)',
    cuisine: 'Sichuan · Hot Pot',
    city: 'chengdu',
    rating: 4.9,
    priceLevel: 3,
    image: '🍲',
    signatureDish: 'Authentic Sichuan Mala Pot',
    travelerFriendly: true,
    englishMenu: true,
    spicy: true,
    vegetarianOk: true,
    tags: ['Service', 'Spicy', 'Group Friendly'],
  },
  {
    id: 'cd-4',
    name: 'Zhong Shui Jiao',
    cuisine: 'Sichuan · Dumplings',
    city: 'chengdu',
    rating: 4.7,
    priceLevel: 1,
    image: '🥟',
    signatureDish: 'Zhong Dumplings in Chili Oil',
    travelerFriendly: true,
    englishMenu: false,
    spicy: true,
    vegetarianOk: false,
    tags: ['Street Food', 'Must Try', 'Spicy'],
  },
  {
    id: 'cd-5',
    name: 'Panda Base Café',
    cuisine: 'Sichuan · Café',
    city: 'chengdu',
    rating: 4.4,
    priceLevel: 2,
    image: '🐼',
    signatureDish: 'Panda Bun & Local Snacks',
    travelerFriendly: true,
    englishMenu: true,
    spicy: false,
    vegetarianOk: true,
    tags: ['Cute', 'Tourist-friendly', 'Unique'],
  },
  // Guangzhou
  {
    id: 'gz-1',
    name: 'Tim Ho Wan',
    cuisine: 'Guangdong · Dim Sum',
    city: 'guangzhou',
    rating: 4.8,
    priceLevel: 2,
    image: '🍱',
    signatureDish: 'Baked BBQ Pork Buns',
    travelerFriendly: true,
    englishMenu: true,
    spicy: false,
    vegetarianOk: true,
    tags: ['Michelin', 'Dim Sum', 'Must Try'],
  },
  {
    id: 'gz-2',
    name: 'Guangzhou Restaurant',
    cuisine: 'Guangdong · Cantonese',
    city: 'guangzhou',
    rating: 4.7,
    priceLevel: 2,
    image: '🍤',
    signatureDish: 'Roast Goose & Char Siu',
    travelerFriendly: true,
    englishMenu: true,
    spicy: false,
    vegetarianOk: false,
    tags: ['Historic', 'Cantonese', 'Famous'],
  },
  {
    id: 'gz-3',
    name: 'Lian Xiang Lou',
    cuisine: 'Guangdong · Cantonese',
    city: 'guangzhou',
    rating: 4.6,
    priceLevel: 3,
    image: '🦐',
    signatureDish: 'Steamed Shrimp Dumplings (Har Gow)',
    travelerFriendly: true,
    englishMenu: true,
    spicy: false,
    vegetarianOk: false,
    tags: ['Traditional', 'Upscale', 'Dim Sum'],
  },
  {
    id: 'gz-4',
    name: 'Xiguan Delicacies',
    cuisine: 'Guangdong · Street Food',
    city: 'guangzhou',
    rating: 4.5,
    priceLevel: 1,
    image: '🍢',
    signatureDish: 'Cheung Fun (Rice Noodle Rolls)',
    travelerFriendly: false,
    englishMenu: false,
    spicy: false,
    vegetarianOk: true,
    tags: ['Budget', 'Local', 'Breakfast'],
  },
  {
    id: 'gz-5',
    name: 'Tao Tao Ju',
    cuisine: 'Guangdong · Yum Cha',
    city: 'guangzhou',
    rating: 4.7,
    priceLevel: 2,
    image: '🫖',
    signatureDish: 'Morning Yum Cha Set',
    travelerFriendly: true,
    englishMenu: false,
    spicy: false,
    vegetarianOk: true,
    tags: ['Historic', 'Yum Cha', 'Authentic'],
  },
  // Shenzhen
  {
    id: 'sz-1',
    name: 'Chaoshan Beef Hot Pot',
    cuisine: 'Chaoshan · Hot Pot',
    city: 'shenzhen',
    rating: 4.8,
    priceLevel: 3,
    image: '🥩',
    signatureDish: 'Fresh Beef Slices Hot Pot',
    travelerFriendly: true,
    englishMenu: true,
    spicy: false,
    vegetarianOk: false,
    tags: ['Premium', 'Must Try', 'Fresh'],
  },
  {
    id: 'sz-2',
    name: 'Dafen Village Café',
    cuisine: 'Shenzhen · Fusion',
    city: 'shenzhen',
    rating: 4.4,
    priceLevel: 2,
    image: '☕',
    signatureDish: 'Cantonese Fusion Brunch',
    travelerFriendly: true,
    englishMenu: true,
    spicy: false,
    vegetarianOk: true,
    tags: ['Trendy', 'Fusion', 'Instagrammable'],
  },
  {
    id: 'sz-3',
    name: 'Dongmen Old Street Stalls',
    cuisine: 'Shenzhen · Street Food',
    city: 'shenzhen',
    rating: 4.5,
    priceLevel: 1,
    image: '🥘',
    signatureDish: 'Oyster Omelette & Stinky Tofu',
    travelerFriendly: false,
    englishMenu: false,
    spicy: false,
    vegetarianOk: false,
    tags: ['Street Food', 'Night Market', 'Local'],
  },
  {
    id: 'sz-4',
    name: 'Shenzhen Bay Seafood',
    cuisine: 'Shenzhen · Seafood',
    city: 'shenzhen',
    rating: 4.6,
    priceLevel: 3,
    image: '🦞',
    signatureDish: 'Steamed Live Lobster',
    travelerFriendly: true,
    englishMenu: true,
    spicy: false,
    vegetarianOk: false,
    tags: ['Upscale', 'Seafood', 'View'],
  },
  {
    id: 'sz-5',
    name: 'Hakka Kitchen',
    cuisine: 'Hakka · Traditional',
    city: 'shenzhen',
    rating: 4.5,
    priceLevel: 2,
    image: '🍲',
    signatureDish: 'Hakka Salt-Baked Chicken',
    travelerFriendly: true,
    englishMenu: false,
    spicy: false,
    vegetarianOk: false,
    tags: ['Authentic', 'Hakka', 'Local Fav'],
  },
  // Xi'an
  {
    id: 'xa-1',
    name: 'Tong Sheng Xiang',
    cuisine: "Xi'an · Lamb Soup",
    city: 'xian',
    rating: 4.8,
    priceLevel: 1,
    image: '🍖',
    signatureDish: 'Paomo (Lamb Bread Soup)',
    travelerFriendly: true,
    englishMenu: false,
    spicy: false,
    vegetarianOk: false,
    tags: ['Historic', 'Must Try', 'Hearty'],
  },
  {
    id: 'xa-2',
    name: 'Muslim Quarter Stalls',
    cuisine: "Xi'an · Street Food",
    city: 'xian',
    rating: 4.7,
    priceLevel: 1,
    image: '🥙',
    signatureDish: 'Roujiamo (Chinese Burger)',
    travelerFriendly: true,
    englishMenu: false,
    spicy: false,
    vegetarianOk: false,
    tags: ['Street Food', 'Night Market', 'Must Try'],
  },
  {
    id: 'xa-3',
    name: 'Lao Sun Jia',
    cuisine: "Xi'an · Hui Cuisine",
    city: 'xian',
    rating: 4.6,
    priceLevel: 2,
    image: '🍜',
    signatureDish: 'Yangrou Paomo',
    travelerFriendly: false,
    englishMenu: false,
    spicy: false,
    vegetarianOk: false,
    tags: ['Historic', 'Authentic', 'Local Fav'],
  },
  {
    id: 'xa-4',
    name: 'Biang Biang Noodles Shop',
    cuisine: "Xi'an · Noodles",
    city: 'xian',
    rating: 4.7,
    priceLevel: 1,
    image: '🍝',
    signatureDish: 'Biang Biang Wide Noodles',
    travelerFriendly: true,
    englishMenu: true,
    spicy: true,
    vegetarianOk: true,
    tags: ['Must Try', 'Unique', 'Budget'],
  },
  {
    id: 'xa-5',
    name: 'Defachang Dumpling Banquet',
    cuisine: "Xi'an · Dumplings",
    city: 'xian',
    rating: 4.5,
    priceLevel: 3,
    image: '🥟',
    signatureDish: 'Dumpling Banquet (108 varieties)',
    travelerFriendly: true,
    englishMenu: true,
    spicy: false,
    vegetarianOk: true,
    tags: ['Upscale', 'Unique', 'Group Friendly'],
  },
];

const CITIES = ['all', 'shanghai', 'beijing', 'chengdu', 'xian', 'guangzhou', 'shenzhen'] as const;
type CityFilter = typeof CITIES[number];

const PRICE_ICONS = ['', '¥', '¥¥', '¥¥¥'];

export default function FoodView() {
  const { t } = useClientI18n();
  const [selectedCity, setSelectedCity] = useState<CityFilter>('all');
  const [filterFriendly, setFilterFriendly] = useState(false);
  const [filterEnglish, setFilterEnglish] = useState(false);
  const [filterVeg, setFilterVeg] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cityFilterKey: Record<CityFilter, string> = {
    all: 'FoodPage.filterAll',
    shanghai: 'FoodPage.filterShanghai',
    beijing: 'FoodPage.filterBeijing',
    chengdu: 'FoodPage.filterChengdu',
    xian: 'FoodPage.filterXian',
    guangzhou: 'FoodPage.filterGuangzhou',
    shenzhen: 'FoodPage.filterShenzhen',
  };

  const filtered = useMemo(() => {
    return RESTAURANTS.filter((r) => {
      if (selectedCity !== 'all' && r.city !== selectedCity) return false;
      if (filterFriendly && !r.travelerFriendly) return false;
      if (filterEnglish && !r.englishMenu) return false;
      if (filterVeg && !r.vegetarianOk) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          r.signatureDish.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCity, filterFriendly, filterEnglish, filterVeg, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-[#484848]">{t('FoodPage.title')}</h1>
          <p className="text-sm text-[#767676]">{t('FoodPage.subtitle')}</p>
          <p className="text-xs text-gray-400 mt-1">📊 Data sourced from local restaurants, traveler reviews & official tourism boards · Updated April 2026</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Search */}
        <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
          <div className="flex gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('FoodPage.searchPlaceholder')}
              className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] transition-all text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-3 bg-gray-100 text-gray-500 rounded-xl text-sm hover:bg-gray-200 transition-all"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* City Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCity === city
                  ? 'bg-[#ff5a5f] text-white shadow-md'
                  : 'bg-white text-[#484848] border border-gray-200 hover:border-[#ff5a5f]'
              }`}
            >
              {t(cityFilterKey[city])}
            </button>
          ))}
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterFriendly(!filterFriendly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filterFriendly
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-white text-[#484848] border-gray-200 hover:border-teal-400'
            }`}
          >
            🌍 {t('FoodPage.travelerFriendly')}
          </button>
          <button
            onClick={() => setFilterEnglish(!filterEnglish)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filterEnglish
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-white text-[#484848] border-gray-200 hover:border-teal-400'
            }`}
          >
            🇬🇧 {t('FoodPage.englishMenu')}
          </button>
          <button
            onClick={() => setFilterVeg(!filterVeg)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filterVeg
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-white text-[#484848] border-gray-200 hover:border-green-400'
            }`}
          >
            🥗 {t('FoodPage.vegetarianOk')}
          </button>
        </div>

        {/* Results count */}
        <p className="text-sm text-[#767676]">
          {filtered.length} {filtered.length === 1 ? 'restaurant' : 'restaurants'} found
        </p>

        {/* Restaurant Cards */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-gray-100">
              <div className="text-5xl mb-3">🍽️</div>
              <p className="text-[#484848] font-medium">No restaurants match your filters</p>
              <p className="text-sm text-[#767676] mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            filtered.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-20 bg-gradient-to-br from-[#ff5a5f] to-[#ff3b3f] rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                    {r.image}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-[#484848] text-sm leading-tight">{r.name}</h4>
                      {r.travelerFriendly && (
                        <span className="flex-shrink-0 px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded-full font-medium">
                          🌍 Friendly
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#767676] mt-0.5">{r.cuisine}</p>

                    {/* Signature dish */}
                    <p className="text-xs text-[#484848] mt-1">
                      <span className="text-[#767676]">{t('FoodPage.signatureDish')}: </span>
                      {r.signatureDish}
                    </p>

                    {/* Stats row */}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs font-semibold text-[#34a853]">⭐ {r.rating}</span>
                      <span className="text-xs text-[#767676]">{PRICE_ICONS[r.priceLevel]}</span>
                      {r.englishMenu && (
                        <span className="text-xs text-teal-600">🇬🇧 EN</span>
                      )}
                      {r.spicy && (
                        <span className="text-xs text-red-500">🌶️</span>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {r.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-gray-100 text-[#767676] text-xs rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* AI CTA */}
        <div className="bg-gradient-to-br from-[#34a853] to-[#2d8e47] rounded-3xl shadow-xl p-6 text-white text-center">
          <div className="text-5xl mb-4">🗺️</div>
          <h3 className="text-xl font-bold mb-2">{t('FoodPage.aiCta')}</h3>
          <p className="text-white/90 mb-4 text-sm">{t('FoodPage.aiCtaDesc')}</p>
          <button
            onClick={() => { window.location.href = '/?tab=chat'; }}
            className="px-6 py-3 bg-white text-[#34a853] rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm"
          >
            {t('FoodPage.askAI')}
          </button>
        </div>
      </main>
    </div>
  );
}
