'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OfflinePage() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline) {
      const timer = setTimeout(() => {
        router.push('/');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#ff5a5f] to-[#ff3b3f] rounded-full flex items-center justify-center shadow-2xl animate-pulse">
            <svg
              className="w-16 h-16 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.828-2.828m2.828 2.828L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.828-2.828m-4.244 2.828a5 5 0 01-1.414-1.414M6 6a9 9 0 019 9M6 6l2.828 2.828M6 6L3.172 8.828m2.828-2.828L3 3m15.364 12.728L21 18.364"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-[#484848] mb-4">
          离线模式
        </h1>

        {/* Message */}
        <p className="text-[#767676] text-lg mb-8">
          {isOnline 
            ? '网络连接已恢复，正在返回...' 
            : '当前无法连接到网络，请检查您的网络连接'}
        </p>

        {/* Status Indicator */}
        <div className="mb-8">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            isOnline 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isOnline ? 'bg-green-500' : 'bg-red-500'
            } animate-pulse`} />
            <span className="text-sm font-medium">
              {isOnline ? '已连接' : '未连接'}
            </span>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-left">
          <h3 className="font-bold text-[#484848] mb-3">💡 小贴士</h3>
          <ul className="space-y-2 text-sm text-[#767676]">
            <li className="flex items-start gap-2">
              <span className="text-[#ff5a5f]">•</span>
              <span>部分已缓存的内容仍可浏览</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ff5a5f]">•</span>
              <span>检查 Wi-Fi 或移动数据设置</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ff5a5f]">•</span>
              <span>尝试刷新页面重新连接</span>
            </li>
          </ul>
        </div>

        {/* Retry Button */}
        {!isOnline && (
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            重试连接
          </button>
        )}

        {/* Go Home Button */}
        <button
          onClick={() => router.push('/')}
          className="mt-4 px-8 py-3 bg-gray-100 text-[#767676] rounded-xl font-semibold hover:bg-gray-200 transition-all"
        >
          返回首页
        </button>
      </div>
    </div>
  );
}
