'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FoodPage() {
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
          <p className="text-gray-600 mb-6">请先登录以探索美食</p>
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
        <h1 className="text-3xl font-bold mb-8">美食探索</h1>

        {/* 搜索栏 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="搜索城市或美食..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              搜索
            </button>
          </div>
        </div>

        {/* 美食分类 */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { emoji: '🍜', name: '面食', desc: '各地特色面食' },
            { emoji: '🍲', name: '火锅', desc: '麻辣鲜香' },
            { emoji: '🍣', name: '小吃', desc: '街头美食' },
            { emoji: '🍚', name: '主食', desc: '地方特色' },
          ].map((item) => (
            <div
              key={item.name}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition cursor-pointer"
            >
              <div className="text-5xl mb-4">{item.emoji}</div>
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* 推荐餐厅 */}
        <div>
          <h2 className="text-2xl font-bold mb-6">推荐餐厅</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-6xl">🍽️</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">特色餐厅 {i}</h3>
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                    <span className="text-gray-500 text-sm ml-2">(128 条评价)</span>
                  </div>
                  <p className="text-gray-600 text-sm">人均 ¥80-150</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
