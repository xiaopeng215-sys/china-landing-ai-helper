'use client';

import React, { useEffect, useState, useCallback } from 'react';

export interface EstimatedTimeProps {
  estimatedSeconds?: number;
  label?: string;
  showProgress?: boolean;
  onComplete?: () => void;
  className?: string;
  autoStart?: boolean;
}

const STAGE_MESSAGES = {
  preparing: '正在准备...',
  processing: '正在处理...',
  finalizing: '正在完成...',
  complete: '完成！',
} as const;

const STAGE_COLORS = {
  preparing: 'bg-blue-500',
  processing: 'bg-indigo-500',
  finalizing: 'bg-purple-500',
  complete: 'bg-green-500',
} as const;

type Stage = keyof typeof STAGE_MESSAGES;

/**
 * EstimatedTime - 精简版
 * 优化：移除冗余代码，简化逻辑
 */
export default function EstimatedTime({
  estimatedSeconds = 30,
  label = '预计等待时间',
  showProgress = true,
  onComplete,
  className = '',
  autoStart = true,
}: EstimatedTimeProps) {
  const [remaining, setRemaining] = useState(estimatedSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [stage, setStage] = useState<Stage>('preparing');

  // 计算阶段
  const calculateStage = useCallback((rem: number, total: number): Stage => {
    if (rem <= 0) return 'complete';
    const ratio = rem / total;
    if (ratio > 0.7) return 'preparing';
    if (ratio > 0.3) return 'processing';
    if (ratio > 0) return 'finalizing';
    return 'complete';
  }, []);

  // 定时器
  useEffect(() => {
    if (!isRunning || remaining <= 0) {
      if (remaining <= 0 && isRunning) {
        setIsRunning(false);
        setStage('complete');
        onComplete?.();
      }
      return;
    }

    const timer = setInterval(() => {
      setRemaining(prev => {
        const next = prev - 1;
        setStage(calculateStage(next, estimatedSeconds));
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, remaining, estimatedSeconds, onComplete, calculateStage]);

  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return '0s';
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    return `${mins}m ${seconds % 60}s`;
  };

  const reset = () => {
    setRemaining(estimatedSeconds);
    setStage('preparing');
    setIsRunning(true);
  };

  const progress = ((estimatedSeconds - remaining) / estimatedSeconds) * 100;

  return (
    <div className={`p-4 bg-white rounded-xl border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className={`text-lg font-bold ${stage === 'complete' ? 'text-green-600' : 'text-gray-900'}`}>
          {formatTime(remaining)}
        </span>
      </div>

      {showProgress && (
        <div className="mb-3">
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${STAGE_COLORS[stage]} transition-all duration-300 ease-out`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>{Math.round(progress)}%</span>
            <span>{formatTime(estimatedSeconds)}</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${STAGE_COLORS[stage]} animate-pulse`} />
        <span className="text-sm text-gray-600">{STAGE_MESSAGES[stage]}</span>
      </div>

      {stage !== 'complete' ? (
        <div className="flex gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {isRunning ? '暂停' : '继续'}
          </button>
          <button
            onClick={reset}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            重置
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-green-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium">行程已生成完毕</span>
        </div>
      )}
    </div>
  );
}
