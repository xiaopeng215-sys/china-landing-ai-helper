/**
 * 更新时间显示组件 - UX-03
 * 用于显示数据最后更新时间
 */

'use client';

import React, { useState, useEffect } from 'react';

export interface UpdateTimestampProps {
  /** 上次更新时间（时间戳或 Date 对象） */
  lastUpdated?: number | Date | null;
  /** 是否显示相对时间（如"3分钟前"） */
  relative?: boolean;
  /** 是否自动刷新显示 */
  autoRefresh?: boolean;
  /** 刷新间隔（秒） */
  refreshInterval?: number;
  /** 自定义格式 */
  format?: 'full' | 'time' | 'date' | 'relative';
  /** 显示前缀文字 */
  prefix?: string;
  /** 显示后缀文字 */
  suffix?: string;
  /** 自定义类名 */
  className?: string;
  /** 更新时的回调 */
  onUpdate?: (timestamp: Date) => void;
}

/**
 * 格式化相对时间
 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return '刚刚';
  } else if (diffMin < 60) {
    return `${diffMin} 分钟前`;
  } else if (diffHour < 24) {
    return `${diffHour} 小时前`;
  } else if (diffDay < 7) {
    return `${diffDay} 天前`;
  } else {
    return date.toLocaleDateString('zh-CN');
  }
}

/**
 * 格式化完整时间
 */
function formatFullTime(date: Date): string {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * 格式化日期
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * 格式化时间
 */
function formatTime(date: Date): string {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * 更新时间显示组件
 * 
 * @example
 * // 显示完整时间
 * <UpdateTimestamp lastUpdated={Date.now()} format="full" />
 * 
 * // 显示相对时间
 * <UpdateTimestamp lastUpdated={Date.now()} relative />
 * 
 * // 自动刷新
 * <UpdateTimestamp lastUpdated={dataUpdatedAt} autoRefresh refreshInterval={30} />
 */
export function UpdateTimestamp({
  lastUpdated,
  relative = false,
  autoRefresh = false,
  refreshInterval = 30,
  format = 'full',
  prefix = '更新时间：',
  suffix = '',
  className = '',
  onUpdate,
}: UpdateTimestampProps) {
  const [displayTime, setDisplayTime] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // 初始化时间
  useEffect(() => {
    if (lastUpdated) {
      const date = lastUpdated instanceof Date ? lastUpdated : new Date(lastUpdated);
      setCurrentTime(date);
      onUpdate?.(date);
    }
  }, [lastUpdated, onUpdate]);

  // 格式化显示时间
  useEffect(() => {
    if (!currentTime) {
      setDisplayTime('--');
      return;
    }

    if (relative || format === 'relative') {
      setDisplayTime(formatRelativeTime(currentTime));
    } else if (format === 'time') {
      setDisplayTime(formatTime(currentTime));
    } else if (format === 'date') {
      setDisplayTime(formatDate(currentTime));
    } else {
      // 'full' 默认
      setDisplayTime(formatFullTime(currentTime));
    }
  }, [currentTime, relative, format]);

  // 自动刷新（用于相对时间）
  useEffect(() => {
    if (!autoRefresh || !currentTime) return;

    const interval = setInterval(() => {
      // 触发重新渲染以更新相对时间
      setCurrentTime(prev => prev ? new Date(prev.getTime()) : null);
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, currentTime, refreshInterval]);

  // 如果没有时间数据，不渲染
  if (!lastUpdated) {
    return null;
  }

  return (
    <span className={`update-timestamp ${className}`}>
      {prefix}
      <time dateTime={currentTime?.toISOString()}>
        {displayTime}
      </time>
      {suffix}
    </span>
  );
}

/**
 * 带图标的更新时间显示
 */
export function UpdateTimestampWithIcon({
  lastUpdated,
  ...props
}: UpdateTimestampProps) {
  return (
    <span className="update-timestamp-with-icon">
      <svg 
        className="timestamp-icon" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6V12L16 14" strokeLinecap="round" />
      </svg>
      <UpdateTimestamp lastUpdated={lastUpdated} {...props} />
    </span>
  );
}

/**
 * 数据加载状态的更新时间显示
 */
export function DataUpdateTimestamp({
  lastUpdated,
  isLoading,
  isStale,
  ...props
}: UpdateTimestampProps & {
  isLoading?: boolean;
  isStale?: boolean;
}) {
  if (isLoading) {
    return (
      <span className="update-timestamp loading">
        <span className="loading-dot" />
        加载中...
      </span>
    );
  }

  if (isStale) {
    return (
      <UpdateTimestampWithIcon
        lastUpdated={lastUpdated}
        suffix="（数据可能过期）"
        className="stale"
        {...props}
      />
    );
  }

  return (
    <UpdateTimestampWithIcon
      lastUpdated={lastUpdated}
      {...props}
    />
  );
}

export default UpdateTimestamp;
