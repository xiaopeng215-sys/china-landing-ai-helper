'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Share2, Twitter, Facebook, Link, MessageCircle, Check } from 'lucide-react';

interface ShareButtonProps {
  url?: string;
  title?: string;
  text?: string;
  /** compact icon-only mode */
  compact?: boolean;
  className?: string;
}

export default function ShareButton({
  url,
  title = 'Check out this itinerary on TravelerLocal.ai',
  text = 'Discover amazing travel itineraries for China!',
  compact = false,
  className = '',
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const shareUrl = url ?? (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(text);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        return;
      } catch {
        // fallback to menu
      }
    }
    setOpen((o) => !o);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => { setCopied(false); setOpen(false); }, 2000);
  };

  const isMobile = typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);

  const options = [
    {
      label: 'Twitter / X',
      icon: <Twitter className="w-4 h-4" />,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:bg-sky-50 hover:text-sky-600',
    },
    {
      label: 'Facebook',
      icon: <Facebook className="w-4 h-4" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-blue-50 hover:text-blue-600',
    },
    ...(isMobile
      ? [{
          label: 'WhatsApp',
          icon: <MessageCircle className="w-4 h-4" />,
          href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
          color: 'hover:bg-green-50 hover:text-green-600',
        }]
      : []),
  ];

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={handleNativeShare}
        className={`flex items-center gap-1.5 text-sm font-semibold rounded-xl transition-colors ${
          compact
            ? 'p-2 bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-teal-600'
            : 'px-4 py-2.5 bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-teal-600'
        }`}
        aria-label="Share"
      >
        <Share2 className="w-4 h-4" />
        {!compact && <span>Share</span>}
      </button>

      {open && (
        <div className="absolute right-0 bottom-full mb-2 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {options.map((opt) => (
            <a
              key={opt.label}
              href={opt.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 ${opt.color} transition-colors`}
            >
              {opt.icon}
              {opt.label}
            </a>
          ))}
          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
          >
            {copied ? <Check className="w-4 h-4 text-teal-600" /> : <Link className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
      )}
    </div>
  );
}
