'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getBrowseHistory, clearBrowseHistory, getFavorites, removeFavorite, getUserItineraries } from '@/lib/database';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';

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
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'history' | 'favorites'>('profile');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Settings state
  const [language, setLanguage] = useState('zh-CN');
  const [budget, setBudget] = useState('medium');
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

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

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('两次输入的密码不一致');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('密码至少需要 6 个字符');
      return;
    }

    try {
      // TODO: Implement password change API
      alert('密码修改成功');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
    } catch (error) {
      setPasswordError('密码修改失败，请重试');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('确定要删除账号吗？此操作不可恢复！')) return;
    
    try {
      // TODO: Implement account deletion API
      alert('账号已删除');
      signOut({ callbackUrl: '/' });
    } catch (error) {
      alert('删除失败，请重试');
    }
  };

  const handleExportData = async () => {
    if (!session?.user?.id) return;
    
    try {
      // TODO: Implement data export API
      const data = {
        user: session.user,
        history,
        favorites,
        itineraries: await getUserItineraries(session.user.id),
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `china-ai-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      alert('数据导出成功');
    } catch (error) {
      alert('数据导出失败，请重试');
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem('china-ai-language', language);
    localStorage.setItem('china-ai-budget', budget);
    localStorage.setItem('china-ai-theme', theme);
    localStorage.setItem('china-ai-notifications', notifications.toString());
    alert('设置已保存');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center animate-bounce-in">
          <div className="w-16 h-16 border-4 border-[#ff5a5f] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#767676] font-medium">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* Header */}
      <header className="bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white py-8 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-10 w-20 h-20 bg-white rounded-full animate-float"></div>
          <div className="absolute bottom-8 right-20 w-32 h-32 bg-white rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 animate-slide-up">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl shadow-lg hover:scale-110 transition-transform duration-300">
              👤
            </div>
            <div>
              <h1 className="text-2xl font-bold animate-fade-in">{session?.user?.name || '用户'}</h1>
              <p className="text-white/80 animate-fade-in" style={{ animationDelay: '0.1s' }}>{session?.user?.email}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-[#ff5a5f] text-[#ff5a5f]'
                  : 'border-transparent text-[#767676]'
              }`}
            >
              个人资料
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-[#ff5a5f] text-[#ff5a5f]'
                  : 'border-transparent text-[#767676]'
              }`}
            >
              设置
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'history'
                  ? 'border-[#ff5a5f] text-[#ff5a5f]'
                  : 'border-transparent text-[#767676]'
              }`}
            >
              浏览历史
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
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
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl shadow-md p-4 text-center border border-gray-100 hover-lift stagger-item">
                <div className="text-2xl mb-2 animate-float">📅</div>
                <div className="text-2xl font-bold text-[#484848]">0</div>
                <div className="text-xs text-[#767676]">行程</div>
              </div>
              <div className="bg-white rounded-2xl shadow-md p-4 text-center border border-gray-100 hover-lift stagger-item">
                <div className="text-2xl mb-2 animate-float" style={{ animationDelay: '0.5s' }}>❤️</div>
                <div className="text-2xl font-bold text-[#484848]">{favorites.length}</div>
                <div className="text-xs text-[#767676]">收藏</div>
              </div>
              <div className="bg-white rounded-2xl shadow-md p-4 text-center border border-gray-100 hover-lift stagger-item">
                <div className="text-2xl mb-2 animate-float" style={{ animationDelay: '1s' }}>📜</div>
                <div className="text-2xl font-bold text-[#484848]">{history.length}</div>
                <div className="text-xs text-[#767676]">历史</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-md p-6 space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-lg font-bold text-[#484848] mb-4">快捷操作</h2>
              
              <button
                onClick={() => router.push('/install-guide')}
                className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-[#ff5a5f]/10 to-[#ff3b3f]/10 rounded-xl hover:from-[#ff5a5f]/20 hover:to-[#ff3b3f]/20 transition-all hover-lift tap-feedback group"
              >
                <div className="text-2xl group-hover:scale-110 transition-transform">📱</div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-[#484848]">安装应用</p>
                  <p className="text-sm text-[#767676]">添加到主屏幕，快速访问</p>
                </div>
                <div className="text-[#ff5a5f] group-hover:translate-x-1 transition-transform">→</div>
              </button>

              <button
                onClick={handleExportData}
                className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all hover-lift tap-feedback group"
              >
                <div className="text-2xl group-hover:scale-110 transition-transform">💾</div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-[#484848]">导出数据</p>
                  <p className="text-sm text-[#767676]">下载您的个人数据</p>
                </div>
                <div className="text-[#767676] group-hover:translate-x-1 transition-transform">→</div>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Account Settings */}
            <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
              <h2 className="text-lg font-bold text-[#484848] mb-4">账号设置</h2>
              
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

              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
              >
                <div className="text-2xl">🔐</div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-[#484848]">修改密码</p>
                </div>
                <div className="text-[#767676]">→</div>
              </button>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-2xl shadow-md p-6 space-y-4 animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <h2 className="text-lg font-bold text-[#484848] mb-4">偏好设置</h2>
              
              <div className="stagger-item">
                <label className="block text-sm font-medium text-[#767676] mb-2">
                  语言偏好
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] tap-feedback"
                >
                  <option value="zh-CN">简体中文</option>
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                  <option value="ko">한국어</option>
                </select>
              </div>

              <div className="stagger-item">
                <label className="block text-sm font-medium text-[#767676] mb-2">
                  预算范围
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] tap-feedback"
                >
                  <option value="budget">经济型 (¥200-500/天)</option>
                  <option value="medium">舒适型 (¥500-1000/天)</option>
                  <option value="luxury">豪华型 (¥1000+/天)</option>
                </select>
              </div>

              <div className="stagger-item">
                <label className="block text-sm font-medium text-[#767676] mb-2">
                  主题
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] tap-feedback"
                >
                  <option value="light">浅色</option>
                  <option value="dark">深色</option>
                  <option value="auto">跟随系统</option>
                </select>
              </div>

              <div className="flex items-center justify-between stagger-item">
                <div>
                  <p className="font-medium text-[#484848]">通知</p>
                  <p className="text-sm text-[#767676]">接收重要提醒</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-colors tap-feedback ${
                    notifications ? 'bg-[#ff5a5f]' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <button
                onClick={handleSaveSettings}
                className="w-full py-3 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover-lift tap-feedback animate-pulse"
              >
                保存设置
              </button>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-red-200 animate-slide-up" style={{ animationDelay: '0.25s' }}>
              <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                <span className="animate-pulse">⚠️</span>
                危险区域
              </h2>
              
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full py-3 bg-red-100 text-red-600 rounded-xl font-semibold hover:bg-red-200 transition-all hover-lift tap-feedback"
              >
                删除账号
              </button>
              <p className="text-xs text-[#767676] mt-2 text-center">
                此操作不可恢复，请谨慎操作
              </p>
            </div>
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

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-bounce-in">
            <h2 className="text-xl font-bold text-[#484848] mb-4">修改密码</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#767676] mb-2">
                  当前密码
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]"
                  placeholder="输入当前密码"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#767676] mb-2">
                  新密码
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]"
                  placeholder="输入新密码"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#767676] mb-2">
                  确认新密码
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]"
                  placeholder="确认新密码"
                />
              </div>

              {passwordError && (
                <p className="text-red-600 text-sm">{passwordError}</p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError('');
                }}
                className="flex-1 py-3 bg-gray-100 text-[#767676] rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                取消
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 py-3 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-bounce-in">
            <div className="text-4xl mb-4 text-center animate-wiggle">⚠️</div>
            <h2 className="text-xl font-bold text-red-600 mb-4 text-center">删除账号</h2>
            
            <p className="text-[#767676] mb-6 text-center">
              此操作将永久删除您的账号和所有数据，且无法恢复。确定要继续吗？
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 bg-gray-100 text-[#767676] rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                取消
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
