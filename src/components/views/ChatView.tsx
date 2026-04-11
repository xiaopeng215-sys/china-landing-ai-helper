'use client';

import React, { useState } from 'react';
import ChatBubble from '@/components/ChatBubble';
import Footer from '@/components/layout/Footer';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { ErrorMessage } from '@/components/ui/ErrorBoundary';
import type { Message } from '@/lib/types';

interface ChatViewProps {
  messages: Message[];
  loading: boolean;
  error: Error | null;
  onSendMessage: (content: string) => void;
  onTripView: () => void;
}

export default function ChatView({
  messages,
  loading,
  error,
  onSendMessage,
  onTripView,
}: ChatViewProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {loading ? (
          <ListSkeleton count={3} />
        ) : error ? (
          <ErrorMessage message={error.message} onRetry={() => window.location.reload()} />
        ) : (
          messages.map((msg) => <ChatBubble key={msg.id} message={msg} onTripView={onTripView} />)
        )}
      </div>
      <Footer className="fixed bottom-[68px] left-0 right-0">
        <div className="flex gap-2 max-w-lg mx-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="💬 输入消息..."
            className="flex-1 px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleSend}
            className="px-6 py-3 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors"
          >
            发送
          </button>
        </div>
      </Footer>
    </div>
  );
}
