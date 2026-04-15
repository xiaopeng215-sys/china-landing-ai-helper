'use client';

import { useEffect, useState } from 'react';

const VISIT_COUNT_KEY = 'pwa_visit_count';
const PROMPT_DISMISSED_KEY = 'pwa_push_dismissed';

export default function PushNotificationPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only run in browser with Notification API support
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    // Already granted or denied — no need to prompt
    if (Notification.permission !== 'default') return;
    // User already dismissed
    if (localStorage.getItem(PROMPT_DISMISSED_KEY)) return;

    // Increment visit count
    const count = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || '0', 10) + 1;
    localStorage.setItem(VISIT_COUNT_KEY, String(count));

    // Show after 3rd visit
    if (count >= 3) {
      setShow(true);
    }
  }, []);

  const handleAllow = async () => {
    setShow(false);
    localStorage.setItem(PROMPT_DISMISSED_KEY, '1');
    await Notification.requestPermission();
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem(PROMPT_DISMISSED_KEY, '1');
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-sm mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex items-start gap-3">
      <div className="text-2xl">✈️</div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">Get travel tips for your China trip</p>
        <p className="text-xs text-gray-500 mt-0.5">Enable notifications to stay updated.</p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleAllow}
            className="flex-1 bg-teal-600 text-white text-xs font-medium py-1.5 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Allow
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 bg-gray-100 text-gray-600 text-xs font-medium py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
