'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MessagesSquare, History, Cpu } from 'lucide-react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { SessionList } from './SessionList';
import type { Message, ChatSession } from './types';
import { useClientI18n } from '@/lib/i18n/client';

export type AIModel = 'minimax' | 'qwen';

export default function ChatView() {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: currentSessionId,
          model: selectedModel,
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
      <MessageList messages={messages} messagesEndRef={messagesEndRef} />

      {/* Quick Questions - shown when chat is empty */}
      {messages.length === 0 && !isTyping && (
        <div className="px-4 py-3 bg-white border-t border-gray-100">
          <p className="text-xs text-[#767676] mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleQuickQuestion(q)}
                className="text-xs px-3 py-1.5 rounded-full border border-[#ff5a5f] text-[#ff5a5f]
                           hover:bg-[#ff5a5f] hover:text-white transition-colors whitespace-nowrap"
              >
                {q}
              </button>
            ))}
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
