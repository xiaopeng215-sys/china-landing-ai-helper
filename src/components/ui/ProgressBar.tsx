'use client';

import React from 'react';

interface ProgressBarProps {
  progress: number;
  color?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export default function ProgressBar({
  progress,
  color = '#ff5a5f',
  showLabel = true,
  size = 'md',
  animated = true,
}: ProgressBarProps) {
  const getHeightClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-2';
      case 'md':
        return 'h-3';
      case 'lg':
        return 'h-4';
      default:
        return 'h-3';
    }
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-[#767676]">进度</span>
          <span className="text-sm font-bold text-[#484848]">{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${getHeightClasses()}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${animated ? 'animate-shimmer' : ''}`}
          style={{
            width: `${clampedProgress}%`,
            backgroundColor: color,
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          }}
        />
      </div>
    </div>
  );
}
