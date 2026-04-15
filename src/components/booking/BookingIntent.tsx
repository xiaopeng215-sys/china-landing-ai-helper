"use client";

import React, { useState } from "react";
import { buildBookingLink, buildKlookLink } from "@/lib/affiliate";
import { trackEvent } from "@/lib/analytics/events";

export interface BookingIntentProps {
  placeName: string;
  placeType?: "hotel" | "attraction" | "restaurant";
  city: string;
  userId?: string;
  /** Override the affiliate URL; if omitted, one is auto-generated */
  affiliateUrl?: string;
  /** Label shown on the trigger button */
  buttonLabel?: string;
  buttonClassName?: string;
}

interface FormState {
  checkIn: string;
  checkOut: string;
  adults: number;
  email: string;
}

const DEFAULT_FORM: FormState = {
  checkIn: "",
  checkOut: "",
  adults: 1,
  email: "",
};

export function BookingIntent({
  placeName,
  placeType = "hotel",
  city,
  userId,
  affiliateUrl,
  buttonLabel = "Book Now",
  buttonClassName,
}: BookingIntentProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);

  function resolveAffiliateUrl(f: FormState): string {
    if (affiliateUrl) return affiliateUrl;
    if (placeType === "hotel") {
      return buildBookingLink({
        city,
        checkIn: f.checkIn || undefined,
        checkOut: f.checkOut || undefined,
        adults: f.adults,
      });
    }
    return buildKlookLink({ city, category: "attraction" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const url = resolveAffiliateUrl(form);

    // Track booking click
    trackEvent('click_booking', { placeName, placeType, city, platform: 'booking' });

    // Fire-and-forget: record intent, don't block redirect
    fetch("/api/booking/intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId ?? null,
        place_name: placeName,
        place_type: placeType,
        check_in: form.checkIn || null,
        check_out: form.checkOut || null,
        adults: form.adults,
        email: form.email || null,
        affiliate_url: url,
      }),
    }).catch(() => {}); // fail silently

    // Open affiliate link
    window.open(url, "_blank", "noopener,noreferrer");

    setOpen(false);
    setForm(DEFAULT_FORM);
    setSubmitting(false);
  }

  const defaultBtnCls =
    "flex-1 text-center bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm";

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className={buttonClassName ?? defaultBtnCls}
        type="button"
      >
        {buttonLabel}
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-5 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-white font-bold text-base">Book {placeName}</h2>
                <p className="text-teal-100 text-xs mt-0.5">
                  Fill in your details to continue
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/80 hover:text-white text-xl leading-none"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-5 py-4 flex flex-col gap-4">
              {/* Dates */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={form.checkIn}
                    onChange={(e) => setForm((f) => ({ ...f, checkIn: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={form.checkOut}
                    min={form.checkIn || undefined}
                    onChange={(e) => setForm((f) => ({ ...f, checkOut: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
              </div>

              {/* Adults */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Guests
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, adults: Math.max(1, f.adults - 1) }))}
                    className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 flex items-center justify-center text-lg leading-none"
                  >
                    −
                  </button>
                  <span className="text-sm font-semibold w-6 text-center">{form.adults}</span>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, adults: Math.min(10, f.adults + 1) }))}
                    className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 flex items-center justify-center text-lg leading-none"
                  >
                    +
                  </button>
                  <span className="text-xs text-gray-400 ml-1">adult{form.adults !== 1 ? "s" : ""}</span>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Email <span className="text-gray-400 font-normal">(optional — for trip reminders)</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              {/* CTA buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                >
                  Booking.com →
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => {
                    const url = buildKlookLink({ city, category: "attraction" });
                    trackEvent('click_booking', { placeName, placeType, city, platform: 'klook' });
                    fetch("/api/booking/intent", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        user_id: userId ?? null,
                        place_name: placeName,
                        place_type: placeType,
                        check_in: form.checkIn || null,
                        check_out: form.checkOut || null,
                        adults: form.adults,
                        email: form.email || null,
                        affiliate_url: url,
                      }),
                    }).catch(() => {});
                    window.open(url, "_blank", "noopener,noreferrer");
                    setOpen(false);
                    setForm(DEFAULT_FORM);
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                >
                  Klook →
                </button>
              </div>

              <p className="text-center text-xs text-gray-400">
                You'll be redirected to a partner site. We may earn a commission.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
