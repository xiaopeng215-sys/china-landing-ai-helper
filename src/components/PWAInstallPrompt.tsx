"use client";

import React, { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * PWA 安装提示组件
 * - 仅在支持 PWA 且未安装时显示
 * - 提供友好的安装引导
 */
export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 检查是否已安装
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // 检查是否曾经拒绝过安装
    const hasDismissed = localStorage.getItem("pwa-install-dismissed");
    if (hasDismissed) {
      return;
    }

    // 监听 beforeinstallprompt 事件
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // 延迟显示提示，避免打扰用户
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 监听安装成功
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setShowPrompt(false);
        setDeferredPrompt(null);
      }
    } catch (err) {
      console.error("Install prompt error:", err);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // 记住用户选择，30 天内不再显示
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-24 left-4 right-4 z-40 md:left-auto md:right-4 md:w-96">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 animate-slide-up">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">📲</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm mb-1">安装应用</h3>
            <p className="text-xs text-gray-600 mb-3">
              将 China AI Helper 添加到主屏幕，获得更好的使用体验
            </p>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all tap-feedback"
                type="button"
              >
                立即安装
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors tap-feedback"
                type="button"
              >
                稍后
              </button>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors tap-feedback"
            type="button"
            aria-label="关闭提示"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Features */}
        <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className="text-lg mb-1">⚡</div>
            <div className="text-[12px] text-gray-500">快速启动</div>
          </div>
          <div className="text-center">
            <div className="text-lg mb-1">📶</div>
            <div className="text-[12px] text-gray-500">离线使用</div>
          </div>
          <div className="text-center">
            <div className="text-lg mb-1">💾</div>
            <div className="text-[12px] text-gray-500">节省空间</div>
          </div>
        </div>
      </div>
    </div>
  );
}
