'use client';

import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import BottomNav from '@/components/BottomNav';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

// 动态导入 - 按需加载，减少初始包体积
const ChatView = dynamic(
  () => import('@/components/views/ChatView/index'),
  { 
    loading: () => <LoadingSkeleton type="chat" />,
    ssr: false,
  }
);

const TripsView = dynamic(
  () => import('@/components/views/TripsView'),
  { 
    loading: () => <LoadingSkeleton type="trips" />,
    ssr: false,
  }
);

const FoodView = dynamic(
  () => import('@/components/views/FoodView'),
  { 
    loading: () => <LoadingSkeleton type="food" />,
    ssr: false,
  }
);

const TransportView = dynamic(
  () => import('@/components/views/TransportView'),
  { 
    loading: () => <LoadingSkeleton type="transport" />,
    ssr: false,
  }
);

const ProfileView = dynamic(
  () => import('@/components/views/ProfileView'),
  { 
    loading: () => <LoadingSkeleton type="profile" />,
    ssr: false,
  }
);

type Tab = 'chat' | 'trips' | 'food' | 'transport' | 'profile';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  const renderView = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatView />;
      case 'trips':
        return <TripsView />;
      case 'food':
        return <FoodView />;
      case 'transport':
        return <TransportView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <ChatView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main>
        <Suspense fallback={<LoadingSkeleton type={activeTab} />}>
          {renderView()}
        </Suspense>
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
