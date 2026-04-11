'use client';

import React from 'react';

interface TripDay {
  time: string;
  icon: string;
  title: string;
  desc: string;
  color: string;
}

interface Trip {
  id: string;
  city: string;
  days: number;
  rating: number;
  tags: string[];
  days_plan: TripDay[];
}

export default function TripsView() {
  const trips: Trip[] = [
    {
      id: '1',
      city: 'Shanghai',
      days: 4,
      rating: 4.9,
      tags: ['Modern', 'Food', 'Shopping'],
      days_plan: [
        { time: '09:00', icon: '🌉', title: 'The Bund', desc: 'Iconic skyline & photo spots', color: 'from-[#1a73e8] to-[#174ea6]' },
        { time: '10:30', icon: '🏛️', title: 'Yu Garden', desc: 'Classical Chinese garden · ¥40', color: 'from-[#fbbc04] to-[#ea8600]' },
        { time: '12:00', icon: '🥟', title: 'Nanxiang Steamed Bun', desc: 'Famous xiaolongbao · ¥60/pp', color: 'from-[#ff5a5f] to-[#e62e2e]' },
        { time: '14:00', icon: '🚴', title: 'Riverside Cycling', desc: '8km scenic route', color: 'from-[#34a853] to-[#2d8e47]' },
        { time: '18:00', icon: '🌃', title: 'Bund Night View', desc: 'Spectacular light show', color: 'from-[#a855f7] to-[#9333ea]' },
      ],
    },
    {
      id: '2',
      city: 'Beijing',
      days: 5,
      rating: 4.8,
      tags: ['History', 'Culture', 'Landmarks'],
      days_plan: [
        { time: '08:00', icon: '🏛️', title: 'Forbidden City', desc: 'Book in advance! · ¥60', color: 'from-[#dc2626] to-[#b91c1c]' },
        { time: '12:00', icon: '🦆', title: 'Peking Duck', desc: 'Quanjude Restaurant', color: 'from-[#f97316] to-[#ea580c]' },
        { time: '14:00', icon: '🏯', title: 'Temple of Heaven', desc: 'Ming Dynasty architecture', color: 'from-[#1a73e8] to-[#174ea6]' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-[#484848]">My Trips</h1>
          <p className="text-sm text-[#767676]">Plan your perfect China journey</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Create New Trip */}
        <div className="bg-gradient-to-br from-[#ff5a5f] to-[#ff3b3f] rounded-3xl shadow-xl p-6 text-white">
          <div className="text-center space-y-4">
            <div className="text-5xl">✈️</div>
            <h2 className="text-xl font-bold">Plan Your Trip</h2>
            <p className="text-white/90">AI-powered itinerary tailored to your preferences</p>
            <button className="w-full py-3 bg-white text-[#ff5a5f] rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
              Create New Itinerary
            </button>
          </div>
        </div>

        {/* Trip Cards */}
        {trips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            {/* Trip Header */}
            <div className="bg-gradient-to-r from-[#1a73e8] to-[#174ea6] p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{trip.city}</h3>
                  <p className="text-white/80">{trip.days} Days · {trip.tags.join(' · ')}</p>
                </div>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                  ⭐ {trip.rating}
                </span>
              </div>
            </div>

            {/* Day Plan */}
            <div className="p-6 space-y-4">
              {trip.days_plan.map((item, i) => (
                <div
                  key={i}
                  className="group flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-md transition-all duration-200 border border-gray-200"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-xl shadow-md flex-shrink-0 group-hover:shadow-lg transition-all`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-[#1a73e8]">{item.time}</span>
                      <span className="font-semibold text-[#484848]">{item.title}</span>
                    </div>
                    <div className="text-sm text-[#767676] truncate">{item.desc}</div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white rounded-xl text-[#1a73e8]">
                    →
                  </button>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 flex gap-3">
              <button className="flex-1 py-3 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                View Details
              </button>
              <button className="flex-1 py-3 bg-gray-100 text-[#484848] rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-200">
                Share
              </button>
            </div>
          </div>
        ))}

        {/* More Suggestions */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-[#484848] mb-4">More Destinations</h3>
          <div className="grid grid-cols-2 gap-3">
            {['Xi\'an', 'Guilin', 'Chengdu', 'Hangzhou'].map((city) => (
              <button
                key={city}
                className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 hover:border-[#ff5a5f] hover:shadow-md transition-all text-center"
              >
                <span className="text-2xl mb-2 block">📍</span>
                <span className="font-semibold text-[#484848]">{city}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
