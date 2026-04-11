'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getBrowseHistory, clearBrowseHistory, getFavorites, removeFavorite, getUserItineraries } from '@/lib/database';

interface HistoryItem {
  id: string;
  page_type: string;
  page_title: string;
  viewed_at: string;
}

interface FavoriteItem {
  id: string;
  type: string;
  item_id: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'favorites'>('profile');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      loadHistory();
      loadFavorites();
    }
  }, [session]);

  const loadHistory = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    const data = await getBrowseHistory(session.user.id);
    setHistory(data);
    setLoading(false);
  };

  const loadFavorites = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    const data = await getFavorites(session.user.id);
    setFavorites(data);
    setLoading(false);
  };

  const handleClearHistory = async () => {
    if (!session?.user?.id) return;
    if (!confirm('确定要清除所有浏览历史吗？')) return;
    
    await clearBrowseHistory(session.user.id);
    setHistory([]);
  };

  const handleRemoveFavorite = async (itemId: string) => {
    if (!session?.user?.id) return;
    await removeFavorite(session.user.id, itemId);
    setFavorites(favorites.filter(f => f.item_id !== itemId));
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ff5a5f] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#767676]">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl">
              👤
            </div>
            <div>
              <h1 className="text-2xl font-bold">{session?.user?.name || '用户'}</h1>
              <p className="text-white/80">{session?.user?.email}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-[#ff5a5f] text-[#ff5a5f]'
                  : 'border-transparent text-[#767676]'
              }`}
            >
              个人资料
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-[#ff5a5f] text-[#ff5a5f]'
                  : 'border-transparent text-[#767676]'
              }`}
            >
              浏览历史
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'favorites'
                  ? 'border-[#ff5a5f] text-[#ff5a5f]'
                  : 'border-transparent text-[#767676]'
              }`}
            >
              收藏夹
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#484848] mb-4">个人信息</h2>
            
            <div>
              <label className="block text-sm font-medium text-[#767676] mb-2">
                邮箱
              </label>
              <input
                type="email"
                value={session?.user?.email || ''}
                disabled
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-[#767676]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#767676] mb-2">
                语言偏好
              </label>
              <select className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]">
                <option value="zh-CN">简体中文</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
                <option value="ko">한국어</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#767676] mb-2">
                预算范围
              </label>
              <select className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]">
                <option value="budget">经济型 (¥200-500/天)</option>
                <option value="medium">舒适型 (¥500-1000/天)</option>
                <option value="luxury">豪华型 (¥1000+/天)</option>
              </select>
            </div>

            <button className="w-full py-3 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
              保存设置
            </button>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full py-3 bg-gray-100 text-[#767676] rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              退出登录
            </button>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#484848]">浏览历史</h2>
              <button
                onClick={handleClearHistory}
                className="text-sm text-red-600 hover:text-red-700"
              >
                清除历史
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-[#ff5a5f] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-[#767676]">加载中...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                <div className="text-4xl mb-4">📜</div>
                <p className="text-[#767676]">暂无浏览历史</p>
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#484848]">{item.page_title}</p>
                    <p className="text-sm text-[#767676]">
                      {new Date(item.viewed_at).toLocaleString('zh-CN')}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-[#767676] text-xs rounded-full">
                    {item.page_type}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#484848] mb-4">收藏夹</h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-[#ff5a5f] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-[#767676]">加载中...</p>
              </div>
            ) : favorites.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                <div className="text-4xl mb-4">❤️</div>
                <p className="text-[#767676]">暂无收藏</p>
              </div>
            ) : (
              favorites.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#484848]">{item.item_id}</p>
                    <p className="text-sm text-[#767676]">
                      {item.type === 'itinerary' && '行程'}
                      {item.type === 'food' && '美食'}
                      {item.type === 'attraction' && '景点'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveFavorite(item.item_id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    移除
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
