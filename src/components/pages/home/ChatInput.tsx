'use client';

import React, { useState } from 'react';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  image?: string;
  timestamp?: Date;
}

interface ChatInputProps {
  onSendMessage?: (message: string) => void;
  initialMessages?: Message[];
}

const DEFAULT_MESSAGES: Message[] = [
  { 
    role: 'assistant', 
    content: '👋 欢迎来到中国！我是你的旅行助手，可以帮你规划行程、推荐美食、查询交通！',
    timestamp: new Date()
  }
];

export default function ChatInput({ onSendMessage, initialMessages = DEFAULT_MESSAGES }: ChatInputProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // 调用回调
    onSendMessage?.(inputValue);
    
    // 模拟助手回复
    setTimeout(() => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: '收到！正在为你规划最佳行程... 🗺️',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <div className="sticky bottom-4">
      <div className="bg-white rounded-3xl shadow-2xl p-4 border border-gray-100 glass-effect">
        {/* 消息历史 - 气泡样式 */}
        {messages.length > 1 && (
          <div className="mb-4 space-y-3 max-h-48 overflow-y-auto">
            {messages.slice(-3).map((msg, i) => (
              <div 
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white rounded-br-md' 
                      : 'bg-gray-100 text-gray-900 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* 输入区域 */}
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="告诉我你的需求，比如'帮我规划上海 4 天行程'..."
            className="flex-1 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            style={{ borderRadius: '20px' }}
          />
          <button
            onClick={handleSendMessage}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 btn-ripple transition-all duration-200"
            style={{ borderRadius: '20px' }}
          >
            发送 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
