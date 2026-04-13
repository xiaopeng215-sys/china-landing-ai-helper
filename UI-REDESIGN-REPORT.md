# UI Redesign Report — P1 Refactor

**Date:** 2026-04-14  
**Engineer:** 魔法师 🧙  
**Scope:** Food Guide · Transport Guide · My Trips

---

## Summary

Three major UI modules were refactored to better serve international travelers visiting China. All changes pass `npm run build` with zero errors.

---

## Task 1: Food Guide Refactor

### Problem
- Only 4 Shanghai restaurants, all with Chinese-only names
- No traveler-oriented perspective or filtering

### Changes
**File:** `src/components/views/FoodView.tsx`

- Replaced 4-item static list with **20 restaurants** across 4 cities (Shanghai ×5, Beijing ×5, Chengdu ×5, Xi'an ×5)
- Added structured data per restaurant:
  - `travelerFriendly` boolean → shows 🌍 Friendly badge
  - `englishMenu` boolean → shows 🇬🇧 EN indicator
  - `spicy` boolean → shows 🌶️ indicator
  - `vegetarianOk` boolean
  - `signatureDish` — English dish name
  - `priceLevel` (1/2/3) → renders ¥/¥¥/¥¥¥
- Added **city filter chips** (All / Shanghai / Beijing / Chengdu / Xi'an)
- Added **quick filter toggles**: Traveler Friendly · English Menu · Veg-friendly
- Added **live search** by name, cuisine, or dish
- Added result count display
- Added empty state when no results match filters
- All UI strings use i18n keys; no hardcoded English text

**i18n keys added:** `filterAll`, `filterShanghai`, `filterBeijing`, `filterChengdu`, `filterXian`, `travelerFriendly`, `mustTry`, `priceRange`, `budget`, `mid`, `upscale`, `englishMenu`, `noEnglish`, `spicyLevel`, `vegetarianOk`, `cityLabel`, `cuisineLabel`, `signatureDish`

---

## Task 2: Transport Guide Refactor

### Problem
- Completely static, no dynamic recommendations
- No route planning input
- Missing airport transfer, high-speed rail, DiDi guides

### Changes
**File:** `src/components/views/TransportView.tsx`

- Added **Route Planner** with From/To inputs — routes to AI chat with pre-filled query
- Added **city selector** (Shanghai / Beijing / Chengdu / Xi'an / Guangzhou)
- Added **4 section tabs** with city-specific content:
  - ✈️ **Airport Transfer** — per-city airport name, IATA code, all transport options with duration + price + tip
  - 🚇 **Metro Tips** — per-city network size, hours, price, app, pro tips
  - 🚕 **DiDi Guide** — 5-step setup guide for international travelers
  - 🚄 **High-Speed Rail** — booking tips, passport requirements, G vs D trains
- Updated Essential Apps section with "Must Have / Recommended / Useful" badges
- All new UI strings use i18n keys

**i18n keys added:** `routePlanner`, `from`, `to`, `fromPlaceholder`, `toPlaceholder`, `planRoute`, `sectionAirport`, `sectionMetro`, `sectionDidi`, `sectionRail`, `selectCity`, `cityShanghai`, `cityBeijing`, `cityChengdu`, `cityXian`, `cityGuangzhou`

---

## Task 3: My Trips User Onboarding

### Problem
- Users didn't understand how to use the feature
- No clear user journey (Chat → Save → View/Share)
- Empty state was missing

### Changes

**File:** `src/components/views/TripsHeroCard.tsx`
- Added collapsible "How It Works" section with 3-step user journey:
  1. 💬 Chat with AI → tell interests, dates, budget
  2. 📋 Get Your Itinerary → AI generates day-by-day plan
  3. 🔗 Save & Share → save to My Trips, share with friends
- CTA button updated to use `TripsPage.startChat` i18n key

**File:** `src/components/views/TripsList.tsx`
- Added empty state when no trips match the selected city filter
- Empty state includes: icon, title, description, and CTA button linking to chat

**i18n keys added:** `onboardingTitle`, `onboardingStep1`, `onboardingStep1Desc`, `onboardingStep2`, `onboardingStep2Desc`, `onboardingStep3`, `onboardingStep3Desc`, `startChat`, `emptyTitle`, `emptyDesc`, `emptyAction`, `savedTrips`, `howItWorks`

---

## Build Verification

```
npm run build → exit code 0
All routes compiled successfully
No TypeScript errors
No missing i18n keys
```

---

## Files Modified

| File | Change |
|------|--------|
| `src/components/views/FoodView.tsx` | Full rewrite — 20 restaurants, city/filter/search |
| `src/components/views/TransportView.tsx` | Full rewrite — route planner, city tabs, 4 sections |
| `src/components/views/TripsHeroCard.tsx` | Added How It Works onboarding steps |
| `src/components/views/TripsList.tsx` | Added empty state with CTA |
| `src/messages/en-US.json` | +40 new i18n keys |
| `src/messages/zh-CN.json` | +40 new i18n keys |
| `src/messages/ko-KR.json` | +40 new i18n keys |
| `src/messages/ja-JP.json` | +40 new i18n keys |
