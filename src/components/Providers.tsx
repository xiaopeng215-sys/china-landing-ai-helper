'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { registerServiceWorker, isPWAInstalled } from '@/lib/serviceWorker';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsPWA(isPWAInstalled());

    // Register service worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      registerServiceWorker();
    }
  }, []);

  // Listen for SW updates
  useEffect(() => {
    const handleSwUpdate = (event: CustomEvent) => {
      console.log('Service Worker update available');
      // Could show update prompt here
    };

    window.addEventListener('swUpdate', handleSwUpdate as EventListener);

    return () => {
      window.removeEventListener('swUpdate', handleSwUpdate as EventListener);
    };
  }, []);

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
