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

export interface TimeEstimate {
  seconds: number;
  message: string;
  stage: 'preparing' | 'processing' | 'finalizing' | 'complete';
}

const STAGE_MESSAGES: Record<TimeEstimate['stage'], string> = {
  preparing: '正在准备...',
  processing: '正在处理...',
  finalizing: '正在完成...',
  complete: '完成！',
};

const STAGE_COLORS: Record<TimeEstimate['stage'], string> = {
  preparing: 'bg-blue-500',
  processing: 'bg-indigo-500',
  finalizing: 'bg-purple-500',
  complete: 'bg-green-500',
};

export default function EstimatedTime({
  estimatedSeconds = 30,
  label = '预计等待时间',
  showProgress = true,
  onComplete,
  className = '',
  autoStart = true,
}: EstimatedTimeProps) {
  const [remaining, setRemaining] = useState<number>(estimatedSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);
  const [stage, setStage] = useState<TimeEstimate['stage']>('preparing');
  const [progress, setProgress] = useState<number>(0);

  // 根据剩余时间计算阶段
  const calculateStage = useCallback((remaining: number, total: number): TimeEstimate['stage'] => {
    if (remaining <= 0) return 'complete';
    const ratio = remaining / total;
    if (ratio > 0.7) return 'preparing';
    if (ratio > 0.3) return 'processing';
    if (ratio > 0) return 'finalizing';
    return 'complete';
  }, []);

  // 定时器更新
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
        setProgress(((estimatedSeconds - next) / estimatedSeconds) * 100);
        setStage(calculateStage(next, estimatedSeconds));
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, remaining, estimatedSeconds, onComplete, calculateStage]);

  // 格式化时间显示
  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return '0s';
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // 重置计时器
  const reset = () => {
    setRemaining(estimatedSeconds);
    setProgress(0);
    setStage('preparing');
    setIsRunning(true);
  };

  // 暂停/继续
  const toggle = () => {
    setIsRunning(!isRunning);
  };

  const baseClasses = `
    p-4 bg-white rounded-xl border border-gray-200
    ${className}
  `;

  const progressClasses = `
    w-full h-2 bg-gray-100 rounded-full overflow-hidden
    transition-all duration-300
  `;

  const progressBarClasses = `
    h-full ${STAGE_COLORS[stage]}
    transition-all duration-300 ease-out
  `;

  return (
    <div className={baseClasses}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className={`text-lg font-bold ${stage === 'complete' ? 'text-green-600' : 'text-gray-900'}`}>
          {formatTime(remaining)}
        </span>
      </div>

      {showProgress && (
        <div className="mb-3">
          <div className={progressClasses}>
            <div
              className={progressBarClasses}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>{Math.round(progress)}%</span>
            <span>{formatTime(estimatedSeconds)}</span>
          </div>
        </div>
      )}

      {/* 状态指示器 */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${STAGE_COLORS[stage]} animate-pulse`} />
        <span className="text-sm text-gray-600">{STAGE_MESSAGES[stage]}</span>
      </div>

      {/* 控制按钮 */}
      {stage !== 'complete' && (
        <div className="flex gap-2">
          <button
            onClick={toggle}
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
      )}

      {/* 完成状态 */}
      {stage === 'complete' && (
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

// 辅助 Hook：管理行程生成状态
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
