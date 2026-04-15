"use client";

import React, { useState, Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import HeroSection from "@/components/ui/HeroSection";
import type { HeroFeature } from "@/components/ui/HeroSection";
import { useClientI18n } from "@/lib/i18n/client";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ESSENTIALS_DATA } from "@/data/essentials";

// 动态导入 - 按需加载，减少初始包体积
const ChatView = dynamic(() => import("@/components/views/ChatView/index"), {
  loading: () => <LoadingSkeleton type="chat" />,
  ssr: false,
});

const TripsView = dynamic(() => import("@/components/views/TripsView"), {
  loading: () => <LoadingSkeleton type="trips" />,
  ssr: false,
});

const FoodView = dynamic(() => import("@/components/views/FoodView"), {
  loading: () => <LoadingSkeleton type="food" />,
  ssr: false,
});

const TransportView = dynamic(
  () => import("@/components/views/TransportView"),
  {
    loading: () => <LoadingSkeleton type="transport" />,
    ssr: false,
  },
);

const ProfileView = dynamic(() => import("@/components/views/ProfileView"), {
  loading: () => <LoadingSkeleton type="profile" />,
  ssr: false,
});

const EssentialsView = dynamic(
  () => import("@/components/views/EssentialsView"),
  {
    loading: () => <LoadingSkeleton type="transport" />,
    ssr: false,
  },
);

const FoodEncyclopediaView = dynamic(
  () => import("@/components/views/FoodEncyclopediaView"),
  {
    loading: () => <LoadingSkeleton type="food" />,
    ssr: false,
  },
);

const HotelView = dynamic(() => import("@/components/views/HotelView"), {
  loading: () => <LoadingSkeleton type="transport" />,
  ssr: false,
});

const TimelineView = dynamic(
  () => import("@/components/views/TimelineView"),
  {
    loading: () => <LoadingSkeleton type="transport" />,
    ssr: false,
  },
);

const ExploreView = dynamic(
  () => import("@/components/views/ExploreView"),
  {
    loading: () => <LoadingSkeleton type="food" />,
    ssr: false,
  },
);

const ItineraryView = dynamic(
  () => import("@/components/views/ItineraryView"),
  {
    loading: () => <LoadingSkeleton type="trips" />,
    ssr: false,
  },
);

// 使用 const assertions 定义 Tab 值，提高类型安全性
const TAB_VALUES = ["chat", "trips", "food", "food-encyclopedia", "transport", "essentials", "hotels", "timeline", "profile", "explore", "itinerary"] as const;
type Tab = typeof TAB_VALUES[number];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [showHero, setShowHero] = useState(true);
  const { t, locale } = useClientI18n();

  // Random tip from essentials data
  const todaysTip = React.useMemo(() => {
    const allTips = Object.values(ESSENTIALS_DATA).flatMap((section) =>
      section.tips.map((tip) => ({ ...tip, sectionIcon: section.icon }))
    );
    return allTips[Math.floor(Math.random() * allTips.length)];
  }, []);

  // Support ?tab= query param for redirects from /chat, /food, /trips
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab') as Tab;
    if (tab && TAB_VALUES.includes(tab)) {
      setActiveTab(tab);
      setShowHero(false);
    }
  }, []);

  // 使用 useMemo 缓存渲染结果，locale 变化时也需要重新渲染
  const renderView = React.useMemo(() => {
    switch (activeTab) {
      case "chat":
        return <ChatView />;
      case "trips":
        return <TripsView />;
      case "food":
        return <FoodView />;
      case "food-encyclopedia":
        return <FoodEncyclopediaView />;
      case "transport":
        return <TransportView />;
      case "essentials":
        return <EssentialsView />;
      case "hotels":
        return <HotelView />;
      case "timeline":
        return <TimelineView />;
      case "explore":
        return <ExploreView onNavigate={(tab) => setActiveTab(tab)} />;
      case "itinerary":
        return <ItineraryView />;
      case "profile":
        return <ProfileView />;
      default:
        return <ChatView />;
    }
  }, [activeTab, locale]);

  // 处理 Hero CTA 点击 - 切换到 Chat tab
  const handleHeroCtaClick = () => {
    setActiveTab("chat");
    setShowHero(false);
  };

  const heroFeatures: HeroFeature[] = [
    { label: "✨ AI Trip Planning", onClick: () => { setActiveTab("trips"); setShowHero(false); } },
    { label: "🍜 Local Food", onClick: () => { setActiveTab("food"); setShowHero(false); } },
    { label: "🚇 Transport Guide", onClick: () => { setActiveTab("transport"); setShowHero(false); } },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Language Switcher - fixed top-right */}
      <div className="fixed top-3 right-3 z-50">
        <LanguageSwitcher variant="compact" className="bg-white/90 backdrop-blur-sm shadow-sm rounded-lg" />
      </div>
      {/* Hero Section - 仅在 Chat tab 显示 */}
      {showHero && activeTab === "chat" && (
        <>
          <HeroSection
            title={t("HomePage.title")}
            subtitle={t("HomePage.subtitle")}
            ctaText={t("HomePage.cta")}
            onCtaClick={handleHeroCtaClick}
            gradient="from-teal-600 to-teal-500"
            features={heroFeatures}
          />
          {/* Today's Tip */}
          {todaysTip && (
            <div className="mx-4 -mt-3 mb-2 bg-white rounded-xl shadow-md border border-teal-100 p-4 flex gap-3 items-start z-10 relative">
              <span className="text-2xl flex-shrink-0">{todaysTip.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-0.5">Today&apos;s Tip</p>
                <p className="text-base font-semibold text-gray-800">{todaysTip.title}</p>
                <p className="text-sm text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{todaysTip.content}</p>
              </div>
            </div>
          )}

          {/* Quick Start Demo */}
          <div className="px-4 mb-4">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-4 text-white">
              <p className="text-base font-medium mb-1">✈️ Try it now — no sign up needed</p>
              <p className="text-sm opacity-90 mb-3">&ldquo;I&apos;m landing in Shanghai tomorrow, what should I do first?&rdquo;</p>
              <button
                onClick={handleHeroCtaClick}
                className="inline-block bg-amber-400 hover:bg-amber-500 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-colors"
              >
                Ask AI Now →
              </button>
            </div>
          </div>

          {/* Traveler Stories */}
          <section className="px-4 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3">💬 Real Traveler Stories</h2>
            <div className="space-y-3">
              {[
                {
                  name: "Sarah M.",
                  flag: "🇺🇸",
                  city: "Shanghai",
                  date: "April 2026",
                  story: "Landed at Pudong at midnight. Set up Alipay in 20 minutes using the AI guide. Took the Maglev to the city — total cost ¥55. Couldn't have done it without this app.",
                  tag: "Payment Setup"
                },
                {
                  name: "James K.",
                  flag: "🇬🇧",
                  city: "Beijing",
                  date: "March 2026",
                  story: "Asked the AI for a 3-day Beijing itinerary avoiding tourist traps. Got a detailed plan with local restaurants and metro routes. The hutong food recommendations were spot on.",
                  tag: "Itinerary"
                },
                {
                  name: "Yuki T.",
                  flag: "🇯🇵",
                  city: "Chengdu",
                  date: "April 2026",
                  story: "Needed a vegetarian-friendly hot pot place in Chengdu. The AI found one immediately and even told me how to ask for no meat in Chinese. Perfect trip.",
                  tag: "Food Guide"
                }
              ].map((s) => (
                <div key={s.name} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{s.flag}</span>
                      <span className="font-semibold text-gray-800 text-base">{s.name}</span>
                      <span className="text-gray-400 text-sm">· {s.city}</span>
                    </div>
                    <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">{s.tag}</span>
                  </div>
                  <p className="text-base text-gray-600 leading-relaxed">&ldquo;{s.story}&rdquo;</p>
                  <p className="text-xs text-gray-400 mt-2">{s.date}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
      
      <main role="main">
        <Suspense fallback={<LoadingSkeleton type={activeTab} />}>
          {renderView}
        </Suspense>
      </main>
      <PWAInstallPrompt />
      <Footer />
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
