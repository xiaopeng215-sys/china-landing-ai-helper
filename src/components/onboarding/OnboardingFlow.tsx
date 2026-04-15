'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upsertUserProfile } from '@/lib/supabase/user-profile';

// ─── Data ─────────────────────────────────────────────────────────────────────

const NATIONALITIES = [
  'American', 'British', 'Australian', 'Canadian', 'French', 'German',
  'Italian', 'Spanish', 'Japanese', 'Korean', 'Thai', 'Vietnamese',
  'Indonesian', 'Malaysian', 'Singaporean', 'Indian', 'Brazilian',
  'Mexican', 'Russian', 'Dutch', 'Swedish', 'Norwegian', 'Danish',
  'Swiss', 'Austrian', 'Belgian', 'Portuguese', 'Polish', 'Czech',
  'Hungarian', 'Romanian', 'Greek', 'Turkish', 'Israeli', 'South African',
  'Nigerian', 'Kenyan', 'Egyptian', 'Moroccan', 'Argentinian', 'Chilean',
  'Colombian', 'Peruvian', 'New Zealander', 'Irish', 'Scottish', 'Welsh',
  'Filipino', 'Cambodian', 'Burmese', 'Sri Lankan', 'Pakistani',
  'Bangladeshi', 'Nepali', 'Other',
];

const CITIES = [
  { id: 'Beijing', label: 'Beijing 北京', emoji: '🏯' },
  { id: 'Shanghai', label: 'Shanghai 上海', emoji: '🌆' },
  { id: 'Chengdu', label: 'Chengdu 成都', emoji: '🐼' },
  { id: 'Xian', label: "Xi'an 西安", emoji: '🗿' },
  { id: 'Hangzhou', label: 'Hangzhou 杭州', emoji: '🌿' },
  { id: 'Xiamen', label: 'Xiamen 厦门', emoji: '🌊' },
];

const BUDGETS = [
  { id: 'budget' as const, label: 'Backpacker', sublabel: '¥200–500/day', emoji: '🎒' },
  { id: 'mid' as const, label: 'Comfortable', sublabel: '¥500–1000/day', emoji: '🏨' },
  { id: 'luxury' as const, label: 'Luxury', sublabel: '¥1000+/day', emoji: '✨' },
];

const INTERESTS = [
  { id: 'history', label: 'History & Culture', emoji: '🏛️' },
  { id: 'food', label: 'Food & Cuisine', emoji: '🍜' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { id: 'nature', label: 'Nature & Outdoors', emoji: '🌿' },
  { id: 'nightlife', label: 'Nightlife', emoji: '🌃' },
  { id: 'art', label: 'Art & Museums', emoji: '🎨' },
  { id: 'temples', label: 'Temples & Spirituality', emoji: '⛩️' },
  { id: 'photography', label: 'Photography', emoji: '📸' },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  userId: string;
}

export default function OnboardingFlow({ userId }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Form state
  const [nationality, setNationality] = useState('');
  const [nationalitySearch, setNationalitySearch] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [budget, setBudget] = useState<'budget' | 'mid' | 'luxury'>('mid');
  const [interests, setInterests] = useState<string[]>([]);

  const filteredNationalities = NATIONALITIES.filter((n) =>
    n.toLowerCase().includes(nationalitySearch.toLowerCase()),
  );

  const toggleCity = (id: string) =>
    setCities((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));

  const toggleInterest = (id: string) =>
    setInterests((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const canNext = () => {
    if (step === 1) return nationality !== '';
    if (step === 2) return cities.length > 0;
    if (step === 3) return true; // budget always has a default
    if (step === 4) return interests.length > 0;
    return false;
  };

  const handleFinish = async () => {
    setSaving(true);
    const profile = { nationality, plannedCities: cities, budget, interests, onboardingDone: true };

    // Persist to Supabase
    await upsertUserProfile(userId, profile);

    // Also sync to localStorage for offline/fast reads
    try {
      const existing = JSON.parse(localStorage.getItem('traveler_profile') || '{}');
      localStorage.setItem('traveler_profile', JSON.stringify({
        ...existing,
        nationality,
        plannedCities: cities,
        preferences: { ...existing.preferences, budget, interests },
        updatedAt: Date.now(),
      }));
    } catch {
      // ignore
    }

    router.push('/');
  };

  const STEP_LABELS = ['Nationality', 'Cities', 'Budget', 'Interests'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg mx-auto mb-4">
            🇨🇳
          </div>
          <h1 className="text-2xl font-bold text-[#484848] mb-1">Welcome to TravelerLocal</h1>
          <p className="text-[#767676] text-sm">Let's personalize your China experience</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEP_LABELS.map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-1 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    i + 1 < step
                      ? 'bg-teal-500 text-white'
                      : i + 1 === step
                      ? 'bg-teal-600 text-white ring-4 ring-teal-200'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs ${i + 1 === step ? 'text-teal-600 font-medium' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className={`h-0.5 flex-1 mb-4 transition-all ${i + 1 < step ? 'bg-teal-500' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          {/* Step 1: Nationality */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-bold text-[#484848] mb-1">Where are you from?</h2>
              <p className="text-sm text-[#767676] mb-4">We'll tailor visa and travel tips for you</p>
              <input
                type="text"
                placeholder="Search nationality..."
                value={nationalitySearch}
                onChange={(e) => setNationalitySearch(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 mb-3 text-sm"
              />
              <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
                {filteredNationalities.map((n) => (
                  <button
                    key={n}
                    onClick={() => setNationality(n)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all ${
                      nationality === n
                        ? 'bg-teal-500 text-white font-medium'
                        : 'hover:bg-gray-50 text-[#484848]'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Cities */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-bold text-[#484848] mb-1">Which cities will you visit?</h2>
              <p className="text-sm text-[#767676] mb-4">Select all that apply</p>
              <div className="grid grid-cols-2 gap-3">
                {CITIES.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => toggleCity(city.id)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                      cities.includes(city.id)
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{city.emoji}</span>
                    <span className={`text-sm font-medium ${cities.includes(city.id) ? 'text-teal-700' : 'text-[#484848]'}`}>
                      {city.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Budget */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-bold text-[#484848] mb-1">What's your travel style?</h2>
              <p className="text-sm text-[#767676] mb-4">We'll recommend options that fit your budget</p>
              <div className="space-y-3">
                {BUDGETS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBudget(b.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                      budget === b.id
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-3xl">{b.emoji}</span>
                    <div className="text-left">
                      <p className={`font-semibold ${budget === b.id ? 'text-teal-700' : 'text-[#484848]'}`}>
                        {b.label}
                      </p>
                      <p className="text-sm text-[#767676]">{b.sublabel}</p>
                    </div>
                    {budget === b.id && <span className="ml-auto text-teal-500 text-lg">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Interests */}
          {step === 4 && (
            <div>
              <h2 className="text-lg font-bold text-[#484848] mb-1">What do you love?</h2>
              <p className="text-sm text-[#767676] mb-4">Pick your interests (choose at least one)</p>
              <div className="grid grid-cols-2 gap-3">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left ${
                      interests.includes(interest.id)
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">{interest.emoji}</span>
                    <span className={`text-xs font-medium leading-tight ${interests.includes(interest.id) ? 'text-teal-700' : 'text-[#484848]'}`}>
                      {interest.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex-1 py-3 bg-gray-100 text-[#767676] rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Back
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext()}
                className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!canNext() || saving}
                className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : "Let's Go! 🚀"}
              </button>
            )}
          </div>
        </div>

        {/* Skip */}
        <button
          onClick={() => router.push('/')}
          className="mt-4 w-full text-center text-sm text-[#767676] hover:text-[#484848] transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
