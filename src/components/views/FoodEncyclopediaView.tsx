"use client";
import React, { useState, useMemo } from "react";
import { chineseFoods, REGIONS, type ChineseFood } from "@/data/chinese-foods";
import { useClientI18n } from "@/lib/i18n/client";

const SPICE_ICONS = ["", "🌶️", "🌶️🌶️", "🌶️🌶️🌶️"];
const SPICE_LABELS = ["No spice", "Mild", "Medium", "Spicy"];

type DietFilter = "all" | "vegetarian" | "halal";
type SpiceFilter = "all" | "0" | "1" | "2" | "3";

function FoodCard({ food, t }: { food: ChineseFood; t: (key: string) => string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setExpanded((v) => !v)}
      className="w-full text-left bg-white rounded-2xl shadow-sm border border-teal-100 overflow-hidden transition-all active:scale-[0.98]"
    >
      {/* Card header */}
      <div className="p-3">
        <div className="text-3xl mb-2 text-center">{food.emoji}</div>
        <p className="font-semibold text-gray-900 text-sm leading-tight">{food.nameEn}</p>
        <p className="text-teal-600 text-xs mt-0.5">{food.nameCn}</p>

        {/* Tags row */}
        <div className="flex flex-wrap gap-1 mt-2">
          {food.spiceLevel > 0 && (
            <span className="text-[12px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full">
              {SPICE_ICONS[food.spiceLevel]}
            </span>
          )}
          {food.isVegetarian && (
            <span className="text-[12px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full">🌱</span>
          )}
          {!food.containsPork && !food.isVegetarian && (
            <span className="text-[12px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded-full">🕌</span>
          )}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-teal-50 bg-teal-50/40 p-3 text-left">
          <p className="text-xs text-gray-700 leading-relaxed mb-2">{food.description}</p>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">{t('FoodEncyclopediaView.spiceLabel')}</span>{" "}
              {SPICE_LABELS[food.spiceLevel]}
            </p>
            <p className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">{t('FoodEncyclopediaView.priceLabel')}</span>{" "}
              {food.priceRange}
            </p>
            <p className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">{t('FoodEncyclopediaView.findItLabel')}</span>{" "}
              {food.whereToFind}
            </p>
          </div>
        </div>
      )}
    </button>
  );
}

export default function FoodEncyclopediaView() {
  const { t } = useClientI18n();
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [dietFilter, setDietFilter] = useState<DietFilter>("all");
  const [spiceFilter, setSpiceFilter] = useState<SpiceFilter>("all");

  const filtered = useMemo(() => {
    return chineseFoods.filter((f) => {
      if (regionFilter !== "all" && f.region !== regionFilter) return false;
      if (dietFilter === "vegetarian" && !f.isVegetarian) return false;
      if (dietFilter === "halal" && f.containsPork) return false;
      if (spiceFilter !== "all" && f.spiceLevel !== Number(spiceFilter)) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!f.nameEn.toLowerCase().includes(q) && !f.nameCn.includes(q)) return false;
      }
      return true;
    });
  }, [regionFilter, dietFilter, spiceFilter, search]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-4 pt-6 pb-4">
        <h1 className="text-white text-xl font-bold mb-1">{t('FoodEncyclopediaView.title')}</h1>
        <p className="text-teal-100 text-sm">{t('FoodEncyclopediaView.subtitle')}</p>

        {/* Search */}
        <div className="mt-3 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder={t('FoodEncyclopediaView.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-white/95 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-300"
          />
        </div>
      </div>

      <div className="px-4 pt-3 space-y-3">
        {/* Region chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            type="button"
            onClick={() => setRegionFilter("all")}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              regionFilter === "all"
                ? "bg-teal-600 text-white"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            {t('FoodEncyclopediaView.allRegions')}
          </button>
          {REGIONS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRegionFilter(r.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                regionFilter === r.id
                  ? "bg-teal-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Diet + Spice filters */}
        <div className="flex gap-2">
          {/* Diet */}
          <div className="flex gap-1.5 flex-1">
            {(["all", "vegetarian", "halal"] as DietFilter[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDietFilter(d)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                  dietFilter === d
                    ? "bg-teal-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                {d === "all" ? t('FoodEncyclopediaView.dietAll') : d === "vegetarian" ? t('FoodEncyclopediaView.dietVeg') : t('FoodEncyclopediaView.dietHalal')}
              </button>
            ))}
          </div>

          {/* Spice */}
          <div className="flex gap-1.5 flex-1">
            {(["all", "0", "1", "2", "3"] as SpiceFilter[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpiceFilter(s)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                  spiceFilter === s
                    ? "bg-teal-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                {s === "all" ? t('FoodEncyclopediaView.spiceAll') : s === "0" ? t('FoodEncyclopediaView.spiceNone') : s === "1" ? "🌶️" : s === "2" ? "🌶️×2" : "🌶️×3"}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <p className="text-xs text-gray-400">{t('FoodEncyclopediaView.dishesFound').replace('{count}', String(filtered.length))}</p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">🍽️</p>
            <p className="text-sm">{t('FoodEncyclopediaView.noResults')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((food) => (
              <FoodCard key={food.id} food={food} t={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
