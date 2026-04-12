'use client';

import React, { useState } from 'react';
import { Send, Mic } from 'lucide-react';

interface ChatInputProps {
  inputValue: string;
  isTyping: boolean;
  onSend: () => void;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ChatInput({ inputValue, isTyping, onSend, onChange, onSubmit }: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4 safe-area-bottom">
      <form onSubmit={onSubmit} className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            value={inputValue}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息..."
            rows={1}
            className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 
                       focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent
                       resize-none max-h-32 text-sm"
            style={{ minHeight: '44px' }}
          />
          <button
            type="button"
            className="absolute right-3 bottom-3 text-[#767676] hover:text-[#ff5a5f]"
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>
        
        <button
          type="submit"
          disabled={!inputValue.trim() || isTyping}
          className="p-3 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-full
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:shadow-lg transition-all active:scale-95"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
