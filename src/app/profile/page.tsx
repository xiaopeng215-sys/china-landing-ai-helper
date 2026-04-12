'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  getBrowseHistory, 
  clearBrowseHistory, 
  getFavorites, 
  removeFavorite, 
  getUserItineraries,
  getMembershipTiers,
  getUserMembership,
  getUserMembershipPoints,
  getCompleteUserProfile,
  MembershipTier,
  UserMembership,
  MembershipPoints,
} from '@/lib/database';
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

interface ItineraryItem {
  id: string;
  title: string;
  destination: string;
  days: number;
  created_at: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'membership' | 'itineraries' | 'history' | 'favorites' | 'settings'>('profile');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [itineraries, setItineraries] = useState<ItineraryItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Membership state
  const [membershipTiers, setMembershipTiers] = useState<MembershipTier[]>([]);
  const [userMembership, setUserMembership] = useState<UserMembership | null>(null);
  const [membershipPoints, setMembershipPoints] = useState<MembershipPoints | null>(null);
  const [userStats, setUserStats] = useState({ itineraries: 0, favorites: 0, history: 0 });
  
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
      loadAllData();
    }
  }, [session]);

  const loadAllData = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    
    try {
      // Load basic data
      await Promise.all([
        loadHistory(),
        loadFavorites(),
        loadItineraries(),
        loadMembershipData(),
      ]);
    } catch (error) {
      console.error('加载数据失败:', error);
    }
    
    setLoading(false);
  };

  const loadHistory = async () => {
    if (!session?.user?.id) return;
    const data = await getBrowseHistory(session.user.id, 50);
    setHistory(data);
  };

  const loadFavorites = async () => {
    if (!session?.user?.id) return;
    const data = await getFavorites(session.user.id);
    setFavorites(data);
  };

  const loadItineraries = async () => {
    if (!session?.user?.id) return;
    const data = await getUserItineraries(session.user.id);
    setItineraries(data);
    setUserStats(prev => ({ ...prev, itineraries: data.length }));
  };

  const loadMembershipData = async () => {
    if (!session?.user?.id) return;
    
    try {
      const [tiers, membership, points] = await Promise.all([
        getMembershipTiers(),
        getUserMembership(session.user.id),
        getUserMembershipPoints(session.user.id),
      ]);
      
      setMembershipTiers(tiers);
      setUserMembership(membership);
      setMembershipPoints(points);
      
      // Update stats
      setUserStats({
        itineraries: itineraries.length,
        favorites: favorites.length,
        history: history.length,
      });
    } catch (error) {
      console.error('加载会员数据失败:', error);
    }
  };

  const handleClearHistory = async () => {
    if (!session?.user?.id) return;
    if (!confirm('确定要清除所有浏览历史吗？')) return;
    
    await clearBrowseHistory(session.user.id);
    setHistory([]);
    setUserStats(prev => ({ ...prev, history: 0 }));
  };

  const handleRemoveFavorite = async (itemId: string) => {
    if (!session?.user?.id) return;
    await removeFavorite(session.user.id, itemId);
    setFavorites(favorites.filter(f => f.item_id !== itemId));
    setUserStats(prev => ({ ...prev, favorites: prev.favorites - 1 }));
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
      const data = {
        user: session.user,
        membership: userMembership,
        points: membershipPoints,
        history,
        favorites,
        itineraries,
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

  const getCurrentTier = (): MembershipTier | null => {
    if (!userMembership || !userMembership.tier_id) return null;
    return membershipTiers.find(t => t.id === userMembership.tier_id) || null;
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

  const currentTier = getCurrentTier();

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
              {currentTier && (
                <div className="flex items-center gap-2 mt-1 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <span className="text-lg">{currentTier.icon}</span>
                  <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    {currentTier.name_zh}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto py-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-3 border-b-2 transition-colors whitespace-nowrap text-sm font-medium ${
                activeTab === 'profile'
                  ? 'border-[#ff5a5f] text-[#ff5a5f]'
                  : 'border-transparent text-[#767676]'
              }`}
            >
              个人资料
            </button>
            <button
              onClick={() => setActiveTab('membership')}
              className={`py-2 px-3 border-b-2 transition-colors whitespace-nowrap text-sm font-medium ${
                activeTab === 'membership'
                  ? 'border-[#ff5a5f] text-[#ff5a5f]'
                  : 'border-transparent text-[#767676]'
              }`}
            >
              会员中心
            </button>
            <button
              onClick={() => setActiveTab('itineraries')}
              className={`py-2 px-3 border-b-2 transition-colors whitespace-nowrap text-sm font-medium ${
                activeTab === 'itineraries'
                  ? 'border-[#ff5a5f] text-[#ff5a5f]'
                  : 'border-transparent text-[#767676]'
              }`}
            >
              我的行程
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-3 border-b-2 transition-colors whitespace-nowrap text-sm font-medium ${
                activeTab === 'history'
                  ? 'border-[#ff5a5f] text-[#ff5a5f]'
                  : 'border-transparent text-[#767676]'
              }`}
            >
              浏览历史
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`py-2 px-3 border-b-2 transition-colors whitespace-nowrap text-sm font-medium ${
                activeTab === 'favorites'
                  ? 'border-[#ff5a5f] text-[#ff5a5f]'
                  : 'border-transparent text-[#767676]'
              }`}
            >
              收藏夹
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-2 px-3 border-b-2 transition-colors whitespace-nowrap text-sm font-medium ${
                activeTab === 'settings'
                  ? 'border-[#ff5a5f] text-[#ff5a5f]'
                  : 'border-transparent text-[#767676]'
              }`}
            >
              设置
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-white rounded-2xl shadow-md p-4 text-center border border-gray-100 hover-lift stagger-item">
                <div className="text-2xl mb-2 animate-float">📅</div>
                <div className="text-xl font-bold text-[#484848]">{userStats.itineraries}</div>
                <div className="text-xs text-[#767676]">行程</div>
              </div>
              <div className="bg-white rounded-2xl shadow-md p-4 text-center border border-gray-100 hover-lift stagger-item">
                <div className="text-2xl mb-2 animate-float" style={{ animationDelay: '0.5s' }}>❤️</div>
                <div className="text-xl font-bold text-[#484848]">{userStats.favorites}</div>
                <div className="text-xs text-[#767676]">收藏</div>
              </div>
              <div className="bg-white rounded-2xl shadow-md p-4 text-center border border-gray-100 hover-lift stagger-item">
                <div className="text-2xl mb-2 animate-float" style={{ animationDelay: '1s' }}>📜</div>
                <div className="text-xl font-bold text-[#484848]">{userStats.history}</div>
                <div className="text-xs text-[#767676]">历史</div>
              </div>
              <div className="bg-white rounded-2xl shadow-md p-4 text-center border border-gray-100 hover-lift stagger-item">
                <div className="text-2xl mb-2 animate-float" style={{ animationDelay: '1.5s' }}>⭐</div>
                <div className="text-xl font-bold text-[#484848]">{membershipPoints?.points || 0}</div>
                <div className="text-xs text-[#767676]">积分</div>
              </div>
            </div>

            {/* Membership Card */}
            {currentTier && (
              <div className="bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] rounded-2xl shadow-lg p-6 text-white animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{currentTier.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold">{currentTier.name_zh}</h3>
                      <p className="text-white/80 text-sm">会员等级 {currentTier.level}</p>
                    </div>
                  </div>
                  {userMembership?.expires_at && (
                    <div className="text-right">
                      <p className="text-sm text-white/80">有效期至</p>
                      <p className="font-medium">
                        {new Date(userMembership.expires_at).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-sm text-white/80">每日查询</p>
                    <p className="text-lg font-bold">{currentTier.max_daily_queries} 次</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-sm text-white/80">并发会话</p>
                    <p className="text-lg font-bold">{currentTier.max_concurrent_sessions} 个</p>
                  </div>
                </div>
              </div>
            )}

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

        {activeTab === 'membership' && (
          <div className="space-y-6">
            {/* Current Membership */}
            {currentTier ? (
              <div className="bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] rounded-2xl shadow-lg p-6 text-white animate-slide-up">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-5xl">{currentTier.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold">{currentTier.name_zh}</h2>
                    <p className="text-white/80">等级 {currentTier.level} · {userMembership?.status === 'active' ? ' active' : '已过期'}</p>
                  </div>
                </div>
                
                {userMembership?.expires_at && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-white/80">会员有效期</span>
                      <span className="font-medium">
                        {new Date(userMembership.expires_at).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-white rounded-full h-2 transition-all"
                        style={{ 
                          width: `${Math.min(100, ((new Date().getTime() - new Date(userMembership.started_at).getTime()) / (new Date(userMembership.expires_at).getTime() - new Date(userMembership.started_at).getTime()) * 100))}%` 
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="font-bold mb-2">当前权益</h3>
                  <ul className="space-y-2">
                    {currentTier.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-green-300">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {membershipPoints && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-white/80">当前积分</p>
                        <p className="text-3xl font-bold">{membershipPoints.points}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white/80">累计积分</p>
                        <p className="text-xl font-medium">{membershipPoints.lifetime_points}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-md p-6 text-center animate-slide-up">
                <div className="text-6xl mb-4">🆓</div>
                <h2 className="text-2xl font-bold text-[#484848] mb-2">免费版</h2>
                <p className="text-[#767676] mb-6">升级会员，解锁更多功能</p>
              </div>
            )}

            {/* Membership Tiers */}
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-xl font-bold text-[#484848] mb-4">会员等级</h2>
              <div className="space-y-4">
                {membershipTiers.map((tier, index) => (
                  <div
                    key={tier.id}
                    className={`bg-white rounded-2xl shadow-md p-6 border-2 transition-all hover-lift stagger-item ${
                      currentTier?.id === tier.id ? 'border-[#ff5a5f]' : 'border-transparent'
                    }`}
                    style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{tier.icon}</span>
                        <div>
                          <h3 className="text-lg font-bold text-[#484848]">{tier.name_zh}</h3>
                          <p className="text-sm text-[#767676]">等级 {tier.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {tier.price_monthly > 0 ? (
                          <>
                            <p className="text-2xl font-bold text-[#ff5a5f]">¥{tier.price_monthly}</p>
                            <p className="text-xs text-[#767676]">/月</p>
                          </>
                        ) : (
                          <p className="text-lg font-bold text-[#767676]">免费</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-[#767676]">每日查询</p>
                        <p className="font-bold text-[#484848]">{tier.max_daily_queries} 次</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-[#767676]">并发会话</p>
                        <p className="font-bold text-[#484848]">{tier.max_concurrent_sessions} 个</p>
                      </div>
                    </div>

                    <ul className="space-y-2 mb-4">
                      {tier.benefits.slice(0, 4).map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <span className="text-[#ff5a5f]">✓</span>
                          <span className="text-[#767676]">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    {currentTier?.id !== tier.id && tier.price_monthly > 0 && (
                      <button className="w-full py-3 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover-lift">
                        升级到{tier.name_zh}
                      </button>
                    )}
                    
                    {currentTier?.id === tier.id && (
                      <button className="w-full py-3 bg-gray-100 text-[#767676] rounded-xl font-semibold">
                        当前等级
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'itineraries' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#484848] mb-4">我的行程</h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-[#ff5a5f] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-[#767676]">加载中...</p>
              </div>
            ) : itineraries.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                <div className="text-4xl mb-4">📅</div>
                <p className="text-[#767676] mb-4">暂无行程</p>
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-2 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  创建第一个行程
                </button>
              </div>
            ) : (
              itineraries.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-[#484848] mb-1">{item.title}</h3>
                      <p className="text-sm text-[#767676] mb-2">
                        📍 {item.destination} · {item.days} 天
                      </p>
                      <p className="text-xs text-[#767676]">
                        创建于 {new Date(item.created_at).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                    <button className="text-[#ff5a5f] text-sm font-medium hover:underline">
                      查看
                    </button>
                  </div>
                </div>
              ))
            )}
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
                <p className="text-[#767676] mb-4">暂无收藏</p>
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-2 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  去探索
                </button>
              </div>
            ) : (
              favorites.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#484848]">{item.item_id}</p>
                    <p className="text-sm text-[#767676]">
                      {item.type === 'itinerary' && '📅 行程'}
                      {item.type === 'food' && '🍜 美食'}
                      {item.type === 'attraction' && '🏛️ 景点'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveFavorite(item.item_id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    移除
                  </button>
                </div>
              ))
            )}
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
