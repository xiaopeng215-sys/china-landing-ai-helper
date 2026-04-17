'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
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

// ─── CountdownBanner ──────────────────────────────────────────────────────────

function getDaysUntil(dateStr: string): number | null {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
};

function CountdownBanner({ profile }: { profile: TravelerProfile | null }) {
  const { t } = useClientI18n();
  const daysLeft = profile?.travelDates?.arrival
    ? getDaysUntil(profile.travelDates.arrival)
    : null;
  const destination = profile?.plannedCities?.[0] ?? null;

  if (!profile) {
    return (
      <motion.div
        className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl shadow-xl p-6 text-white"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl">
            👤
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{t('ProfileViewPage.guestUser')}</h2>
            <p className="text-white/80 text-sm">{t('ProfileViewPage.guestDesc')}</p>
            <button
              onClick={() => window.location.href = '/auth/signin?callbackUrl=/profile'}
              className="mt-2 px-4 py-1.5 bg-white text-teal-600 rounded-lg text-xs font-semibold hover:bg-white/90 transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl shadow-xl p-6 text-white overflow-hidden relative"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={0}
    >
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
      <div className="absolute -bottom-4 -right-12 w-24 h-24 bg-white/5 rounded-full" />

      <div className="flex items-center gap-4 relative">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl shrink-0">
          {profile.nationality ? '🌍' : '👤'}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold truncate">
            {profile.nationality ? `${profile.nationality} Traveler` : t('ProfileViewPage.guestUser')}
          </h2>

          {daysLeft !== null && daysLeft > 0 ? (
            <div className="mt-1">
              <p className="text-white/80 text-sm">
                {destination ? `下一站：${destination}` : '准备出发'} ·
                <span className="font-bold text-white ml-1">{daysLeft}天后</span>
              </p>
              <div className="mt-2 flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium capitalize">
                  💰 {profile.preferences.budget}
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium capitalize">
                  🎯 {profile.visitPurpose}
                </span>
              </div>
            </div>
          ) : daysLeft === 0 ? (
            <p className="text-white/80 text-sm mt-1">🎉 今天出发！</p>
          ) : !destination ? (
            <p className="text-white/80 text-sm mt-1">{t('ProfileViewPage.guestDesc')}</p>
          ) : (
            <p className="text-white/80 text-sm mt-1">
              <span className="font-bold text-yellow-200">行程已结束</span> · 期待下次旅行
            </p>
          )}
        </div>
      </div>

      {daysLeft !== null && daysLeft > 0 && (
        <div className="mt-4 relative">
          <div className="flex justify-between text-xs text-white/70 mb-1">
            <span>准备进度</span>
            <span>{Math.round(((Object.values(profile.completedSteps).filter(Boolean).length) / Object.keys(profile.completedSteps).length) * 100)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              className="bg-yellow-300 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.round(((Object.values(profile.completedSteps).filter(Boolean).length) / Object.keys(profile.completedSteps).length) * 100)}%` }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── QuickActionCards ─────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { emoji: '❤️', label: 'My Favorites', labelKey: 'ProfileViewPage.myFavorites', icon: '→' },
  { emoji: '📅', label: 'My Trips', labelKey: 'ProfileViewPage.myTrips', icon: '→' },
  { emoji: '💰', label: 'Expenses', labelKey: 'ProfileViewPage.expenses', icon: '→' },
  { emoji: '🎫', label: 'Coupons', labelKey: 'ProfileViewPage.coupons', icon: '→' },
];

function QuickActionCards() {
  const { t } = useClientI18n();

  const handleClick = (labelKey: string) => {
    if (labelKey === 'ProfileViewPage.myTrips') {
      window.location.href = '/trips';
    }
    // Other actions can be wired up later
  };

  return (
    <motion.div
      className="grid grid-cols-2 gap-3"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={2}
    >
      {QUICK_ACTIONS.map((action) => (
        <motion.button
          key={action.labelKey}
          onClick={() => handleClick(action.labelKey)}
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 flex flex-col items-start gap-2 hover:shadow-lg active:scale-95 transition-all cursor-pointer text-left"
          whileTap={{ scale: 0.97 }}
        >
          <span className="text-2xl">{action.emoji}</span>
          <span className="text-sm font-semibold text-[#484848]">{t(action.labelKey)}</span>
          <span className="text-xs text-[#767676]">{action.icon}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}

// ─── PrepProgress ─────────────────────────────────────────────────────────────

function PrepProgress({ steps }: { steps: TravelerProfile['completedSteps'] }) {
  const done = Object.values(steps).filter(Boolean).length;
  const total = Object.keys(steps).length;
  const pct = Math.round((done / total) * 100);

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md p-5 border border-gray-100"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={1}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-[#484848]">🗺️ China Trip Prep</h3>
        <span className="text-sm font-semibold text-teal-600">{done}/{total} done</span>
      </div>
      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
        <motion.div
          className="bg-teal-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, delay: 0.1 }}
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
    </motion.div>
  );
}

// ─── EditModal ───────────────────────────────────────────────────────────────

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

        <label className="block">
          <span className="text-sm font-medium text-gray-600">Nationality</span>
          <input
            className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={form.nationality}
            onChange={e => setForm(f => ({ ...f, nationality: e.target.value }))}
            placeholder="e.g. American, French, Japanese"
          />
        </label>

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

        <label className="block">
          <span className="text-sm font-medium text-gray-600">Planned Cities</span>
          <input
            className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={form.plannedCities}
            onChange={e => setForm(f => ({ ...f, plannedCities: e.target.value }))}
            placeholder="Beijing, Shanghai, Chengdu"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-medium text-gray-600">Arrival</span>
            <input
              type="text"
              placeholder="MM/DD/YYYY"
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={form.arrivalDate}
              onChange={e => setForm(f => ({ ...f, arrivalDate: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-600">Departure</span>
            <input
              type="text"
              placeholder="MM/DD/YYYY"
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={form.departureDate}
              onChange={e => setForm(f => ({ ...f, departureDate: e.target.value }))}
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-gray-600">Food Restrictions</span>
          <input
            className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={form.foodRestrictions}
            onChange={e => setForm(f => ({ ...f, foodRestrictions: e.target.value }))}
            placeholder="vegetarian, halal, gluten-free"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-600">Interests</span>
          <input
            className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={form.interests}
            onChange={e => setForm(f => ({ ...f, interests: e.target.value }))}
            placeholder="history, food, nature, photography"
          />
        </label>

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
        {/* 1. CountdownBanner */}
        <CountdownBanner profile={profile} />

        {/* 2. PrepProgress */}
        {profile && <PrepProgress steps={profile.completedSteps} />}

        {/* 3. QuickActionCards */}
        <QuickActionCards />

        {/* 4. Interests */}
        {profile && profile.preferences.interests.length > 0 && (
          <motion.div
            className="bg-white rounded-2xl shadow-md p-5 border border-gray-100"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <h3 className="font-bold text-[#484848] mb-3">✨ Your Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.preferences.interests.map(i => (
                <span key={i} className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium capitalize">
                  {i}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* 5. Settings Menu */}
        <motion.div
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
        >
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
        </motion.div>

        {/* 6. Sign Out */}
        <motion.div
          className="px-2"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={5}
        >
          <button
            onClick={async () => {
              await signOut({ redirect: false });
              window.location.href = '/auth/signin';
            }}
            className="w-full py-3.5 rounded-2xl border-2 border-red-200 text-red-500 font-semibold text-sm hover:bg-red-50 active:bg-red-100 transition-all"
          >
            Sign Out
          </button>
        </motion.div>

        {/* App Info */}
        <motion.div
          className="text-center py-6"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={6}
        >
          <div className="text-4xl mb-2">🌏</div>
          <p className="font-bold text-[#484848]">{t('ProfileViewPage.appName')}</p>
          <p className="text-sm text-[#767676]">{t('ProfileViewPage.version')}</p>
          <p className="text-xs text-[#767676] mt-4">{t('ProfileViewPage.madeWith')}</p>
        </motion.div>
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
