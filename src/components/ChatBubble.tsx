import React from 'react';
import TripCard from './trips/TripCard';
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
          <div className="mt-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-100">
            <h4 className="font-bold text-gray-900 text-sm mb-1">{message.tripPreview.title}</h4>
            <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
              <span>⏱️ {message.tripPreview.duration}</span>
              <span>💰 {message.tripPreview.budget}</span>
              <span>👥 {message.tripPreview.people}人</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {message.tripPreview.tags.map((tag, i) => (
                <span key={i} className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            {onTripView && (
              <button
                onClick={onTripView}
                className="w-full py-2 bg-emerald-500 text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
              >
                查看详情
              </button>
            )}
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
