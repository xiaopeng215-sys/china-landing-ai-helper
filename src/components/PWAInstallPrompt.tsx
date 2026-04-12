'use client';

import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if previously dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const now = Date.now();
      // Don't show again for 7 days
      if (now - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after 3 seconds
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
    };

    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowPrompt(false);
        setIsInstalled(true);
      } else {
        // User dismissed, remember for 7 days
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
        setShowPrompt(false);
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Install prompt error:', error);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 sm:p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ff5a5f] to-[#ff3b3f] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="font-bold text-[#484848] mb-1">
              安装应用
            </h3>
            <p className="text-sm text-[#767676] mb-3">
              将 China AI Helper 添加到主屏幕，快速访问您的旅行助手
            </p>

            {/* Benefits */}
            <div className="flex gap-3 mb-4">
              <div className="flex items-center gap-1 text-xs text-[#767676]">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>离线访问</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#767676]">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>快速启动</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#767676]">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>消息通知</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
              >
                立即安装
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 bg-gray-100 text-[#767676] rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all"
              >
                稍后再说
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-[#767676] hover:text-[#484848] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
