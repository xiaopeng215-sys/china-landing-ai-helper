import React from 'react';
import TripCard from './TripCard';
import { Skeleton } from './ui';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  tripPreview?: {
    title: string;
    duration: string;
    budget: string;
    people: number;
    tags: string[];
  };
}

interface ChatBubbleProps {
  message: Message;
  onTripView?: () => void;
  isLoading?: boolean;
}

/**
 * Wanderlog 风格聊天消息气泡
 * 支持富文本和行程预览卡片
 */
export default function ChatBubble({ message, onTripView, isLoading = false }: ChatBubbleProps) {
  // 加载状态显示骨架屏
  if (isLoading) {
    const isUser = message?.type === 'user';
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser ? 'bg-blue-100' : 'bg-gray-100'
        }`}>
          <Skeleton className="mb-2" height="0.75rem" width="80%" />
          <Skeleton className="mb-2" height="0.75rem" width="60%" />
          <Skeleton height="0.75rem" width="40%" />
        </div>
      </div>
    );
  }

  const isUser = message.type === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-sm'
            : 'bg-white text-gray-900 shadow-sm border border-gray-100 rounded-bl-sm'
        }`}
      >
        {/* 消息内容 */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>

        {/* 行程预览卡片（仅 AI 消息） */}
        {!isUser && message.tripPreview && (
          <div className="mt-3">
            <TripCard
              title={message.tripPreview.title}
              duration={message.tripPreview.duration}
              budget={message.tripPreview.budget}
              people={message.tripPreview.people}
              tags={message.tripPreview.tags}
              onView={onTripView}
            />
          </div>
        )}

        {/* 时间戳 */}
        <div
          className={`text-xs mt-2 ${
            isUser ? 'text-blue-100' : 'text-gray-400'
          }`}
        >
          {message.timestamp}
        </div>
      </div>
    </div>
  );
}
