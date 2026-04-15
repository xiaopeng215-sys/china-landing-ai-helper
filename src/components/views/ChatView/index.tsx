'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MessagesSquare, History, Map } from 'lucide-react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { SessionList } from './SessionList';
import type { Message, ChatSession } from './types';
import { useClientI18n } from '@/lib/i18n/client';
import { useTravelerProfile } from '@/hooks/useTravelerProfile';
import { trackEvent } from '@/lib/analytics/events';
import { useSubscription } from '@/hooks/useSubscription';
import { UpgradePrompt } from '@/components/paywall/UpgradePrompt';

export type AIModel = 'minimax' | 'qwen';

function detectItineraryIntent(text: string): boolean {
  const lower = text.toLowerCase();
  return [
    'plan my trip', 'plan a trip', 'itinerary', '行程', '规划', 'plan.*day', 'days? in',
    'trip to', 'visit.*china', 'travel plan', 'schedule',
  ].some(kw => new RegExp(kw).test(lower));
}

interface ChatViewProps {
  onNavigate?: (tab: string) => void;
  initialMessage?: string;
}

export default function ChatView({ onNavigate, initialMessage }: ChatViewProps = {}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [showSessionList, setShowSessionList] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>('minimax');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { tier, dailyLimit } = useSubscription(session?.user?.id);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getPersonalizedContext, updateFromConversation, appendChatSummary, profile } = useTravelerProfile();
  const voiceLanguage = profile?.languages?.[0] ?? 'en-US';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        const loadedMessages = data.messages.map((msg: any) => ({
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

    // Daily limit check for free users
    if (tier === 'free' && dailyCount >= dailyLimit) {
      setShowUpgrade(true);
      return;
    }

    trackEvent('chat_message', { messageLength: inputValue.trim().length, model: selectedModel });

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Detect itinerary intent — inject a nudge card before AI reply
    if (onNavigate && detectItineraryIntent(userMessage.content)) {
      const nudge: Message = {
        id: `nudge_${Date.now()}`,
        type: 'ai',
        role: 'assistant',
        content: '__ITINERARY_NUDGE__',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, nudge]);
    }

    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: currentSessionId,
          model: selectedModel,
          profileContext: getPersonalizedContext(),
        }),
      });

      // 处理错误响应
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const err = errorData.error;
        const errorMessage = typeof err === 'string'
          ? err
          : (err?.message || `Request failed (${response.status})`);
        
        const errorMessageObj: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          role: 'assistant',
          content: `⚠️ ${errorMessage}`,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, errorMessageObj]);
        
        // 如果是 401，提示登录
        if (response.status === 401) {
          setTimeout(() => {
            window.location.href = '/auth/signin';
          }, 2000);
        }
        return;
      }

      const data = await response.json();
      
      // 尝试解析结构化响应（兼容旧格式）
      let recommendations = data.recommendations || [];
      let actions = data.actions || [];
      let images = data.images || [];
      let content = typeof data.reply === 'string'
        ? data.reply
        : (data.reply?.text || data.reply?.content || "Sorry, I couldn't process your request. Please try again.");
      
      // 如果后端返回的是 JSON 字符串，尝试解析
      if (typeof content === 'string' && content.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(content);
          if (parsed.text) content = parsed.text;
          if (parsed.recommendations) recommendations = parsed.recommendations;
          if (parsed.actions) actions = parsed.actions;
          if (parsed.images) images = parsed.images;
        } catch (e) {
          // 解析失败，保持原样
        }
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        role: 'assistant',
        content: content,
        timestamp: new Date().toISOString(),
        tokens: data.usage?.total_tokens,
        // 结构化响应数据
        recommendations,
        actions,
        images,
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Update profile from conversation
      updateFromConversation(userMessage.content);
      appendChatSummary('user', userMessage.content.slice(0, 200));
      appendChatSummary('assistant', content.slice(0, 200));
      setDailyCount(c => c + 1);

      if (data.sessionId && !currentSessionId) {
        setCurrentSessionId(data.sessionId);
        loadSessions();
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      
      // 显示错误消息
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        role: 'assistant',
        content: '❌ Failed to send. Please check your connection and try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const QUICK_QUESTIONS = [
    'How to pay in China?',
    'Which SIM card should I get?',
    'How to use Didi?',
    'Emergency numbers?',
    'Best food in Beijing?',
  ];

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    // Use a ref-based approach to avoid stale closure on inputValue
    // We pass the question directly to avoid relying on state update timing
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      role: 'user',
      content: question,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: question, sessionId: currentSessionId, model: selectedModel }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const err = errorData.error;
          const errorMessage = typeof err === 'string' ? err : (err?.message || `Request failed (${response.status})`);
          setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), type: 'ai', role: 'assistant', content: `⚠️ ${errorMessage}`, timestamp: new Date().toISOString() }]);
          return;
        }
        const data = await response.json();
        let content = typeof data.reply === 'string'
          ? data.reply
          : (data.reply?.text || data.reply?.content || "Sorry, I couldn't process your request.");
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          role: 'assistant',
          content,
          timestamp: new Date().toISOString(),
          recommendations: data.recommendations || [],
          actions: data.actions || [],
          images: data.images || [],
        }]);
        if (data.sessionId && !currentSessionId) {
          setCurrentSessionId(data.sessionId);
          loadSessions();
        }
      })
      .catch(() => {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), type: 'ai', role: 'assistant', content: '❌ Failed to send. Please check your connection.', timestamp: new Date().toISOString() }]);
      })
      .finally(() => setIsTyping(false));
  };

  const { t } = useClientI18n();

  // Auto-send initialMessage once on mount
  useEffect(() => {
    if (initialMessage) {
      setInputValue(initialMessage);
    }
  }, [initialMessage]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessagesSquare className="w-6 h-6 text-[#ff5a5f]" />
            <div>
              <h1 className="font-bold text-lg text-[#484848]">{t('ChatViewPage.title')}</h1>
            </div>
          </div>
          <button
            onClick={() => setShowSessionList(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <History className="w-5 h-5 text-[#767676]" />
          </button>
        </div>
      </header>

      {/* Model Selector hidden - internal use only */}

      {/* Messages */}
      <MessageList messages={messages} messagesEndRef={messagesEndRef} onNavigate={onNavigate} voiceLanguage={voiceLanguage} />

      {/* Welcome screen - shown when chat is empty */}
      {messages.length === 0 && !isTyping && (
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col items-center px-4 pt-8 pb-4">
            {/* Avatar + greeting */}
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🤖</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Hi, I&apos;m your China Travel AI</h2>
            <p className="text-sm text-gray-500 text-center mb-6 max-w-xs">
              Ask me anything about traveling in China — itineraries, food, transport, payments, and more.
            </p>

            {/* Suggestion buttons */}
            <div className="w-full max-w-sm space-y-2">
              <p className="text-xs text-gray-400 text-center mb-3">Try asking:</p>
              {[
                { emoji: '🗺️', text: 'Plan a 3-day Beijing itinerary' },
                { emoji: '🍜', text: 'Best street food in Shanghai' },
                { emoji: '🚇', text: 'How to get from airport to city?' },
                { emoji: '💳', text: 'How to set up Alipay as a foreigner?' },
                { emoji: '📶', text: 'Best SIM card for China travel' },
                { emoji: '🏨', text: 'Budget hotels in Chengdu' },
              ].map((q) => (
                <button
                  key={q.text}
                  onClick={() => handleQuickQuestion(q.text)}
                  className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl text-left hover:border-teal-300 hover:bg-teal-50 transition-colors"
                >
                  <span className="text-lg">{q.emoji}</span>
                  <span className="text-sm text-gray-700">{q.text}</span>
                  <span className="ml-auto text-gray-400">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="px-4 py-2 bg-white border-t">
          <div className="flex items-center gap-2 text-sm text-[#767676]">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-[#ff5a5f] rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-[#ff5a5f] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <span className="w-2 h-2 bg-[#ff5a5f] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            <span>{t('ChatViewPage.aiThinking')}</span>
          </div>
        </div>
      )}

      {/* Input */}
      <ChatInput
        inputValue={inputValue}
        isTyping={isTyping}
        onSend={handleSendMessage}
        onChange={setInputValue}
        onSubmit={handleSubmit}
        voiceLanguage={voiceLanguage}
      />

      {/* Session List Modal */}
      {showSessionList && (
        <SessionList
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelect={handleSelectSession}
          onNewChat={handleNewChat}
          onClose={() => setShowSessionList(false)}
        />
      )}
    </div>
  );
}
