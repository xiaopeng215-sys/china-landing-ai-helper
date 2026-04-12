'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MessagesSquare, History } from 'lucide-react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { SessionList } from './SessionList';
import type { Message, ChatSession } from './types';

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: currentSessionId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.reply || '抱歉，我暂时无法回答您的问题。',
          timestamp: new Date(),
          tokens: data.usage?.total_tokens,
          // 结构化响应数据
          recommendations: data.recommendations || [],
          actions: data.actions || [],
          images: data.images || [],
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        if (data.sessionId && !currentSessionId) {
          setCurrentSessionId(data.sessionId);
          loadSessions();
        }
      }
    } catch (error) {
      console.error('发送消息失败:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <MessagesSquare className="w-6 h-6 text-[#ff5a5f]" />
          <h1 className="font-bold text-lg">AI 旅行助手</h1>
        </div>
        <button
          onClick={() => setShowSessionList(true)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <History className="w-5 h-5 text-[#767676]" />
        </button>
      </header>

      {/* Messages */}
      <MessageList messages={messages} messagesEndRef={messagesEndRef} />

      {/* Typing Indicator */}
      {isTyping && (
        <div className="px-4 py-2 bg-white border-t">
          <div className="flex items-center gap-2 text-sm text-[#767676]">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-[#ff5a5f] rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-[#ff5a5f] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <span className="w-2 h-2 bg-[#ff5a5f] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            <span>AI 正在思考...</span>
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
