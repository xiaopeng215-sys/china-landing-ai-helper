'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClientI18n } from '@/lib/i18n/client';
import { useTravelerProfile } from '@/hooks/useTravelerProfile';
import type { TravelerProfile } from '@/lib/traveler-profile';

// ─── Prep Steps Config ────────────────────────────────────────────────────────

const PREP_STEPS: { key: keyof TravelerProfile['completedSteps']; emoji: string; label: string }[] = [
  { key: 'visa', emoji: '🛂', label: 'Visa' },
  { key: 'payment', emoji: '💳', label: 'Payment (Alipay/WeChat)' },
  { key: 'sim', emoji: '📶', label: 'SIM Card' },
  { key: 'vpn', emoji: '🔒', label: 'VPN' },
  { key: 'accommodation', emoji: '🏨', label: 'Accommodation' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function PrepProgress({ steps }: { steps: TravelerProfile['completedSteps'] }) {
  const done = Object.values(steps).filter(Boolean).length;
  const total = Object.keys(steps).length;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-[#484848]">🗺️ China Trip Prep</h3>
        <span className="text-sm font-semibold text-teal-600">{done}/{total} done</span>
      </div>
      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
        <div
          className="bg-teal-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {/* Step list */}
      <div className="space-y-2">
        {PREP_STEPS.map(({ key, emoji, label }) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-lg">{emoji}</span>
            <span className={`flex-1 text-sm ${steps[key] ? 'text-gray-400 line-through' : 'text-[#484848]'}`}>
              {label}
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${steps[key] ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'}`}>
              {steps[key] ? '✓ Done' : 'Pending'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditModal({
  profile,
  onSave,
  onClose,
}: {
  profile: TravelerProfile;
  onSave: (p: Partial<TravelerProfile>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    nationality: profile.nationality,
    visitPurpose: profile.visitPurpose,
    budget: profile.preferences.budget,
    plannedCities: profile.plannedCities.join(', '),
    foodRestrictions: profile.preferences.foodRestrictions.join(', '),
    interests: profile.preferences.interests.join(', '),
    arrivalDate: profile.travelDates?.arrival ?? '',
    departureDate: profile.travelDates?.departure ?? '',
    steps: { ...profile.completedSteps },
  });

  const handleSave = () => {
    const cities = form.plannedCities.split(',').map(s => s.trim()).filter(Boolean);
    const food = form.foodRestrictions.split(',').map(s => s.trim()).filter(Boolean);
    const interests = form.interests.split(',').map(s => s.trim()).filter(Boolean);
    onSave({
      nationality: form.nationality,
      visitPurpose: form.visitPurpose as TravelerProfile['visitPurpose'],
      plannedCities: cities,
      travelDates: form.arrivalDate ? { arrival: form.arrivalDate, departure: form.departureDate } : undefined,
      completedSteps: form.steps,
      preferences: {
        budget: form.budget as TravelerProfile['preferences']['budget'],
        foodRestrictions: food,
        interests,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-[#484848]">Edit Traveler Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {/* Nationality */}
        <label className="block">
          <span className="text-sm font-medium text-gray-600">Nationality</span>
          <input
            className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={form.nationality}
            onChange={e => setForm(f => ({ ...f, nationality: e.target.value }))}
            placeholder="e.g. American, French, Japanese"
          />
        </label>

        {/* Visit Purpose */}
        <label className="block">
          <span className="text-sm font-medium text-gray-600">Visit Purpose</span>
          <select
            className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={form.visitPurpose}
            onChange={e => setForm(f => ({ ...f, visitPurpose: e.target.value as any }))}
          >
            <option value="tourism">Tourism</option>
            <option value="business">Business</option>
            <option value="study">Study</option>
            <option value="other">Other</option>
          </select>
        </label>

        {/* Budget */}
        <label className="block">
          <span className="text-sm font-medium text-gray-600">Budget Level</span>
          <select
            className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={form.budget}
            onChange={e => setForm(f => ({ ...f, budget: e.target.value as any }))}
          >
            <option value="budget">Budget (hostels, street food)</option>
            <option value="mid">Mid-range (3-star hotels)</option>
            <option value="luxury">Luxury (5-star, fine dining)</option>
          </select>
        </label>

        {/* Planned Cities */}
        <label className="block">
          <span className="text-sm font-medium text-gray-600">Planned Cities</span>
          <input
            className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={form.plannedCities}
            onChange={e => setForm(f => ({ ...f, plannedCities: e.target.value }))}
            placeholder="Beijing, Shanghai, Chengdu"
          />
        </label>

        {/* Travel Dates */}
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-medium text-gray-600">Arrival</span>
            <input
              type="date" lang="en" placeholder="MM/DD/YYYY"
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={form.arrivalDate}
              onChange={e => setForm(f => ({ ...f, arrivalDate: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-600">Departure</span>
            <input
              type="date" lang="en" placeholder="MM/DD/YYYY"
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={form.departureDate}
              onChange={e => setForm(f => ({ ...f, departureDate: e.target.value }))}
            />
          </label>
        </div>

        {/* Food Restrictions */}
        <label className="block">
          <span className="text-sm font-medium text-gray-600">Food Restrictions</span>
          <input
            className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={form.foodRestrictions}
            onChange={e => setForm(f => ({ ...f, foodRestrictions: e.target.value }))}
            placeholder="vegetarian, halal, gluten-free"
          />
        </label>

        {/* Interests */}
        <label className="block">
          <span className="text-sm font-medium text-gray-600">Interests</span>
          <input
            className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={form.interests}
            onChange={e => setForm(f => ({ ...f, interests: e.target.value }))}
            placeholder="history, food, nature, photography"
          />
        </label>

        {/* Prep Steps */}
        <div>
          <span className="text-sm font-medium text-gray-600">Prep Checklist</span>
          <div className="mt-2 space-y-2">
            {PREP_STEPS.map(({ key, emoji, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-teal-500"
                  checked={form.steps[key]}
                  onChange={e => setForm(f => ({ ...f, steps: { ...f.steps, [key]: e.target.checked } }))}
                />
                <span className="text-sm">{emoji} {label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-2xl transition-colors"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}

// ─── Main ProfileView ─────────────────────────────────────────────────────────

export default function ProfileView() {
  const { t } = useClientI18n();
  const router = useRouter();
  const { profile, updateProfile } = useTravelerProfile();
  const [showEdit, setShowEdit] = useState(false);

  const support = [
    { icon: '❓', labelKey: 'ProfileViewPage.helpCenter' },
    { icon: '📧', labelKey: 'ProfileViewPage.contactUs' },
    { icon: '⭐', labelKey: 'ProfileViewPage.rateApp' },
    { icon: '📋', labelKey: 'ProfileViewPage.privacyPolicy' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#484848]">{t('ProfileViewPage.title')}</h1>
            <p className="text-sm text-[#767676]">{t('ProfileViewPage.subtitle')}</p>
          </div>
          {profile && (
            <button
              onClick={() => setShowEdit(true)}
              className="px-4 py-2 bg-teal-50 text-teal-600 rounded-xl text-sm font-semibold hover:bg-teal-100 transition-colors"
            >
              ✏️ Edit
            </button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Traveler Card */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl shadow-xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl">
              {profile?.nationality ? '🌍' : '👤'}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">
                {profile?.nationality ? `${profile.nationality} Traveler` : t('ProfileViewPage.guestUser')}
              </h2>
              <p className="text-white/80 text-sm">
                {profile?.plannedCities.length
                  ? `Visiting: ${profile.plannedCities.join(' · ')}`
                  : t('ProfileViewPage.guestDesc')}
              </p>
              {profile?.travelDates && (
                <p className="text-white/70 text-xs mt-1">
                  📅 {profile.travelDates.arrival} → {profile.travelDates.departure}
                </p>
              )}
            </div>
          </div>

          {/* Budget + Purpose badges */}
          {profile && (
            <div className="flex gap-2 mt-4 flex-wrap">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium capitalize">
                💰 {profile.preferences.budget}
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium capitalize">
                🎯 {profile.visitPurpose}
              </span>
              {profile.preferences.foodRestrictions.map(r => (
                <span key={r} className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                  🍽️ {r}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Prep Progress */}
        {profile && <PrepProgress steps={profile.completedSteps} />}

        {/* Interests */}
        {profile && profile.preferences.interests.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
            <h3 className="font-bold text-[#484848] mb-3">✨ Your Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.preferences.interests.map(i => (
                <span key={i} className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium capitalize">
                  {i}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Sign In CTA (if no nationality set) */}
        {profile && !profile.nationality && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">Complete your profile</p>
              <p className="text-xs text-amber-600">Tell us about yourself so AI can give personalized advice</p>
            </div>
            <button
              onClick={() => setShowEdit(true)}
              className="px-3 py-1.5 bg-amber-500 text-white rounded-xl text-xs font-semibold"
            >
              Set up
            </button>
          </div>
        )}

        {/* Support */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-[#484848]">{t('ProfileViewPage.support')}</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {support.map((item) => (
              <button
                key={item.labelKey}
                onClick={() => {
                  if (item.labelKey === 'ProfileViewPage.privacyPolicy') router.push('/privacy');
                  else if (item.labelKey === 'ProfileViewPage.contactUs') window.open('mailto:support@travelerlocal.ai');
                  else if (item.labelKey === 'ProfileViewPage.helpCenter') window.open('https://travelerlocal.ai/help', '_blank', 'noopener,noreferrer');
                  else if (item.labelKey === 'ProfileViewPage.rateApp') window.open('https://apps.apple.com', '_blank', 'noopener,noreferrer');
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 transition-all cursor-pointer"
              >
                <div className="text-2xl">{item.icon}</div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-[#484848]">{t(item.labelKey)}</p>
                </div>
                <div className="text-[#767676]">→</div>
              </button>
            ))}
          </div>
        </div>

        {/* App Info */}
        <div className="text-center py-6">
          <div className="text-4xl mb-2">🇨🇳</div>
          <p className="font-bold text-[#484848]">{t('ProfileViewPage.appName')}</p>
          <p className="text-sm text-[#767676]">{t('ProfileViewPage.version')}</p>
          <p className="text-xs text-[#767676] mt-4">{t('ProfileViewPage.madeWith')}</p>
        </div>
      </main>

      {/* Edit Modal */}
      {showEdit && profile && (
        <EditModal
          profile={profile}
          onSave={updateProfile}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
}
