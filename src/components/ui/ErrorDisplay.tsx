'use client';

import React, { useState, useEffect } from 'react';
import './ErrorDisplay.css';

export interface ErrorDisplayProps {
  title?: string;
  message: string;
  code?: string | number;
  icon?: 'error' | 'warning' | 'info' | 'network' | 'server' | 'notfound';
  variant?: 'inline' | 'banner' | 'modal' | 'toast';
  onRetry?: () => void;
  onDismiss?: () => void;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
  }>;
  showDetails?: boolean;
  technicalDetails?: string;
  autoDismiss?: number; // 自动消失时间（毫秒），仅用于 toast 模式
}

/**
 * 增强的错误显示组件
 * 支持多种变体和丰富的错误场景
 */
export function ErrorDisplay({
  title = '出错了',
  message,
  code,
  icon = 'error',
  variant = 'inline',
  onRetry,
  onDismiss,
  actions = [],
  showDetails = false,
  technicalDetails,
  autoDismiss,
}: ErrorDisplayProps) {
  const [expanded, setExpanded] = useState(showDetails);
  const [isDismissing, setIsDismissing] = useState(false);

  // Toast 模式自动消失
  useEffect(() => {
    if (variant === 'toast' && autoDismiss) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [variant, autoDismiss]);

  const handleDismiss = () => {
    setIsDismissing(true);
    setTimeout(() => {
      onDismiss?.();
    }, 300);
  };

  const handleRetry = () => {
    onRetry?.();
  };

  const icons = {
    error: (
      <svg className="error-icon" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
        <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
      </svg>
    ),
    warning: (
      <svg className="warning-icon" viewBox="0 0 24 24" fill="none">
        <path d="M12 3L2 20H22L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="17" r="1" fill="currentColor" />
      </svg>
    ),
    info: (
      <svg className="info-icon" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="8" r="1" fill="currentColor" />
      </svg>
    ),
    network: (
      <svg className="network-icon" viewBox="0 0 24 24" fill="none">
        <path d="M5 12.55C5 12.55 7.5 10 12 10C16.5 10 19 12.55 19 12.55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M8.5 15.5C8.5 15.5 10 14 12 14C14 14 15.5 15.5 15.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 20V20.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    server: (
      <svg className="server-icon" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="6" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="3" y="13" width="18" height="6" rx="2" stroke="currentColor" strokeWidth="2" />
        <circle cx="7" cy="8" r="1" fill="currentColor" />
        <circle cx="7" cy="16" r="1" fill="currentColor" />
        <path d="M17 8H17.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M17 16H17.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    notfound: (
      <svg className="notfound-icon" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M11 8V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 11H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  };

  const variantClasses = {
    inline: 'error-inline',
    banner: 'error-banner',
    modal: 'error-modal',
    toast: 'error-toast',
  };

  const content = (
    <div 
      className={`error-display ${variantClasses[variant]} ${isDismissing ? 'dismissing' : ''}`}
      role="alert"
      aria-live="assertive"
    >
      {/* 图标 */}
      <div className="error-icon-wrapper">
        {icons[icon]}
      </div>

      {/* 内容区域 */}
      <div className="error-content">
        {/* 标题 */}
        {title && (
          <h3 className="error-title">{title}</h3>
        )}

        {/* 错误消息 */}
        <p className="error-message">{message}</p>

        {/* 错误代码 */}
        {code && (
          <span className="error-code">错误代码：{code}</span>
        )}

        {/* 技术详情 */}
        {technicalDetails && (
          <div className={`error-details ${expanded ? 'expanded' : ''}`}>
            <button 
              className="error-details-toggle"
              onClick={() => setExpanded(!expanded)}
              type="button"
            >
              {expanded ? '隐藏详情' : '查看详情'}
            </button>
            {expanded && (
              <pre className="error-details-content">{technicalDetails}</pre>
            )}
          </div>
        )}

        {/* 操作按钮 */}
        <div className="error-actions">
          {onRetry && (
            <button 
              className="error-action-btn primary"
              onClick={handleRetry}
              type="button"
            >
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                <path d="M4 12C4 7.58172 7.58172 4 12 4C14.5 4 16.7 5.2 18.1 7.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M20 12C20 16.4183 16.4183 20 12 20C9.5 20 7.3 18.8 5.9 16.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 4H20V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 20H4V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              重试
            </button>
          )}
          
          {actions.map((action, index) => (
            <button
              key={index}
              className={`error-action-btn ${action.variant || 'secondary'}`}
              onClick={action.onClick}
              type="button"
            >
              {action.label}
            </button>
          ))}

          {onDismiss && variant === 'toast' && (
            <button 
              className="error-action-btn ghost"
              onClick={handleDismiss}
              type="button"
            >
              关闭
            </button>
          )}
        </div>
      </div>

      {/* 关闭按钮（Banner/Modal 模式） */}
      {onDismiss && variant !== 'toast' && variant !== 'inline' && (
        <button 
          className="error-dismiss-btn"
          onClick={handleDismiss}
          type="button"
          aria-label="关闭错误提示"
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );

  // Modal 模式需要 portal
  if (variant === 'modal') {
    return (
      <div className="error-modal-overlay">
        {content}
      </div>
    );
  }

  return content;
}

/**
 * 快捷错误组件 - 网络错误
 */
export function NetworkError({ onRetry, message }: { onRetry?: () => void; message?: string }) {
  return (
    <ErrorDisplay
      icon="network"
      title="网络连接失败"
      message={message || '请检查您的网络连接后重试'}
      onRetry={onRetry}
      variant="inline"
    />
  );
}

/**
 * 快捷错误组件 - 服务器错误
 */
export function ServerError({ onRetry, message }: { onRetry?: () => void; message?: string }) {
  return (
    <ErrorDisplay
      icon="server"
      title="服务器开小差了"
      message={message || '请稍后再试'}
      onRetry={onRetry}
      variant="inline"
    />
  );
}

/**
 * 快捷错误组件 - 404 错误
 */
export function NotFoundError({ onBack, message }: { onBack?: () => void; message?: string }) {
  return (
    <ErrorDisplay
      icon="notfound"
      title="页面未找到"
      message={message || '您访问的页面不存在或已被移除'}
      actions={onBack ? [{ label: '返回首页', onClick: onBack, variant: 'primary' }] : []}
      variant="banner"
    />
  );
}

/**
 * 快捷错误组件 - Toast 通知
 */
export function ErrorToast({ 
  message, 
  onDismiss, 
  autoDismiss = 5000 
}: { 
  message: string; 
  onDismiss?: () => void;
  autoDismiss?: number;
}) {
  return (
    <ErrorDisplay
      icon="error"
      title="错误"
      message={message}
      variant="toast"
      onDismiss={onDismiss}
      autoDismiss={autoDismiss}
    />
  );
}

/**
 * 错误边界显示组件（函数式）
 */
export function ErrorFallback({
  error,
  onRetry,
}: {
  error: Error;
  onRetry?: () => void;
}) {
  return (
    <ErrorDisplay
      icon="error"
      title="出错了"
      message={error.message || '未知错误，请稍后重试'}
      technicalDetails={process.env.NODE_ENV === 'development' ? error.stack : undefined}
      onRetry={onRetry}
      variant="banner"
    />
  );
}
