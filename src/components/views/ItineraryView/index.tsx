'use client';

import React, { useState } from 'react';
import { MapPin, Calendar, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import type { ItineraryRequest, Itinerary } from '@/lib/itinerary/types';
import { DayCard } from './DayCard';

const INTERESTS = ['History', 'Food', 'Shopping', 'Nature', 'Art', 'Nightlife', 'Architecture', 'Local Life'];
const DESTINATIONS = ['Beijing', 'Shanghai', 'Chengdu', 'Xi\'an', 'Guilin', 'Hangzhou', 'Shenzhen', 'Guangzhou'];

export default function ItineraryView() {
  const [step, setStep] = useState<'form' | 'loading' | 'result'>('form');
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  const [form, setForm] = useState<ItineraryRequest>({
    destination: '',
    duration: 3,
    nationality: 'US',
    budget: 'mid',
    interests: ['History', 'Food'],
  });

  const toggleInterest = (interest: string) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleGenerate = async () => {
    if (!form.destination) return;
    setStep('loading');
    setError(null);

    try {
      const res = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Generation failed');
      }

      const data: Itinerary = await res.json();
      setItinerary(data);
      setStep('result');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setStep('form');
    }
  };

  if (step === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-800 text-lg">Crafting your itinerary...</p>
          <p className="text-sm text-gray-500 mt-1">AI is planning {form.duration} days in {form.destination}</p>
          <p className="text-xs text-gray-400 mt-2">This may take 15–30 seconds</p>
        </div>
        <div className="flex gap-1 mt-2">
          {Array.from({ length: form.duration }).map((_, i) => (
            <div key={i} className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    );
  }

  if (step === 'result' && itinerary) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-teal-600 text-white px-4 pt-6 pb-8">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-5 h-5" />
            <h1 className="text-xl font-bold">{itinerary.request.destination}</h1>
          </div>
          <p className="text-teal-100 text-sm">{itinerary.request.duration} days · {itinerary.request.budget} budget</p>
          <div className="mt-3 bg-teal-700 rounded-xl p-3">
            <p className="text-xs text-teal-200 uppercase tracking-wide font-semibold mb-1">Estimated Total</p>
            <p className="text-white font-bold">{itinerary.totalBudget}</p>
          </div>
        </div>

        <div className="flex-1 px-4 -mt-4 space-y-3 pb-24">
          {/* Day cards */}
          {itinerary.days.map((day, i) => (
            <DayCard key={day.day} plan={day} defaultOpen={i === 0} />
          ))}

          {/* Essential Tips */}
          {itinerary.essentialTips.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                Essential Tips
              </h2>
              <ul className="space-y-2">
                {itinerary.essentialTips.map((tip, i) => (
                  <li key={i} className="text-sm text-gray-700">{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Emergency Contacts */}
          {itinerary.emergencyContacts.length > 0 && (
            <div className="bg-red-50 rounded-2xl border border-red-100 p-4">
              <h2 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Emergency Contacts
              </h2>
              <ul className="space-y-1">
                {itinerary.emergencyContacts.map((c, i) => (
                  <li key={i} className="text-sm text-red-700">{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Plan again */}
          <button
            onClick={() => { setStep('form'); setItinerary(null); }}
            className="w-full py-3 border-2 border-teal-600 text-teal-600 rounded-2xl font-semibold hover:bg-teal-50 transition-colors"
          >
            Plan Another Trip
          </button>
        </div>
      </div>
    );
  }

  // Form
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-600" />
          <h1 className="text-lg font-bold text-gray-800">Plan My Trip</h1>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">AI-powered itinerary for China travel</p>
      </div>

      <div className="flex-1 px-4 py-4 space-y-5 pb-24">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Destination */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Destination</label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {DESTINATIONS.map(d => (
              <button
                key={d}
                onClick={() => setForm(prev => ({ ...prev, destination: d }))}
                className={`py-2 px-3 rounded-xl text-sm font-medium border transition-colors ${
                  form.destination === d
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-teal-300'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Or type a city..."
            value={DESTINATIONS.includes(form.destination) ? '' : form.destination}
            onChange={e => setForm(prev => ({ ...prev, destination: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Duration: <span className="text-teal-600">{form.duration} days</span>
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={form.duration}
            onChange={e => setForm(prev => ({ ...prev, duration: Number(e.target.value) }))}
            className="w-full accent-teal-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 day</span><span>10 days</span>
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Budget</label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { value: 'budget', label: '💰 Budget', sub: '¥200-400/day' },
              { value: 'mid', label: '✨ Mid-range', sub: '¥400-800/day' },
              { value: 'luxury', label: '👑 Luxury', sub: '¥800+/day' },
            ] as const).map(opt => (
              <button
                key={opt.value}
                onClick={() => setForm(prev => ({ ...prev, budget: opt.value }))}
                className={`py-2 px-2 rounded-xl text-center border transition-colors ${
                  form.budget === opt.value
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-teal-300'
                }`}
              >
                <p className="text-sm font-medium">{opt.label}</p>
                <p className={`text-xs mt-0.5 ${form.budget === opt.value ? 'text-teal-100' : 'text-gray-400'}`}>{opt.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Interests</label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(interest => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  form.interests.includes(interest)
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Nationality */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nationality</label>
          <select
            value={form.nationality}
            onChange={e => setForm(prev => ({ ...prev, nationality: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-400 bg-white"
          >
            {[
              ['US', '🇺🇸 United States'],
              ['UK', '🇬🇧 United Kingdom'],
              ['AU', '🇦🇺 Australia'],
              ['CA', '🇨🇦 Canada'],
              ['DE', '🇩🇪 Germany'],
              ['FR', '🇫🇷 France'],
              ['JP', '🇯🇵 Japan'],
              ['KR', '🇰🇷 South Korea'],
              ['SG', '🇸🇬 Singapore'],
              ['OTHER', '🌍 Other'],
            ].map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        {/* Travel Dates (optional) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Travel Dates <span className="text-gray-400 font-normal">(optional)</span></label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={form.travelDates?.start || ''}
              onChange={e => setForm(prev => ({ ...prev, travelDates: { start: e.target.value, end: prev.travelDates?.end || '' } }))}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
            />
            <input
              type="date"
              value={form.travelDates?.end || ''}
              onChange={e => setForm(prev => ({ ...prev, travelDates: { start: prev.travelDates?.start || '', end: e.target.value } }))}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
            />
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={!form.destination || form.interests.length === 0}
          className="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold text-base hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Generate My Itinerary
        </button>
      </div>
    </div>
  );
}
