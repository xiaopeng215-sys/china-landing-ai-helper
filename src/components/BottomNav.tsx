"use client";
import React from "react";
import { useClientI18n } from "@/lib/i18n/client";

type Tab = "chat" | "trips" | "food" | "transport" | "profile";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tabId: Tab) => void;
}

/**
 * 底部固定导航栏
 * 移动优先设计，5 个核心 Tab
 */
export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t } = useClientI18n();
  const navItems: { id: Tab; label: string; icon: string }[] = [
    { id: "chat", label: t("NavBar.chat", "Chat"), icon: "💬" },
    { id: "trips", label: t("NavBar.trips", "Trips"), icon: "📅" },
    { id: "food", label: t("NavBar.food", "Food"), icon: "🍜" },
    { id: "transport", label: t("NavBar.transport", "Transport"), icon: "🚇" },
    { id: "profile", label: t("NavBar.profile", "Profile"), icon: "👤" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom" role="navigation" aria-label={t('NavBar.navigation', 'Navigation')}>
      <div className="flex items-center justify-around py-2 max-w-lg mx-auto safe-area-bottom">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center w-full py-2 px-1 transition-colors tap-feedback ${
                isActive
                  ? "text-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              type="button"
              aria-current={isActive ? "page" : undefined}
            >
              <span className="text-[20px] mb-1" aria-hidden="true">
                {item.icon}
              </span>
              <span className="text-[11px] font-medium leading-tight">
                {item.label}
              </span>
              {isActive && (
                <div
                  className="w-1 h-1 bg-orange-600 rounded-full mt-1"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
