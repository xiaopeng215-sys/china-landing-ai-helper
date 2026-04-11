'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-4xl mb-4">😕</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            出错了
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {this.state.error?.message || '未知错误，请稍后重试'}
          </p>
          <button
            onClick={this.handleRetry}
            className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors"
          >
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 函数式错误处理组件（用于非临界错误）
export function ErrorMessage({
  message,
  onRetry,
  className = '',
}: {
  message: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={`p-4 bg-red-50 border border-red-200 rounded-xl ${className}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl">⚠️</span>
        <div className="flex-1">
          <p className="text-sm text-red-800">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-xs text-red-600 font-medium hover:underline"
            >
              重试
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
