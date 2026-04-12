'use client';

import { useState, useCallback, useEffect } from 'react';

/**
 * useTripGeneration - 行程生成状态管理 Hook
 * 
 * 用法:
 * ```tsx
 * const { isGenerating, progress, remaining, startGeneration, cancelGeneration } = useTripGeneration(30);
 * ```
 */
export const useTripGeneration = (estimatedSeconds: number = 30) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [remaining, setRemaining] = useState(estimatedSeconds);

  const startGeneration = useCallback(() => {
    setIsGenerating(true);
    setRemaining(estimatedSeconds);
    setProgress(0);
  }, [estimatedSeconds]);

  const cancelGeneration = useCallback(() => {
    setIsGenerating(false);
    setProgress(0);
    setRemaining(estimatedSeconds);
  }, [estimatedSeconds]);

  useEffect(() => {
    if (!isGenerating || remaining <= 0) return;

    const timer = setInterval(() => {
      setRemaining(prev => {
        const next = prev - 1;
        setProgress(((estimatedSeconds - next) / estimatedSeconds) * 100);
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGenerating, remaining, estimatedSeconds]);

  return {
    isGenerating,
    progress,
    remaining,
    startGeneration,
    cancelGeneration,
  };
};
