'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-[#484848] mb-2">
              出错了
            </h1>

            <p className="text-[#767676] mb-6">
              {this.state.error?.message || '发生了未知错误'}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                刷新页面
              </button>
              <button
                onClick={this.handleRetry}
                className="flex-1 px-4 py-3 bg-gray-100 text-[#767676] rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                重试
              </button>
            </div>

            <p className="text-xs text-[#767676] mt-4">
              如果问题持续，请联系客服
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
