'use client';

import React, { useState } from 'react';
import { Download, Share2, Check } from 'lucide-react';
import type { ItineraryRoute } from '@/data/types';
import { downloadItineraryPDF } from '@/lib/itinerary/pdf-generator';

interface Props {
  trip: ItineraryRoute;
  className?: string;
}

export default function ItineraryExportButtons({ trip, className = '' }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await downloadItineraryPDF(trip);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShareLink = async () => {
    const shareUrl = `${window.location.origin}/share/${trip.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: trip.titleEn ?? trip.title, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // User cancelled share or clipboard failed
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        onClick={handleDownloadPDF}
        disabled={downloading}
        className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-xs font-semibold rounded-xl transition-colors"
        title="Download PDF"
      >
        <Download className="w-3.5 h-3.5" />
        {downloading ? 'Generating...' : 'PDF'}
      </button>

      <button
        onClick={handleShareLink}
        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border-2 transition-colors ${
          copied
            ? 'bg-teal-600 border-teal-600 text-white'
            : 'border-teal-600 text-teal-600 hover:bg-teal-50'
        }`}
        title="Copy share link"
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
        {copied ? 'Copied!' : 'Share'}
      </button>
    </div>
  );
}
