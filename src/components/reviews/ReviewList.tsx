'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ReviewCard, { type Review } from './ReviewCard';
import { Star } from 'lucide-react';

interface ReviewListProps {
  placeId: string;
  placeName?: string;
}

type SortKey = 'created_at' | 'rating';

const PAGE_SIZE = 5;

// In-memory store for demo (no Supabase configured)
const inMemoryReviews: Review[] = [];

async function fetchReviews(
  placeId: string,
  sort: SortKey,
  page: number
): Promise<{ data: Review[]; hasMore: boolean }> {
  // Try Supabase if configured
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
    const from = page * PAGE_SIZE;
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('place_id', placeId)
      .order(sort, { ascending: sort === 'rating' ? false : false })
      .range(from, from + PAGE_SIZE - 1);
    if (!error && data) {
      return { data: data as Review[], hasMore: data.length === PAGE_SIZE };
    }
  }

  // Fallback: in-memory
  const filtered = inMemoryReviews
    .filter((r) => r.place_id === placeId)
    .sort((a, b) =>
      sort === 'rating'
        ? b.rating - a.rating
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  const slice = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  return { data: slice, hasMore: slice.length === PAGE_SIZE };
}

export function addInMemoryReview(review: Review) {
  inMemoryReviews.unshift(review);
}

export default function ReviewList({ placeId, placeName }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sort, setSort] = useState<SortKey>('created_at');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(
    async (reset = false) => {
      setLoading(true);
      const currentPage = reset ? 0 : page;
      const { data, hasMore: more } = await fetchReviews(placeId, sort, currentPage);
      setReviews((prev) => (reset ? data : [...prev, ...data]));
      setHasMore(more);
      if (!reset) setPage((p) => p + 1);
      setLoading(false);
    },
    [placeId, sort, page]
  );

  useEffect(() => {
    setPage(0);
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeId, sort]);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-900">Reviews</h3>
          {avgRating && (
            <div className="flex items-center gap-1 text-sm text-amber-500 font-semibold">
              <Star className="w-4 h-4 fill-amber-400" />
              {avgRating}
              <span className="text-gray-400 font-normal">({reviews.length})</span>
            </div>
          )}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 bg-white"
        >
          <option value="created_at">Latest</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* List */}
      {loading && reviews.length === 0 ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-24 animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          No reviews yet. Be the first to share your experience!
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}

      {hasMore && (
        <button
          onClick={() => load(false)}
          disabled={loading}
          className="w-full py-2.5 text-sm text-teal-600 border border-teal-200 rounded-xl hover:bg-teal-50 transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Load more'}
        </button>
      )}
    </div>
  );
}
