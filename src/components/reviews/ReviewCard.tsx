'use client';

import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';

export interface Review {
  id: string;
  user_id: string;
  place_id: string;
  place_name: string;
  rating: number;
  content: string;
  helpful_count: number;
  created_at: string;
  user_name?: string;
  user_avatar?: string;
}

interface ReviewCardProps {
  review: Review;
  onVote?: (reviewId: string, helpful: boolean) => void;
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const sz = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${sz} ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
        />
      ))}
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export { StarRating };

export default function ReviewCard({ review, onVote }: ReviewCardProps) {
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count);

  const initials = (review.user_name ?? 'A')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleVote = (helpful: boolean) => {
    if (voted) return;
    setVoted(helpful ? 'up' : 'down');
    if (helpful) setHelpfulCount((c) => c + 1);
    onVote?.(review.id, helpful);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {review.user_avatar ? (
          <img
            src={review.user_avatar}
            alt={review.user_name ?? 'User'}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {review.user_name ?? 'Anonymous'}
            </p>
            <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo(review.created_at)}</span>
          </div>
          <StarRating rating={review.rating} />
        </div>
      </div>

      {/* Content */}
      {review.content && (
        <p className="text-sm text-gray-700 leading-relaxed mb-3">{review.content}</p>
      )}

      {/* Votes */}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
        <span className="text-xs text-gray-400">Helpful?</span>
        <button
          onClick={() => handleVote(true)}
          disabled={!!voted}
          className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-colors ${
            voted === 'up'
              ? 'bg-teal-100 text-teal-700'
              : 'bg-gray-100 text-gray-500 hover:bg-teal-50 hover:text-teal-600 disabled:opacity-50'
          }`}
        >
          <ThumbsUp className="w-3 h-3" />
          {helpfulCount}
        </button>
        <button
          onClick={() => handleVote(false)}
          disabled={!!voted}
          className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-colors ${
            voted === 'down'
              ? 'bg-red-100 text-red-600'
              : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 disabled:opacity-50'
          }`}
        >
          <ThumbsDown className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
