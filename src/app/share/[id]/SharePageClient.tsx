'use client';

import React, { useState } from 'react';
import { Calendar, DollarSign, Star, Download, Share2, MapPin, Clock, ChevronDown, ChevronUp, Twitter, Facebook, MessageCircle, Link, Check } from 'lucide-react';
import type { ItineraryRoute } from '@/data/types';
import { downloadItineraryPDF } from '@/lib/itinerary/pdf-generator';

const TEAL = '#0D9488';

interface Props {
  trip: ItineraryRoute;
}

export default function SharePageClient({ trip }: Props) {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = `${trip.titleEn ?? trip.title} | TravelerLocal.ai`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);
  const isMobile = typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await downloadItineraryPDF(trip);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover */}
      <div style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #0f766e 100%)` }} className="text-white px-4 pt-12 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-3 opacity-80">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{trip.cityEn}, China</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">{trip.titleEn ?? trip.title}</h1>
          <p className="text-sm opacity-85 mb-5">{trip.subtitleEn ?? trip.subtitle}</p>

          {/* Stats */}
          <div className="flex gap-3 flex-wrap">
            <div className="bg-white/20 rounded-xl px-4 py-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-semibold">{trip.days} Days</span>
            </div>
            <div className="bg-white/20 rounded-xl px-4 py-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm font-semibold">{trip.budget}</span>
            </div>
            <div className="bg-white/20 rounded-xl px-4 py-2 flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span className="text-sm font-semibold">{trip.bestSeasonEn ?? trip.bestSeason.split('/')[0]}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {(trip.themeEn ?? trip.theme).map((tag) => (
              <span key={tag} className="bg-white/25 rounded-full px-3 py-1 text-xs">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm px-4 py-3">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold transition-opacity disabled:opacity-60"
            style={{ background: TEAL }}
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Generating...' : 'Download PDF'}
          </button>

          {/* Share dropdown */}
          <div className="relative">
            <button
              onClick={() => setShareOpen((o) => !o)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors"
              style={{ borderColor: TEAL, color: TEAL }}
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            {shareOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                  target="_blank" rel="noopener noreferrer"
                  onClick={() => setShareOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                >
                  <Twitter className="w-4 h-4" /> Twitter / X
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                  target="_blank" rel="noopener noreferrer"
                  onClick={() => setShareOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <Facebook className="w-4 h-4" /> Facebook
                </a>
                {isMobile && (
                  <a
                    href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
                    target="_blank" rel="noopener noreferrer"
                    onClick={() => setShareOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                )}
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
                >
                  {copied ? <Check className="w-4 h-4 text-teal-600" /> : <Link className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy link'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Description */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-2">About This Trip</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{trip.descriptionEn ?? trip.description}</p>
        </div>

        {/* Day Plans */}
        <div>
          <h2 className="font-bold text-gray-900 mb-3">Day-by-Day Itinerary</h2>
          <div className="space-y-3">
            {trip.dayPlans.map((day) => (
              <div key={day.day} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                  onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-white text-xs font-bold rounded-lg px-2.5 py-1"
                      style={{ background: TEAL }}
                    >
                      Day {day.day}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{day.titleEn ?? day.title}</p>
                      <p className="text-xs text-gray-500">{day.themeEn ?? day.theme}</p>
                    </div>
                  </div>
                  {expandedDay === day.day ? (
                    <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {expandedDay === day.day && (
                  <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
                    {day.activities.map((activity, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="text-xs font-semibold pt-0.5 min-w-[44px]" style={{ color: TEAL }}>
                          {activity.time}
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-xl p-3 border-l-2" style={{ borderColor: TEAL }}>
                          <p className="font-semibold text-gray-900 text-sm">{activity.nameEn}</p>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            {activity.descriptionEn ?? activity.description}
                          </p>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <span className="text-xs px-2 py-0.5 rounded-md font-medium" style={{ background: '#CCFBF1', color: TEAL }}>
                              {activity.priceEn ?? activity.price}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-md font-medium bg-gray-100 text-gray-600 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {activity.durationEn ?? activity.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {day.tips.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                        <p className="text-xs font-semibold text-amber-700 mb-1">💡 Tips</p>
                        <ul className="space-y-1">
                          {(day.tipsEn ?? day.tips).map((tip, i) => (
                            <li key={i} className="text-xs text-amber-600">• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Practical Info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-3">Practical Info</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '🚇', label: 'Transport', value: trip.practicalInfo.transport },
              { icon: '🌤️', label: 'Weather', value: trip.practicalInfo.weather },
              { icon: '🍜', label: 'Food', value: trip.practicalInfo.food },
              { icon: '🛡️', label: 'Safety', value: trip.practicalInfo.safety },
            ].map(({ icon, label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">{icon} {label}</p>
                <p className="text-xs text-gray-700 leading-relaxed">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className="rounded-2xl p-5 text-white text-center"
          style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #0f766e 100%)` }}
        >
          <p className="font-bold text-lg mb-1">Plan Your Own Trip</p>
          <p className="text-sm opacity-85 mb-4">Get a personalized itinerary with AI</p>
          <a
            href="/chat"
            className="inline-block bg-white font-semibold text-sm rounded-xl px-6 py-2.5 transition-opacity hover:opacity-90"
            style={{ color: TEAL }}
          >
            Start Planning →
          </a>
        </div>

        <p className="text-center text-xs text-gray-400 pb-4">
          Powered by <strong className="text-teal-600">TravelerLocal.ai</strong>
        </p>
      </div>
    </div>
  );
}
