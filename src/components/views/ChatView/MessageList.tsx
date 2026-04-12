'use client';

import React from 'react';
import type { Message } from './types';

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function MessageList({ messages, messagesEndRef }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-center p-8">
        <div>
          <div className="text-6xl mb-4">💬</div>
          <p className="text-[#767676]">开始您的第一次对话</p>
          <p className="text-sm text-[#767676] mt-2">询问关于中国旅行的任何问题</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              message.role === 'user'
                ? 'bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white'
                : 'bg-white text-[#484848] shadow-md border border-gray-100'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/70' : 'text-[#767676]'}`}>
              {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
