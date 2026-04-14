'use client';

import React from 'react';

interface ErrorBannerProps {
  type: 'network' | 'server' | 'auth' | 'generic';
  message: string;
  details?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

/**
 * 错误横幅组件
 * 用于：全局错误、网络断开
 */
export function ErrorBanner({ 
  type, message, details, onRetry, onDismiss 
}: ErrorBannerProps) {
  const config = {
    network: {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      ),
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
    },
    server: {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      ),
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-200',
    },
    auth: {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
    },
    generic: {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: 'bg-gray-50',
      text: 'text-gray-800',
      border: 'border-gray-200',
    },
  };

  const { icon, bg, text, border } = config[type];

  return (
    <div className={`${bg} ${border} border rounded-xl p-4 mb-4`}>
      <div className="flex items-start gap-3">
        <div className={`${text} flex-shrink-0`}>{icon}</div>
        
        <div className="flex-1">
          <p className={`font-semibold ${text}`}>{message}</p>
          {details && (
            <p className="text-sm text-gray-600 mt-1">{details}</p>
          )}
        </div>
        
        <div className="flex gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1.5 text-sm font-medium bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              重试
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="关闭"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  type: 'loading-failed' | 'not-found' | 'forbidden' | 'server-error' | 'offline';
  title: string;
  description?: string;
  onRetry?: () => void;
  onBack?: () => void;
  action?: { label: string; onClick: () => void };
}

/**
 * 错误状态组件 (页面级)
 * 用于：页面级错误、加载失败
 */
export function ErrorState({ 
  type, title, description, onRetry, onBack, action 
}: ErrorStateProps) {
  const illustrations = {
    'loading-failed': (
      <svg className="w-32 h-32" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="80" stroke="#E5E7EB" strokeWidth="8" />
        <path d="M100 40 L100 100 L140 120" stroke="#EF4444" strokeWidth="8" strokeLinecap="round" />
        <circle cx="100" cy="100" r="8" fill="#EF4444" />
      </svg>
    ),
    'not-found': (
      <svg className="w-32 h-32" viewBox="0 0 200 200" fill="none">
        <text x="100" y="120" textAnchor="middle" fontSize="80" fill="#E5E7EB">404</text>
      </svg>
    ),
    'forbidden': (
      <svg className="w-32 h-32" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="60" stroke="#E5E7EB" strokeWidth="8" />
        <line x1="70" y1="100" x2="130" y2="100" stroke="#EF4444" strokeWidth="8" strokeLinecap="round" />
        <text x="100" y="85" textAnchor="middle" fontSize="24" fill="#E5E7EB">🔒</text>
      </svg>
    ),
    'server-error': (
      <svg className="w-32 h-32" viewBox="0 0 200 200" fill="none">
        <rect x="60" y="50" width="80" height="100" rx="8" stroke="#E5E7EB" strokeWidth="8" fill="none" />
        <line x1="80" y1="80" x2="120" y2="80" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
        <line x1="80" y1="100" x2="120" y2="100" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
        <line x1="80" y1="120" x2="100" y2="120" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
        <circle cx="100" cy="40" r="8" fill="#EF4444" />
      </svg>
    ),
    'offline': (
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
          {illustrations[type] || illustrations['loading-failed']}
        </div>
        
        {/* 标题 */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {title}
        </h2>
        
        {/* 描述 */}
        {description && (
          <p className="text-gray-600 mb-8">{description}</p>
        )}
        
        {/* 按钮组 */}
        <div className="flex gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              重试
            </button>
          )}
          {onBack && (
            <button
              onClick={onBack}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              返回
            </button>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className="px-6 py-3 bg-amber-50 text-amber-600 rounded-xl font-semibold hover:bg-amber-100 transition-all"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface InlineErrorProps {
  message: string;
  icon?: boolean;
}

/**
 * 行内错误提示
 * 用于：表单验证错误、单项加载失败
 */
export function InlineError({ message, icon = true }: InlineErrorProps) {
  return (
    <div className="flex items-center gap-2 text-red-600 text-sm">
      {icon && (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      <span>{message}</span>
    </div>
  );
}

interface LoadingErrorProps {
  message?: string;
  onRetry?: () => void;
}

/**
 * 加载错误组件
 * 用于：数据加载失败时的内联提示
 */
export function LoadingError({ message = '加载失败', onRetry }: LoadingErrorProps) {
  return (
    <div className="flex items-center justify-center p-8 text-center">
      <div className="max-w-sm">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <p className="text-gray-900 font-semibold mb-2">{message}</p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-[#ff5a5f] hover:text-[#ff3b3f] font-medium text-sm"
          >
              点击重试
          </button>
        )}
      </div>
    </div>
  );
}
