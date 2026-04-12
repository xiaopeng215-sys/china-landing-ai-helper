'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  showUserMenu?: boolean;
}

export default function Header({
  title,
  showBack = false,
  onBack,
  rightAction,
  showUserMenu = false,
}: HeaderProps) {
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = React.useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="h-safe-area-top bg-white" />
      
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={onBack}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="返回上一页"
            >
              <span className="text-xl" aria-hidden="true">←</span>
            </button>
          )}
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* 语言切换器 - 始终显示 */}
          <LanguageSwitcher variant="dropdown" />
          
          {/* 用户菜单 */}
          {rightAction ? (
            <div>{rightAction}</div>
          ) : showUserMenu && session ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-9 h-9 bg-gradient-to-br from-[#ff5a5f] to-[#ff3b3f] rounded-full flex items-center justify-center text-white font-semibold shadow-md hover:shadow-lg transition-all"
                aria-label="打开用户菜单"
                aria-expanded={showMenu}
                aria-haspopup="true"
              >
                {session.user?.name?.charAt(0).toUpperCase() || 'U'}
              </button>
              
              {showMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-[#484848] truncate">
                        {session.user?.name || '用户'}
                      </p>
                      <p className="text-xs text-[#767676] truncate">
                        {session.user?.email}
                      </p>
                    </div>
                    
                    <Link
                      href="/profile"
                      onClick={() => setShowMenu(false)}
                      className="block px-4 py-2.5 text-sm text-[#484848] hover:bg-gray-50 transition-colors"
                    >
                      👤 个人资料
                    </Link>
                    
                    <Link
                      href="/chat"
                      onClick={() => setShowMenu(false)}
                      className="block px-4 py-2.5 text-sm text-[#484848] hover:bg-gray-50 transition-colors"
                    >
                      💬 AI 对话
                    </Link>
                    
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      aria-label="退出登录"
                    >
                      🚪 退出登录
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : session ? (
            <Link
              href="/profile"
              className="w-9 h-9 bg-gradient-to-br from-[#ff5a5f] to-[#ff3b3f] rounded-full flex items-center justify-center text-white font-semibold shadow-md hover:shadow-lg transition-all"
              aria-label="查看个人资料"
            >
              {session.user?.name?.charAt(0).toUpperCase() || 'U'}
            </Link>
          ) : (
            <Link
              href="/auth/signin"
              className="px-4 py-2 text-sm font-medium text-[#ff5a5f] bg-[#ff5a5f]/10 rounded-full hover:bg-[#ff5a5f]/20 transition-colors"
              aria-label="登录账号"
            >
              登录
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
