'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  animation?: 'pulse' | 'shine' | 'none';
}

export default function Skeleton({
  className = '',
  width = '100%',
  height = '1rem',
  borderRadius = '0.5rem',
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200';
  
  const animationClasses = {
    pulse: 'animate-pulse',
    shine: 'animate-shine',
    none: '',
  };

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius,
  };

  return (
    <div
      className={`${baseClasses} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
}

// 预定义的骨架屏组件
export function CardSkeleton() {
  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200">
      <Skeleton className="mb-3" height="1.25rem" width="60%" />
      <Skeleton className="mb-2" height="0.75rem" width="80%" />
      <Skeleton className="mb-2" height="0.75rem" width="70%" />
      <div className="flex gap-2 mt-3">
        <Skeleton height="1.5rem" width="4rem" borderRadius="9999px" />
        <Skeleton height="1.5rem" width="4rem" borderRadius="9999px" />
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
