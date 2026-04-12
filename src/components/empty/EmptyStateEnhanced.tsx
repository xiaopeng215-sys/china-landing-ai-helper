'use client';

import React from 'react';
import './EmptyStateEnhanced.css';

export interface EmptyStateProps {
  /** 空状态类型 */
  type?: 
    | 'no-data'
    | 'no-history'
    | 'no-favorites'
    | 'no-results'
    | 'no-messages'
    | 'no-notifications'
    | 'no-search'
    | 'offline'
    | 'first-time'
    | 'permission-denied'
    | 'expired'
    | 'custom';
  
  /** 标题 */
  title: string;
  
  /** 描述文本 */
  description?: string;
  
  /** 插图类型 */
  illustration?: 
    | 'explore'
    | 'search'
    | 'heart'
    | 'message'
    | 'bell'
    | 'wifi'
    | 'folder'
    | 'calendar'
    | 'star'
    | 'clock'
    | 'lock'
    | 'sparkles'
    | 'custom';
  
  /** 自定义插图（覆盖内置插图） */
  customIllustration?: React.ReactNode;
  
  /** 主要操作按钮 */
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  
  /** 次要操作按钮 */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  
  /** 推荐操作列表 */
  recommendations?: Array<{
    label: string;
    icon?: string;
    onClick: () => void;
  }>;
  
  /** 是否显示装饰元素 */
  showDecoration?: boolean;
  
  /** 自定义类名 */
  className?: string;
}

/**
 * 增强的空状态组件
 * 用于各种空数据、无内容场景
 */
export function EmptyStateEnhanced({
  type = 'custom',
  title,
  description,
  illustration = 'explore',
  customIllustration,
  primaryAction,
  secondaryAction,
  recommendations = [],
  showDecoration = true,
  className = '',
}: EmptyStateProps) {
  // 内置插图
  const illustrations: Record<string, React.ReactNode> = {
    explore: (
      <svg viewBox="0 0 200 200" fill="none" className="empty-illustration">
        <circle cx="100" cy="100" r="60" className="empty-circle-outer" />
        <circle cx="100" cy="100" r="25" className="empty-circle-inner" />
        <path d="M100 40 L100 70" className="empty-line" />
        <path d="M100 130 L100 160" className="empty-line" />
        <path d="M40 100 L70 100" className="empty-line" />
        <path d="M130 100 L160 100" className="empty-line" />
        <circle cx="100" cy="100" r="8" className="empty-center-dot" />
      </svg>
    ),
    search: (
      <svg viewBox="0 0 200 200" fill="none" className="empty-illustration">
        <circle cx="85" cy="85" r="50" className="empty-search-ring" />
        <line x1="120" y1="120" x2="155" y2="155" className="empty-search-handle" />
        <circle cx="85" cy="85" r="15" className="empty-search-magnifier" />
      </svg>
    ),
    heart: (
      <svg viewBox="0 0 200 200" fill="none" className="empty-illustration">
        <path 
          d="M100 165 L35 100 Q15 80 35 60 Q55 40 100 85 Q145 40 165 60 Q185 80 165 100 L100 165Z" 
          className="empty-heart"
        />
        <path 
          d="M100 150 L50 100 Q35 85 50 70 Q65 55 100 95 Q135 55 150 70 Q165 85 150 100 L100 150Z" 
          className="empty-heart-inner"
        />
      </svg>
    ),
    message: (
      <svg viewBox="0 0 200 200" fill="none" className="empty-illustration">
        <rect x="35" y="45" width="130" height="100" rx="12" className="empty-message-bubble" />
        <path d="M100 145 L100 175 L75 155" className="empty-message-tail" />
        <line x1="65" y1="80" x2="135" y2="80" className="empty-message-line" />
        <line x1="65" y1="100" x2="115" y2="100" className="empty-message-line short" />
        <line x1="65" y1="120" x2="125" y2="120" className="empty-message-line" />
      </svg>
    ),
    bell: (
      <svg viewBox="0 0 200 200" fill="none" className="empty-illustration">
        <path 
          d="M100 35 Q55 35 55 80 L55 125 L30 150 L170 150 L145 125 L145 80 Q145 35 100 35" 
          className="empty-bell"
        />
        <circle cx="100" cy="165" r="12" className="empty-bell-clapper" />
        <path d="M85 25 Q100 15 115 25" className="empty-bell-vibration" />
      </svg>
    ),
    wifi: (
      <svg viewBox="0 0 200 200" fill="none" className="empty-illustration">
        <path d="M35 75 Q100 10 165 75" className="empty-wifi-arc" />
        <path d="M55 95 Q100 50 145 95" className="empty-wifi-arc" />
        <path d="M75 115 Q100 90 125 115" className="empty-wifi-arc" />
        <line x1="100" y1="135" x2="100" y2="155" className="empty-wifi-dot-stem" />
        <circle cx="100" cy="165" r="6" className="empty-wifi-dot" />
        <line x1="90" y1="160" x2="110" y2="170" className="empty-wifi-cross" />
        <line x1="110" y1="160" x2="90" y2="170" className="empty-wifi-cross" />
      </svg>
    ),
    folder: (
      <svg viewBox="0 0 200 200" fill="none" className="empty-illustration">
        <path d="M30 50 L90 50 L110 70 L170 70 L170 150 L30 150 Z" className="empty-folder" />
        <path d="M50 90 L150 90" className="empty-folder-line" />
        <path d="M50 110 L150 110" className="empty-folder-line" />
        <path d="M50 130 L120 130" className="empty-folder-line short" />
      </svg>
    ),
    calendar: (
      <svg viewBox="0 0 200 200" fill="none" className="empty-illustration">
        <rect x="40" y="50" width="120" height="110" rx="8" className="empty-calendar-body" />
        <line x1="40" y1="75" x2="160" y2="75" className="empty-calendar-header" />
        <line x1="70" y1="45" x2="70" y2="60" className="empty-calendar-loop" />
        <line x1="130" y1="45" x2="130" y2="60" className="empty-calendar-loop" />
        <circle cx="75" cy="95" r="4" className="empty-calendar-dot" />
        <circle cx="100" cy="95" r="4" className="empty-calendar-dot" />
        <circle cx="125" cy="95" r="4" className="empty-calendar-dot" />
      </svg>
    ),
    star: (
      <svg viewBox="0 0 200 200" fill="none" className="empty-illustration">
        <path 
          d="M100 25 L120 70 L170 70 L130 100 L145 150 L100 120 L55 150 L70 100 L30 70 L80 70 Z" 
          className="empty-star"
        />
        <path 
          d="M100 45 L112 75 L145 75 L118 95 L128 125 L100 105 L72 125 L82 95 L55 75 L88 75 Z" 
          className="empty-star-inner"
        />
      </svg>
    ),
    clock: (
      <svg viewBox="0 0 200 200" fill="none" className="empty-illustration">
        <circle cx="100" cy="100" r="65" className="empty-clock-face" />
        <line x1="100" y1="100" x2="100" y2="60" className="empty-clock-hand-hour" />
        <line x1="100" y1="100" x2="140" y2="100" className="empty-clock-hand-minute" />
        <circle cx="100" cy="100" r="5" className="empty-clock-center" />
        <line x1="100" y1="30" x2="100" y2="40" className="empty-clock-mark" />
        <line x1="170" y1="100" x2="160" y2="100" className="empty-clock-mark" />
        <line x1="100" y1="170" x2="100" y2="160" className="empty-clock-mark" />
        <line x1="30" y1="100" x2="40" y2="100" className="empty-clock-mark" />
      </svg>
    ),
    lock: (
      <svg viewBox="0 0 200 200" fill="none" className="empty-illustration">
        <rect x="55" y="85" width="90" height="75" rx="8" className="empty-lock-body" />
        <path d="M75 85 V65 Q75 45 100 45 Q125 45 125 65 V85" className="empty-lock-shackle" />
        <circle cx="100" cy="115" r="10" className="empty-lock-hole" />
        <path d="M100 105 L100 115 L110 120" className="empty-lock-key" />
      </svg>
    ),
    sparkles: (
      <svg viewBox="0 0 200 200" fill="none" className="empty-illustration">
        <path d="M100 30 L110 60 L140 60 L115 80 L125 110 L100 90 L75 110 L85 80 L60 60 L90 60 Z" className="empty-sparkle-large" />
        <circle cx="150" cy="50" r="5" className="empty-sparkle-small" />
        <circle cx="50" cy="70" r="4" className="empty-sparkle-small" />
        <circle cx="160" cy="100" r="3" className="empty-sparkle-tiny" />
        <circle cx="40" cy="120" r="3" className="empty-sparkle-tiny" />
        <path d="M130 130 L135 145 L150 145 L138 155 L143 170 L130 160 L117 170 L122 155 L110 145 L125 145 Z" className="empty-sparkle-medium" />
      </svg>
    ),
  };

  const renderIllustration = () => {
    if (customIllustration) {
      return customIllustration;
    }
    return illustrations[illustration] || illustrations.explore;
  };

  return (
    <div className={`empty-state ${className}`}>
      {/* 装饰背景 */}
      {showDecoration && (
        <div className="empty-decoration" aria-hidden="true">
          <div className="empty-decoration-circle" />
          <div className="empty-decoration-circle delay-1" />
          <div className="empty-decoration-circle delay-2" />
        </div>
      )}

      {/* 主要内容 */}
      <div className="empty-content">
        {/* 插图 */}
        <div className="empty-illustration-wrapper">
          {renderIllustration()}
        </div>

        {/* 标题 */}
        <h2 className="empty-title">{title}</h2>

        {/* 描述 */}
        {description && (
          <p className="empty-description">{description}</p>
        )}

        {/* 操作按钮 */}
        {(primaryAction || secondaryAction) && (
          <div className="empty-actions">
            {primaryAction && (
              <button
                className="empty-action-btn primary"
                onClick={primaryAction.onClick}
                type="button"
              >
                {primaryAction.icon && (
                  <span className="empty-action-icon">{primaryAction.icon}</span>
                )}
                {primaryAction.label}
              </button>
            )}
            
            {secondaryAction && (
              <button
                className="empty-action-btn secondary"
                onClick={secondaryAction.onClick}
                type="button"
              >
                {secondaryAction.label}
              </button>
            )}
          </div>
        )}

        {/* 推荐操作 */}
        {recommendations.length > 0 && (
          <div className="empty-recommendations">
            <p className="empty-recommendations-title">或者试试这些</p>
            <div className="empty-recommendations-list">
              {recommendations.map((rec, index) => (
                <button
                  key={index}
                  className="empty-recommendation-chip"
                  onClick={rec.onClick}
                  type="button"
                >
                  {rec.icon && <span className="empty-chip-icon">{rec.icon}</span>}
                  {rec.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 预设空状态配置
 */
export const emptyStatePresets = {
  noData: {
    type: 'no-data' as const,
    title: '暂无数据',
    description: '数据正在加载中，请稍后再试',
    illustration: 'folder' as const,
  },
  noHistory: {
    type: 'no-history' as const,
    title: '还没有浏览历史',
    description: '去探索精彩的中国之旅吧',
    illustration: 'clock' as const,
  },
  noFavorites: {
    type: 'no-favorites' as const,
    title: '还没有收藏',
    description: '看到喜欢的内容就收藏起来，方便随时查看',
    illustration: 'heart' as const,
  },
  noResults: {
    type: 'no-results' as const,
    title: '没有找到匹配结果',
    description: '换个关键词试试，或者浏览热门推荐',
    illustration: 'search' as const,
  },
  noMessages: {
    type: 'no-messages' as const,
    title: '还没有消息',
    description: '当你收到新消息时，会显示在这里',
    illustration: 'message' as const,
  },
  noNotifications: {
    type: 'no-notifications' as const,
    title: '还没有通知',
    description: '重要更新和提醒会显示在这里',
    illustration: 'bell' as const,
  },
  offline: {
    type: 'offline' as const,
    title: '网络连接已断开',
    description: '请检查网络设置后重试',
    illustration: 'wifi' as const,
  },
  firstTime: {
    type: 'first-time' as const,
    title: '欢迎开始你的中国之旅',
    description: '让我帮你规划完美的行程',
    illustration: 'sparkles' as const,
  },
  permissionDenied: {
    type: 'permission-denied' as const,
    title: '暂无权限',
    description: '你还没有权限查看此内容',
    illustration: 'lock' as const,
  },
  expired: {
    type: 'expired' as const,
    title: '内容已过期',
    description: '此内容已失效或已被删除',
    illustration: 'clock' as const,
  },
};

/**
 * 快捷空状态组件
 */
export function NoData({ onRefresh }: { onRefresh?: () => void }) {
  const preset = emptyStatePresets.noData;
  return (
    <EmptyStateEnhanced
      {...preset}
      primaryAction={onRefresh ? { label: '刷新', onClick: onRefresh } : undefined}
    />
  );
}

export function NoHistory({ onExplore }: { onExplore?: () => void }) {
  const preset = emptyStatePresets.noHistory;
  return (
    <EmptyStateEnhanced
      {...preset}
      primaryAction={onExplore ? { label: '浏览推荐', onClick: onExplore } : undefined}
    />
  );
}

export function NoFavorites({ onExplore }: { onExplore?: () => void }) {
  const preset = emptyStatePresets.noFavorites;
  return (
    <EmptyStateEnhanced
      {...preset}
      primaryAction={onExplore ? { label: '去探索', onClick: onExplore } : undefined}
    />
  );
}

export function NoResults({ 
  onClear, 
  onBrowse 
}: { 
  onClear?: () => void; 
  onBrowse?: () => void;
}) {
  const preset = emptyStatePresets.noResults;
  return (
    <EmptyStateEnhanced
      {...preset}
      primaryAction={onBrowse ? { label: '浏览热门', onClick: onBrowse } : undefined}
      secondaryAction={onClear ? { label: '清除筛选', onClick: onClear } : undefined}
    />
  );
}

export function Offline({ onRetry }: { onRetry?: () => void }) {
  const preset = emptyStatePresets.offline;
  return (
    <EmptyStateEnhanced
      {...preset}
      primaryAction={onRetry ? { label: '重试', onClick: onRetry } : undefined}
    />
  );
}

export function FirstTime({ onStart }: { onStart?: () => void }) {
  const preset = emptyStatePresets.firstTime;
  return (
    <EmptyStateEnhanced
      {...preset}
      primaryAction={onStart ? { label: '开始规划', onClick: onStart } : undefined}
    />
  );
}
