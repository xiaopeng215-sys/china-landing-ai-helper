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
import DailyRecommendation from "@/components/home/DailyRecommendation";
import QuickActions from "@/components/home/QuickActions";

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

const ARView = dynamic(
  () => import("@/app/ar/page"),
  {
    loading: () => <LoadingSkeleton type="chat" />,
    ssr: false,
  },
);

// 使用 const assertions 定义 Tab 值，提高类型安全性
const TAB_VALUES = ["chat", "trips", "food", "food-encyclopedia", "transport", "essentials", "hotels", "timeline", "profile", "explore", "itinerary", "ar", "map"] as const;
type Tab = typeof TAB_VALUES[number];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [showHero, setShowHero] = useState(true);
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>();
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
        return <ChatView initialMessage={chatInitialMessage} onNavigate={(tab) => setActiveTab(tab as Tab)} />;
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
        return <ExploreView onNavigate={(tab) => setActiveTab(tab)} onAskAI={(msg) => { setChatInitialMessage(msg); setActiveTab('chat'); }} />;
      case "itinerary":
        return <ItineraryView />;
      case "ar":
        return <ARView />;
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

  const handleCitySelect = (city: string) => {
    setChatInitialMessage(`Tell me everything I need to know about visiting ${city} — top sights, food, transport, and tips.`);
    setActiveTab("chat");
    setShowHero(false);
  };

  const handleQuickAction = ({ message, tab }: { message?: string; tab?: string }) => {
    if (tab) {
      setActiveTab(tab as Tab);
      setShowHero(false);
    } else if (message) {
      setChatInitialMessage(message);
      setActiveTab("chat");
      setShowHero(false);
    }
  };

  const heroFeatures: HeroFeature[] = [
    { label: t("HomePage.heroFeatureTrip"), onClick: () => { setActiveTab("trips"); setShowHero(false); } },
    { label: t("HomePage.heroFeatureFood"), onClick: () => { setActiveTab("food"); setShowHero(false); } },
    { label: t("HomePage.heroFeatureTransport"), onClick: () => { setActiveTab("transport"); setShowHero(false); } },
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
                <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-0.5">{t('HomePage.todaysTip')}</p>
                <p className="text-base font-semibold text-gray-800">{todaysTip.title}</p>
                <p className="text-sm text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{todaysTip.content}</p>
              </div>
            </div>
          )}

          {/* Quick Start Demo */}
          <div className="px-4 mb-4">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-4 text-white">
              <p className="text-base font-medium mb-1">{t('HomePage.tryItNow')}</p>
              <p className="text-sm opacity-90 mb-3">&ldquo;{t('HomePage.tryItNowDesc')}&rdquo;</p>
              <button
                onClick={handleHeroCtaClick}
                className="inline-block bg-amber-400 hover:bg-amber-500 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-colors"
              >
                {t('HomePage.askAINow')}
              </button>
            </div>
          </div>

          {/* Daily Recommendation */}
          <DailyRecommendation onCitySelect={handleCitySelect} />

          {/* Quick Actions */}
          <QuickActions onAction={handleQuickAction} />

          {/* Traveler Stories */}
          <section className="px-4 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3">{t('HomePage.travelerStories')}</h2>
            <div className="space-y-3">
              {[
                {
                  name: t('HomePage.storySarahName'),
                  flag: "🇺🇸",
                  city: t('HomePage.storySarahCity'),
                  date: t('HomePage.storySarahDate'),
                  story: t('HomePage.storySarahText'),
                  tag: t('HomePage.storyPaymentTag')
                },
                {
                  name: t('HomePage.storyJamesName'),
                  flag: "🇬🇧",
                  city: t('HomePage.storyJamesCity'),
                  date: t('HomePage.storyJamesDate'),
                  story: t('HomePage.storyJamesText'),
                  tag: t('HomePage.storyItineraryTag')
                },
                {
                  name: t('HomePage.storyYukiName'),
                  flag: "🇯🇵",
                  city: t('HomePage.storyYukiCity'),
                  date: t('HomePage.storyYukiDate'),
                  story: t('HomePage.storyYukiText'),
                  tag: t('HomePage.storyFoodTag')
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
      {activeTab !== 'chat' && <Footer />}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
