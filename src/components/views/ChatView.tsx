'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { generateAllLinks, type BookingLink } from '@/lib/booking-links';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tokens?: number;
}

interface ChatSession {
  id: string;
  title: string;
  updated_at: string;
}

export default function ChatView() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [showSessionList, setShowSessionList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 加载会话列表
  useEffect(() => {
    if (status === 'authenticated') {
      loadSessions();
    }
  }, [status]);

  const loadSessions = async () => {
    try {
      const response = await fetch('/api/chat');
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
        
        // 加载最新的会话
        if (data.sessions && data.sessions.length > 0) {
          loadSessionMessages(data.sessions[0].id);
          setCurrentSessionId(data.sessions[0].id);
        }
      }
    } catch (error) {
      console.error('加载会话列表失败:', error);
    }
  };

  const loadSessionMessages = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat/sessions/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        const loadedMessages = data.messages.map((msg: { id: string; role: string; content: string; created_at: string; tokens?: number }) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.created_at),
          tokens: msg.tokens,
        }));
        setMessages(loadedMessages);
      }
    } catch (error) {
      console.error('加载消息历史失败:', error);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setShowSessionList(false);
  };

  const handleSelectSession = (sessionId: string) => {
    loadSessionMessages(sessionId);
    setCurrentSessionId(sessionId);
    setShowSessionList(false);
  };

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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: currentSessionId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 401) {
          router.push('/auth/signin?callbackUrl=/chat');
          return;
        }
        throw new Error(error.error || '请求失败');
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: data.messageId || Date.now().toString(),
        role: 'assistant',
        content: data.reply || "抱歉，我暂时无法回答这个问题。",
        timestamp: new Date(),
        tokens: data.usage?.total_tokens,
      };

      setMessages(prev => [...prev, aiMessage]);

      // 更新会话 ID（如果是新会话）
      if (data.sessionId && !currentSessionId) {
        setCurrentSessionId(data.sessionId);
        loadSessions(); // 刷新会话列表
      }

    } catch (error) {
      console.error('发送消息失败:', error);

      const errorMessage: Message = {
        id: Date.now().toString() + 'error',
        role: 'assistant',
        content: `⚠️ ${error.message || '连接 AI 失败，请稍后重试。'}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    { icon: '🗽', text: '上海 4 天行程', query: '帮我规划上海 4 天行程' },
    { icon: '🍜', text: '美食推荐', query: '推荐上海本地美食' },
    { icon: '🚇', text: '地铁指南', query: '上海地铁怎么坐？' },
    { icon: '💳', text: '支付设置', query: '如何设置支付宝？' },
  ];

  // 未登录状态
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#ff5a5f] to-[#ff3b3f] rounded-2xl flex items-center justify-center text-4xl shadow-lg mx-auto mb-4 animate-pulse">
            🇨🇳
          </div>
          <p className="text-[#767676]">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex">
      {/* 侧边栏 - 会话列表 */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 z-40 ${showSessionList ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#484848]">对话历史</h2>
            <button
              onClick={() => setShowSessionList(false)}
              className="text-[#767676] hover:text-[#484848]"
            >
              ✕
            </button>
          </div>
          
          <button
            onClick={handleNewChat}
            className="w-full py-2 mb-3 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all"
          >
            + 新对话
          </button>

          <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-120px)]">
            {sessions.map(session => (
              <button
                key={session.id}
                onClick={() => handleSelectSession(session.id)}
                className={`w-full text-left p-3 rounded-xl text-sm transition-all ${
                  currentSessionId === session.id
                    ? 'bg-[#ff5a5f]/10 text-[#ff5a5f] border border-[#ff5a5f]/20'
                    : 'bg-gray-50 text-[#484848] hover:bg-gray-100'
                }`}
              >
                <div className="font-medium truncate">{session.title}</div>
                <div className="text-xs text-[#767676] mt-1">
                  {new Date(session.updated_at).toLocaleDateString('zh-CN')}
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* 主聊天区域 */}
      <main className="flex-1 flex flex-col ml-0">
        {/* Header */}
        <header className="sticky top-0 z-30 backdrop-blur-lg bg-white/90 border-b border-gray-200/50 shadow-sm">
          <div className="max-w-3xl mx-auto w-full px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSessionList(!showSessionList)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <svg className="w-6 h-6 text-[#484848]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div className="w-10 h-10 bg-gradient-to-br from-[#ff5a5f] to-[#ff3b3f] rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                  🇨🇳
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#484848]">China AI Helper</h1>
                  <p className="text-xs text-[#767676]">您的旅行助手</p>
                </div>
              </div>
              <button
                onClick={handleNewChat}
                className="px-3 py-1.5 text-xs font-medium bg-[#1a73e8] text-white rounded-full shadow-md hover:shadow-lg transition-all"
              >
                新对话
              </button>
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-4">
            {messages.length === 0 ? (
              <>
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#ff5a5f] to-[#ff3b3f] rounded-3xl flex items-center justify-center text-5xl shadow-lg mx-auto mb-6">
                    🇨🇳
                  </div>
                  <h2 className="text-2xl font-bold text-[#484848] mb-2">
                    欢迎来到 China AI Helper
                  </h2>
                  <p className="text-[#767676] mb-8">
                    我可以帮您规划行程、推荐美食、解答交通问题
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#767676] mb-3 text-center">试试问我：</p>
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
              </>
            ) : (
              <>
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
                      <div className="flex items-center gap-2 mt-1">
                        <p
                          className={`text-xs ${
                            message.role === 'user' ? 'text-white/70' : 'text-[#767676]'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        {message.tokens && (
                          <span className="text-xs text-[#767676]/50">
                            {message.tokens} tokens
                          </span>
                        )}
                      </div>
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
              </>
            )}
          </div>
        </div>

        {/* Chat Input */}
        <div className="bg-white border-t border-gray-200 p-4 safe-area-bottom">
          <div className="max-w-3xl mx-auto w-full">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="问我关于中国旅行的任何问题..."
                className="flex-1 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent transition-all"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="px-6 py-3 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
