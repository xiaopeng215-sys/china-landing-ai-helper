'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { addInMemoryReview } from './ReviewList';
import type { Review } from './ReviewCard';

interface ReviewFormProps {
  placeId: string;
  placeName: string;
  userId?: string;
  userName?: string;
  onSubmitted?: (review: Review) => void;
}

const MAX_CHARS = 500;

export default function ReviewForm({
  placeId,
  placeName,
  userId = 'anonymous',
  userName = 'Anonymous',
  onSubmitted,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a rating.'); return; }
    setError('');
    setSubmitting(true);

    const newReview: Review = {
      id: crypto.randomUUID(),
      user_id: userId,
      place_id: placeId,
      place_name: placeName,
      rating,
      content: content.trim(),
      helpful_count: 0,
      created_at: new Date().toISOString(),
      user_name: userName,
    };

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const isConfigured =
        supabaseUrl &&
        supabaseKey &&
        !supabaseUrl.includes('your-project') &&
        !supabaseKey.includes('your-anon-key');

      if (isConfigured) {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl!, supabaseKey!);
        const { error: dbErr } = await supabase.from('reviews').insert({
          user_id: newReview.user_id,
          place_id: newReview.place_id,
          place_name: newReview.place_name,
          rating: newReview.rating,
          content: newReview.content,
        });
        if (dbErr) throw dbErr;
      } else {
        addInMemoryReview(newReview);
      }

      setSubmitted(true);
      onSubmitted?.(newReview);
    } catch (err) {
      setError('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 text-center">
        <p className="text-2xl mb-2">🎉</p>
        <p className="font-semibold text-teal-800">Thanks for your review!</p>
        <p className="text-sm text-teal-600 mt-1">Your feedback helps other travelers.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
      <h3 className="font-bold text-gray-900">Write a Review</h3>

      {/* Star selector */}
      <div>
        <p className="text-xs text-gray-500 mb-1.5">Your rating</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(0)}
              className="p-0.5 transition-transform hover:scale-110"
              aria-label={`${s} star`}
            >
              <Star
                className={`w-7 h-7 transition-colors ${
                  s <= (hovered || rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-200'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Text */}
      <div>
        <p className="text-xs text-gray-500 mb-1.5">Your experience (optional)</p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Share what you liked or didn't like..."
          rows={3}
          className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
        />
        <p className="text-right text-xs text-gray-400 mt-1">
          {content.length}/{MAX_CHARS}
        </p>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-teal-600 text-white font-semibold rounded-xl text-sm hover:bg-teal-700 transition-colors disabled:opacity-60"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
