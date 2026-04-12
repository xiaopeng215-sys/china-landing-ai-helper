'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TripsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
          <p className="text-gray-600 mb-6">请先登录以查看您的行程</p>
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
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">我的行程</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            + 新建行程
          </button>
        </div>

        {/* 行程列表 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 空状态 */}
          <div className="col-span-full bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-xl font-semibold mb-2">暂无行程</h2>
            <p className="text-gray-600 mb-6">创建您的第一个旅行行程</p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              开始规划
            </button>
          </div>
        </div>

        {/* 热门目的地 */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">热门目的地</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {['北京', '上海', '广州', '成都'].map((city) => (
              <div
                key={city}
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition cursor-pointer"
              >
                <div className="text-3xl mb-2">🏯</div>
                <h3 className="font-semibold">{city}</h3>
                <p className="text-sm text-gray-500">点击查看</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
