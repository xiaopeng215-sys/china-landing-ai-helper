'use client';

import React, { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import ChatView from '@/components/views/ChatView';
import TripsView from '@/components/views/TripsView';
import FoodView from '@/components/views/FoodView';
import TransportView from '@/components/views/TransportView';
import ProfileView from '@/components/views/ProfileView';

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
      <main>{renderView()}</main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
