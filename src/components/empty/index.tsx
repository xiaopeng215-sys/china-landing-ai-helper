'use client';

import React from 'react';

// 导出增强版空状态组件
export {
  EmptyStateEnhanced,
  emptyStatePresets,
  NoData as NoDataEnhanced,
  NoHistory as NoHistoryEnhanced,
  NoFavorites as NoFavoritesEnhanced,
  NoResults as NoResultsEnhanced,
  Offline as OfflineEnhanced,
  FirstTime as FirstTimeEnhanced,
} from './EmptyStateEnhanced';

// 旧版组件定义
interface EmptyStateProps {
  type: 
    | 'no-history'
    | 'no-favorites'
    | 'no-results'
    | 'no-messages'
    | 'no-notifications'
    | 'offline'
    | 'first-time';
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void; icon?: React.ReactNode };
  secondaryAction?: { label: string; onClick: () => void };
  illustration?: 'explore' | 'search' | 'heart' | 'message' | 'bell' | 'wifi';
  recommendations?: Array<{ title: string; onClick: () => void }>;
}

/**
 * 空状态组件
 * 用于：各种空数据场景
 */
export function EmptyState({
  type, title, description, action, secondaryAction, 
  illustration = 'explore', recommendations = []
}: EmptyStateProps) {
  const illustrations = {
    explore: (
      <svg className="w-32 h-32" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="60" stroke="#E5E7EB" strokeWidth="4" />
        <circle cx="100" cy="100" r="20" fill="#F3F4F6" />
        <path d="M100 40 L100 70" stroke="#6366F1" strokeWidth="4" strokeLinecap="round" />
        <path d="M100 130 L100 160" stroke="#6366F1" strokeWidth="4" strokeLinecap="round" />
        <path d="M40 100 L70 100" stroke="#6366F1" strokeWidth="4" strokeLinecap="round" />
        <path d="M130 100 L160 100" stroke="#6366F1" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
    search: (
      <svg className="w-32 h-32" viewBox="0 0 200 200" fill="none">
        <circle cx="90" cy="90" r="50" stroke="#E5E7EB" strokeWidth="8" fill="none" />
        <line x1="125" y1="125" x2="160" y2="160" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
        <text x="90" y="105" textAnchor="middle" fontSize="40" fill="#E5E7EB">?</text>
      </svg>
    ),
    heart: (
      <svg className="w-32 h-32" viewBox="0 0 200 200" fill="none">
        <path d="M100 160 L40 100 Q20 80 40 60 Q60 40 100 80 Q140 40 160 60 Q180 80 160 100 L100 160Z" 
              stroke="#E5E7EB" strokeWidth="8" fill="none" />
      </svg>
    ),
    message: (
      <svg className="w-32 h-32" viewBox="0 0 200 200" fill="none">
        <rect x="40" y="50" width="120" height="100" rx="12" stroke="#E5E7EB" strokeWidth="8" fill="none" />
        <path d="M100 150 L100 180 L80 160" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="70" y1="90" x2="130" y2="90" stroke="#E5E7EB" strokeWidth="6" strokeLinecap="round" />
        <line x1="70" y1="110" x2="110" y2="110" stroke="#E5E7EB" strokeWidth="6" strokeLinecap="round" />
      </svg>
    ),
    bell: (
      <svg className="w-32 h-32" viewBox="0 0 200 200" fill="none">
        <path d="M100 40 Q60 40 60 80 L60 120 L40 140 L160 140 L140 120 L140 80 Q140 40 100 40" 
              stroke="#E5E7EB" strokeWidth="8" fill="none" />
        <circle cx="100" cy="160" r="12" fill="#E5E7EB" />
      </svg>
    ),
    wifi: (
      <svg className="w-32 h-32" viewBox="0 0 200 200" fill="none">
        <path d="M40 80 Q100 20 160 80" stroke="#E5E7EB" strokeWidth="8" fill="none" />
        <path d="M60 100 Q100 60 140 100" stroke="#E5E7EB" strokeWidth="8" fill="none" />
        <path d="M80 120 Q100 100 120 120" stroke="#E5E7EB" strokeWidth="8" fill="none" />
        <line x1="100" y1="140" x2="100" y2="160" stroke="#9CA3AF" strokeWidth="8" />
        <circle cx="100" cy="170" r="6" fill="#9CA3AF" />
      </svg>
    ),
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 插图 */}
        <div className="mb-6 flex justify-center">
          {illustrations[illustration]}
        </div>
        
        {/* 标题 */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {title}
        </h2>
        
        {/* 描述 */}
        {description && (
          <p className="text-gray-600 mb-8">{description}</p>
        )}
        
        {/* 主要按钮 */}
        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all mb-4"
          >
            {action.icon}
            {action.label}
          </button>
        )}
        
        {/* 次要按钮 */}
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            {secondaryAction.label}
          </button>
        )}
        
        {/* 推荐内容 */}
        {recommendations.length > 0 && (
          <div className="mt-8">
            <p className="text-sm text-gray-500 mb-4">或者试试这些</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {recommendations.map((rec, i) => (
                <button
                  key={i}
                  onClick={rec.onClick}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {rec.title}
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
 * 可直接使用这些配置快速创建常见空状态
 */
export const emptyStateConfigs = {
  noHistory: {
    type: 'no-history' as const,
    title: '还没有浏览历史',
    description: '去探索精彩的中国之旅吧',
    illustration: 'explore' as const,
  },
  noFavorites: {
    type: 'no-favorites' as const,
    title: '还没有收藏',
    description: '看到喜欢的就收藏起来，方便随时查看',
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
    illustration: 'explore' as const,
  },
};

interface NoHistoryProps {
  onExplore?: () => void;
}

/**
 * 无历史记录空状态
 */
export function NoHistory({ onExplore }: NoHistoryProps) {
  const config = emptyStateConfigs.noHistory;
  
  return (
    <EmptyState
      {...config}
      action={onExplore ? { label: '浏览推荐', onClick: onExplore } : undefined}
    />
  );
}

/**
 * 无收藏空状态
 */
export function NoFavorites({ onExplore }: NoHistoryProps) {
  const config = emptyStateConfigs.noFavorites;
  
  return (
    <EmptyState
      {...config}
      action={onExplore ? { label: '去探索', onClick: onExplore } : undefined}
    />
  );
}

/**
 * 搜索无结果空状态
 */
export function NoResults({ 
  onClear, 
  onBrowse 
}: { 
  onClear?: () => void; 
  onBrowse?: () => void;
}) {
  const config = emptyStateConfigs.noResults;
  
  return (
    <EmptyState
      {...config}
      action={onBrowse ? { label: '浏览热门', onClick: onBrowse } : undefined}
      secondaryAction={onClear ? { label: '清除筛选', onClick: onClear } : undefined}
    />
  );
}

/**
 * 离线空状态
 */
export function Offline({ onRetry }: { onRetry?: () => void }) {
  const config = emptyStateConfigs.offline;
  
  return (
    <EmptyState
      {...config}
      action={onRetry ? { label: '重试', onClick: onRetry } : undefined}
    />
  );
}

/**
 * 首次使用空状态
 */
export function FirstTime({ onStart }: { onStart?: () => void }) {
  const config = emptyStateConfigs.firstTime;
  
  return (
    <EmptyState
      {...config}
      action={onStart ? { label: '开始规划', onClick: onStart } : undefined}
    />
  );
}
