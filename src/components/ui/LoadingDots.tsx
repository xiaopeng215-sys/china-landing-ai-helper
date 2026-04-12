'use client';

import React from 'react';

interface LoadingDotsProps {
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingDots({
  color = '#ff5a5f',
  size = 'md',
  text,
}: LoadingDotsProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-2 h-2';
      case 'md':
        return 'w-3 h-3';
      case 'lg':
        return 'w-4 h-4';
      default:
        return 'w-3 h-3';
    }
  };

  const getTextSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'md':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex items-center gap-2">
        <div
          className={`${getSizeClasses()} rounded-full animate-bounce`}
          style={{
            backgroundColor: color,
            animationDelay: '0ms',
          }}
        />
        <div
          className={`${getSizeClasses()} rounded-full animate-bounce`}
          style={{
            backgroundColor: color,
            animationDelay: '150ms',
          }}
        />
        <div
          className={`${getSizeClasses()} rounded-full animate-bounce`}
          style={{
            backgroundColor: color,
            animationDelay: '300ms',
          }}
        />
      </div>
      {text && (
        <p className={`${getTextSizeClasses()} text-[#767676] animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
}
