'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, Pause, Play, Square } from 'lucide-react';

interface VoiceOutputProps {
  text: string;
  language?: string;
}

export function VoiceOutput({ text, language = 'en-US' }: VoiceOutputProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const speak = useCallback(() => {
    if (!text) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => setStatus('idle');
    utterance.onerror = () => setStatus('idle');

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setStatus('playing');
  }, [text, language]);

  const pause = () => {
    window.speechSynthesis.pause();
    setStatus('paused');
  };

  const resume = () => {
    window.speechSynthesis.resume();
    setStatus('playing');
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setStatus('idle');
  };

  if (!isSupported || !text) return null;

  return (
    <div className="inline-flex items-center gap-1 mt-1">
      {status === 'idle' && (
        <button
          onClick={speak}
          title="Read aloud"
          className="p-1 text-[#767676] hover:text-[#ff5a5f] transition-colors"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      )}
      {status === 'playing' && (
        <>
          <button onClick={pause} title="Pause" className="p-1 text-[#ff5a5f]">
            <Pause className="w-4 h-4" />
          </button>
          <button onClick={stop} title="Stop" className="p-1 text-[#767676] hover:text-red-500">
            <Square className="w-3.5 h-3.5" />
          </button>
        </>
      )}
      {status === 'paused' && (
        <>
          <button onClick={resume} title="Resume" className="p-1 text-[#ff5a5f]">
            <Play className="w-4 h-4" />
          </button>
          <button onClick={stop} title="Stop" className="p-1 text-[#767676] hover:text-red-500">
            <Square className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </div>
  );
}
