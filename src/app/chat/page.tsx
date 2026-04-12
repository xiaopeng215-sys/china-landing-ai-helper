'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查用户登录状态
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const session = await res.json();
        setIsAuthenticated(!!session?.user);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">需要登录</h1>
          <p className="text-gray-600 mb-6">请先登录以使用 AI 对话功能</p>
          <button
            onClick={() => router.push('/auth/signin')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            立即登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">AI 旅行助手</h1>
        
        {/* 聊天区域 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
          <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center text-gray-500">
              <p className="text-lg mb-2">💬 AI 对话功能</p>
              <p className="text-sm">准备为您提供旅行咨询服务</p>
            </div>
          </div>
        </div>

        {/* 快捷问题 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="p-3 bg-white rounded-lg shadow hover:shadow-md transition text-sm">
            🗺️ 行程规划
          </button>
          <button className="p-3 bg-white rounded-lg shadow hover:shadow-md transition text-sm">
            🍜 美食推荐
          </button>
          <button className="p-3 bg-white rounded-lg shadow hover:shadow-md transition text-sm">
            🚇 交通指南
          </button>
          <button className="p-3 bg-white rounded-lg shadow hover:shadow-md transition text-sm">
            💰 预算建议
          </button>
        </div>
      </div>
    </div>
  );
}
