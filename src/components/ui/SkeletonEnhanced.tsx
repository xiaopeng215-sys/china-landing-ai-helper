'use client';

import React from 'react';
import './SkeletonEnhanced.css';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  animation?: 'pulse' | 'shine' | 'wave' | 'none';
  variant?: 'rect' | 'circular' | 'rounded';
}

/**
 * 增强版骨架屏基础组件
 * 支持多种动画效果和变体
 */
export default function SkeletonEnhanced({
  className = '',
  width = '100%',
  height = '1rem',
  borderRadius = '0.5rem',
  animation = 'wave',
  variant = 'rect',
}: SkeletonProps) {
  const baseClasses = 'skeleton-base';
  
  const animationClasses = {
    pulse: 'skeleton-pulse',
    shine: 'skeleton-shine',
    wave: 'skeleton-wave',
    none: '',
  };

  const variantClasses = {
    rect: '',
    circular: 'skeleton-circular',
    rounded: 'skeleton-rounded',
  };

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: variant === 'circular' ? '50%' : borderRadius,
  };

  return (
    <div
      className={`${baseClasses} ${animationClasses[animation]} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-busy="true"
      aria-label="加载中"
    />
  );
}

// ============ 预定义骨架屏组件 ============

/**
 * 卡片骨架屏 - 通用卡片加载状态
 */
export function CardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card-image" />
      <div className="skeleton-card-content">
        <SkeletonEnhanced className="mb-3" height="1.25rem" width="70%" />
        <SkeletonEnhanced className="mb-2" height="0.75rem" width="90%" />
        <SkeletonEnhanced className="mb-2" height="0.75rem" width="80%" />
        <div className="skeleton-card-actions">
          <SkeletonEnhanced height="2rem" width="5rem" borderRadius="9999px" />
          <SkeletonEnhanced height="2rem" width="5rem" borderRadius="9999px" />
        </div>
      </div>
    </div>
  );
}

/**
 * 列表骨架屏 - 用于列表数据加载
 */
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="skeleton-list">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * 头像骨架屏
 */
export function AvatarSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizeMap = {
    sm: '2.5rem',
    md: '3rem',
    lg: '4rem',
    xl: '6rem',
  };

  return (
    <SkeletonEnhanced
      width={sizeMap[size]}
      height={sizeMap[size]}
      variant="circular"
      animation="pulse"
    />
  );
}

/**
 * 文本行骨架屏
 */
export function TextLinesSkeleton({ 
  lines = 3, 
  lastLineWidth = '40%' 
}: { 
  lines?: number;
  lastLineWidth?: string;
}) {
  return (
    <div className="skeleton-text-lines">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonEnhanced
          key={i}
          height="0.875rem"
          width={i === lines - 1 ? lastLineWidth : '100%'}
          className={i < lines - 1 ? 'mb-2' : ''}
        />
      ))}
    </div>
  );
}

/**
 * 图表骨架屏 - 用于数据可视化加载
 */
export function ChartSkeleton({ height = '200px' }: { height?: string }) {
  return (
    <div className="skeleton-chart">
      <div className="skeleton-chart-header">
        <SkeletonEnhanced height="1.25rem" width="30%" />
        <SkeletonEnhanced height="1rem" width="20%" />
      </div>
      <div className="skeleton-chart-body" style={{ height }} />
    </div>
  );
}

/**
 * 表格骨架屏
 */
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="skeleton-table">
      {/* 表头 */}
      <div className="skeleton-table-header">
        {Array.from({ length: columns }).map((_, i) => (
          <SkeletonEnhanced key={i} height="1rem" width="100%" />
        ))}
      </div>
      {/* 表体 */}
      <div className="skeleton-table-body">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="skeleton-table-row">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <SkeletonEnhanced key={colIndex} height="0.875rem" width="100%" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 图片画廊骨架屏
 */
export function GallerySkeleton({ 
  columns = 3, 
  rows = 2,
  aspectRatio = 'square' 
}: { 
  columns?: number;
  rows?: number;
  aspectRatio?: 'square' | 'landscape' | 'portrait';
}) {
  const total = columns * rows;
  
  const aspectClasses = {
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]',
  };

  return (
    <div 
      className="skeleton-gallery"
      style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '0.75rem'
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div 
          key={i} 
          className={`skeleton-gallery-item ${aspectClasses[aspectRatio]}`}
        >
          <SkeletonEnhanced width="100%" height="100%" animation="shine" />
        </div>
      ))}
    </div>
  );
}

/**
 * 对话气泡骨架屏 - 用于聊天界面
 */
export function ChatBubbleSkeleton({ 
  align = 'left', 
  count = 3 
}: { 
  align?: 'left' | 'right';
  count?: number;
}) {
  return (
    <div className={`skeleton-chat-bubbles ${align === 'right' ? 'align-right' : ''}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-chat-bubble-row">
          {align === 'right' && (
            <AvatarSkeleton size="sm" />
          )}
          <div className="skeleton-chat-bubble">
            <SkeletonEnhanced height="0.75rem" width="90%" className="mb-1" />
            <SkeletonEnhanced height="0.75rem" width="75%" className="mb-1" />
            <SkeletonEnhanced height="0.75rem" width="60%" />
          </div>
          {align === 'left' && (
            <AvatarSkeleton size="sm" />
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * 价格标签骨架屏
 */
export function PriceSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const heightMap = {
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
  };

  return (
    <div className="skeleton-price">
      <SkeletonEnhanced height={heightMap[size]} width="4rem" />
      <SkeletonEnhanced height="0.625rem" width="2rem" className="ml-1" />
    </div>
  );
}

/**
 * 进度条骨架屏
 */
export function ProgressSkeleton({ segments = 4 }: { segments?: number }) {
  return (
    <div className="skeleton-progress">
      {Array.from({ length: segments }).map((_, i) => (
        <SkeletonEnhanced 
          key={i} 
          height="0.5rem" 
          width={`${100 / segments}%`}
          className="flex-1"
          borderRadius="9999px"
        />
      ))}
    </div>
  );
}
