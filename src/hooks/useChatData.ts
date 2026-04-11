'use client';

import { useState, useEffect, useCallback } from 'react';
import { messagesApi } from '@/lib/api-client';
import type { Message } from '@/lib/types';

interface UseChatDataReturn {
  messages: Message[];
  loading: boolean;
  error: Error | null;
  sendMessage: (content: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useChatData(): UseChatDataReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await messagesApi.getList();
      setMessages(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch messages'));
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const tempId = String(Date.now());
    
    // Optimistically add user message
    const userMessage: Message = {
      id: tempId,
      type: 'user',
      content,
      timestamp: new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    
    setMessages((prev) => [...prev, userMessage]);

    try {
      // In real implementation, this would trigger AI response
      await messagesApi.send(content);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send message'));
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    refresh: fetchMessages,
  };
}
