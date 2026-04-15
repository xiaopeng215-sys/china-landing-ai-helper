"use client";

import React, { useState, useMemo } from "react";
import { hotels, CITIES } from "@/data/hotels";
import type { CityKey } from "@/data/hotels";
import { useClientI18n } from "@/lib/i18n/client";
import { BookingIntent } from "@/components/booking/BookingIntent";

type PriceFilter = 'all' | 'budget' | 'mid-range' | 'luxury';

function StarRating({ stars }: { stars: number }) {
  return (
    <span className="text-amber-400 text-sm" aria-label={`${stars} stars`}>
      {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
    </span>
  );
}

export default function HotelView() {
  const { t } = useClientI18n();
  const [activeCity, setActiveCity] = useState<CityKey>('beijing');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');

  const PRICE_FILTERS: { key: PriceFilter; label: string; emoji: string }[] = [
    { key: 'all', label: t('HotelView.filterAll'), emoji: '🏨' },
    { key: 'budget', label: t('HotelView.filterBudget'), emoji: '💰' },
    { key: 'mid-range', label: t('HotelView.filterMidRange'), emoji: '⭐' },
    { key: 'luxury', label: t('HotelView.filterLuxury'), emoji: '👑' },
  ];

  const filtered = useMemo(() => {
    return hotels.filter(
      (h) =>
        h.cityKey === activeCity &&
        (priceFilter === 'all' || h.priceRange === priceFilter)
    );
  }, [activeCity, priceFilter]);

  const getPriceLabel = (priceRange: string) => {
    if (priceRange === 'budget') return t('HotelView.priceBudget');
    if (priceRange === 'mid-range') return t('HotelView.priceMidRange');
    if (priceRange === 'luxury') return t('HotelView.priceLuxury');
    return priceRange;
  };

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-4 pt-6 pb-4">
        <h1 className="text-white text-2xl font-bold">{t('HotelView.title')}</h1>
        <p className="text-teal-100 text-sm mt-1">{t('HotelView.subtitle')}</p>
      </div>

      {/* City Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex overflow-x-auto scrollbar-hide px-2 py-2 gap-2">
          {CITIES.map((city) => (
            <button
              key={city.key}
              onClick={() => setActiveCity(city.key)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCity === city.key
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-teal-600'
              }`}
            >
              {city.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {PRICE_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setPriceFilter(f.key)}
            className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              priceFilter === f.key
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300'
            }`}
          >
            <span>{f.emoji}</span>
            <span>{f.label}</span>
          </button>
        ))}
      </div>

      {/* Hotel Cards */}
      <div className="px-4 pb-4 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-2">🏨</div>
            <p>{t('HotelView.noHotels')}</p>
          </div>
        ) : (
          filtered.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-teal-50 to-teal-50 px-4 py-3 flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-base leading-tight">
                    {hotel.name}
                  </h3>
                  <div className="mt-0.5">
                    <StarRating stars={hotel.stars} />
                  </div>
                </div>
                <span
                  className={`ml-2 flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                    hotel.priceRange === 'luxury'
                      ? 'bg-purple-100 text-purple-700'
                      : hotel.priceRange === 'mid-range'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {getPriceLabel(hotel.priceRange)}
                </span>
              </div>

              {/* Card Body */}
              <div className="px-4 py-3">
                {/* Price */}
                <div className="flex items-center gap-1 mb-3">
                  <span className="text-teal-600 font-bold text-lg">
                    {hotel.pricePerNight}
                  </span>
                  <span className="text-gray-400 text-sm">{t('HotelView.perNight')}</span>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {hotel.highlights.map((h) => (
                    <span
                      key={h}
                      className="bg-teal-50 text-teal-700 text-xs px-2 py-0.5 rounded-full border border-teal-100"
                    >
                      ✓ {h}
                    </span>
                  ))}
                </div>

                {/* Book Now — intent collection + affiliate redirect */}
                <div className="flex gap-2">
                  <BookingIntent
                    placeName={hotel.name}
                    placeType="hotel"
                    city={hotel.city}
                    buttonLabel={t('HotelView.bookNow')}
                    buttonClassName="flex-1 text-center bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Affiliate Disclosure */}
      <p className="text-center text-xs text-gray-400 px-4 pb-4">
        {t('HotelView.affiliateNote')}
      </p>
    </div>
  );
}
