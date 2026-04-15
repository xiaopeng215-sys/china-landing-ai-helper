'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Square } from 'lucide-react';

export interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language?: string;
}

// Extend window for browser SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const SUPPORTED_LANGS = ['en-US', 'zh-CN', 'ja-JP', 'ko-KR', 'fr-FR', 'de-DE'];

export function VoiceInput({ onTranscript, language = 'en-US' }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SR);
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const start = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const lang = SUPPORTED_LANGS.includes(language) ? language : 'en-US';
    const recognition = new SR();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join('');
      if (transcript) onTranscript(transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [language, onTranscript]);

  const toggle = () => (isListening ? stop() : start());

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      title={isListening ? 'Stop recording' : 'Voice input'}
      className={`relative flex items-center justify-center w-9 h-9 rounded-full transition-all
        ${isListening
          ? 'bg-red-500 text-white shadow-lg'
          : 'text-[#767676] hover:text-[#ff5a5f]'
        }`}
    >
      {isListening ? (
        <>
          {/* Wave animation rings */}
          <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-60" />
          <span className="absolute inset-[-4px] rounded-full border-2 border-red-400 animate-pulse opacity-40" />
          <Square className="w-4 h-4 relative z-10" />
        </>
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </button>
  );
}
