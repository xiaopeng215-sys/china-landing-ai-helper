'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MessagesSquare, History, Cpu } from 'lucide-react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { SessionList } from './SessionList';
import type { Message, ChatSession } from './types';

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
  const [selectedModel, setSelectedModel] = useState<AIModel>('qwen');
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
          model: selectedModel,
        }),
      });

      // 处理错误响应
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `请求失败 (${response.status})`;
        
        const errorMessageObj: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `⚠️ ${errorMessage}`,
          timestamp: new Date(),
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
      let content = data.reply || '抱歉，我暂时无法回答您的问题。';
      
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
        role: 'assistant',
        content: content,
        timestamp: new Date(),
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
        role: 'assistant',
        content: '❌ 发送失败，请检查网络连接后重试',
        timestamp: new Date(),
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

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <MessagesSquare className="w-6 h-6 text-[#ff5a5f]" />
          <div>
            <h1 className="font-bold text-lg">AI 旅行助手</h1>
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => setShowModelSelector(!showModelSelector)}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                <Cpu className="w-3 h-3 text-[#767676]" />
                <span className="text-[#767676] font-medium">
                  {selectedModel === 'qwen' ? 'Qwen' : 'MiniMax'}
                </span>
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowSessionList(true)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <History className="w-5 h-5 text-[#767676]" />
        </button>
      </header>

      {/* Model Selector Dropdown */}
      {showModelSelector && (
        <div className="absolute top-16 right-4 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 min-w-[160px]">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-xs font-semibold text-[#767676]">选择 AI 模型</p>
          </div>
          <button
            onClick={() => {
              setSelectedModel('qwen');
              setShowModelSelector(false);
            }}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
              selectedModel === 'qwen' ? 'bg-[#ff5a5f]/10 text-[#ff5a5f]' : 'text-[#484848]'
            }`}
          >
            <span>Qwen (阿里云)</span>
            {selectedModel === 'qwen' && <span className="text-[#ff5a5f]">✓</span>}
          </button>
          <button
            onClick={() => {
              setSelectedModel('minimax');
              setShowModelSelector(false);
            }}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
              selectedModel === 'minimax' ? 'bg-[#ff5a5f]/10 text-[#ff5a5f]' : 'text-[#484848]'
            }`}
          >
            <span>MiniMax</span>
            {selectedModel === 'minimax' && <span className="text-[#ff5a5f]">✓</span>}
          </button>
          <div className="px-3 py-2 mt-1 border-t border-gray-100">
            <p className="text-[10px] text-[#767676]">
              💡 Qwen: 擅长中文理解<br/>
              🚀 MiniMax: 响应速度快
            </p>
          </div>
        </div>
      )}

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
