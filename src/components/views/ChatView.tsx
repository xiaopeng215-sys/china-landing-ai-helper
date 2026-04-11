'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Welcome to China! I'm your AI travel companion. I can help you plan itineraries, discover local food, navigate transportation, and more! How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // 调用 OpenClaw 后端（通过 Gateway）
      const response = await fetch('http://127.0.0.1:18789/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 17f0793580d3954ab3c6c46dcde0722a5bd70df63fe5b1bb',
        },
        body: JSON.stringify({
          message: userMessage.content,
          agentId: 'main',
          sessionKey: 'agent:main:main',
        }),
      });

      if (!response.ok) throw new Error('请求失败');

      const data = await response.json();

      const aiMessage: Message = {
        id: Date.now().toString() + 'ai',
        role: 'assistant',
        content: data.reply || "抱歉，我暂时无法回答这个问题。",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('发送消息失败:', error);

      const errorMessage: Message = {
        id: Date.now().toString() + 'error',
        role: 'assistant',
        content: "⚠️ 连接后端失败，请检查 OpenClaw 是否正在运行。",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    { icon: '🗽', text: 'Shanghai 4-day trip', query: 'Plan a 4-day Shanghai trip' },
    { icon: '🍜', text: 'Food recommendations', query: 'Recommend local food' },
    { icon: '🚇', text: 'Metro guide', query: 'How to use metro in Shanghai?' },
    { icon: '💳', text: 'Payment setup', query: 'How to set up Alipay?' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/90 border-b border-gray-200/50 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#ff5a5f] to-[#ff3b3f] rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                🇨🇳
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#484848]">China AI Helper</h1>
                <p className="text-xs text-[#767676]">Your travel companion</p>
              </div>
            </div>
            <button className="px-3 py-1.5 text-xs font-medium bg-[#1a73e8] text-white rounded-full shadow-md hover:shadow-lg transition-all">
              New Chat
            </button>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white'
                  : 'bg-white text-[#484848] border border-gray-100'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-white/70' : 'text-[#767676]'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-md border border-gray-100">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#ff5a5f] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-[#ff5a5f] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-[#ff5a5f] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />

        {/* Quick Actions */}
        {messages.length <= 2 && (
          <div className="pt-4">
            <p className="text-xs text-[#767676] mb-3 text-center">Try asking about:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => setInputValue(action.query)}
                  className="p-3 bg-white rounded-xl border border-gray-200 hover:border-[#ff5a5f] hover:shadow-md transition-all text-left"
                >
                  <span className="text-lg mr-2">{action.icon}</span>
                  <span className="text-sm text-[#484848]">{action.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Chat Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-bottom">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about traveling in China..."
              className="flex-1 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent transition-all"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="px-6 py-3 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
