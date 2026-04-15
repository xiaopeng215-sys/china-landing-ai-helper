'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useClientI18n } from '@/lib/i18n/client';
import { VoiceInput } from '@/components/voice/VoiceInput';

interface ChatInputProps {
  inputValue: string;
  isTyping: boolean;
  onSend: () => void;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  voiceLanguage?: string;
}

export function ChatInput({ inputValue, isTyping, onSend, onChange, onSubmit, voiceLanguage }: ChatInputProps) {
  const { t } = useClientI18n();
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
            placeholder={t('ChatViewPage.inputPlaceholder')}
            rows={1}
            className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 
                       focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent
                       resize-none max-h-32 text-sm"
            style={{ minHeight: '44px' }}
          />
          <div className="absolute right-3 rtl:right-auto rtl:left-3 bottom-2">
            <VoiceInput
              language={voiceLanguage}
              onTranscript={(text) => onChange(inputValue ? inputValue + ' ' + text : text)}
            />
          </div>
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
