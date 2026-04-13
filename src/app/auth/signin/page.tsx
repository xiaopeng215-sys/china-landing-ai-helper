'use client';

import React, { useState } from 'react';
import { signIn } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<'password' | 'email'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn(email, password);

      if (!result.ok) {
        throw new Error(result.error || '登录失败');
      }

      // 登录成功，跳转到主页
      router.push('/');
      router.refresh();
    } catch (err) {
      setError((err as Error).message || '登录失败，请检查邮箱和密码');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 邮箱登录暂时显示提示
      setError('邮箱登录功能正在开发中，请使用密码登录');
    } catch (err) {
      setError((err as Error).message || '发送失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('Google 登录正在配置中');
  };

  const handleFacebookSignIn = async () => {
    setError('Facebook 登录正在配置中');
  };

  const handleOpenAISignIn = async () => {
    setError('OpenAI 登录正在配置中');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center px-4 py-12" role="main" aria-label="登录页面">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#ff5a5f] to-[#ff3b3f] rounded-2xl flex items-center justify-center text-4xl shadow-lg mx-auto mb-4" aria-hidden="true">
            🇨🇳
          </div>
          <h1 className="text-2xl font-bold text-[#484848] mb-2">
            欢迎回来
          </h1>
          <p className="text-[#767676]">
            登录以继续您的中国之旅
          </p>
        </div>

        {/* 登录表单 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          {/* 登录方式切换 */}
          <div className="flex gap-2 mb-6" role="group" aria-label="选择登录方式">
            <button
              onClick={() => setLoginMethod('password')}
              className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
                loginMethod === 'password'
                  ? 'bg-[#ff5a5f] text-white shadow-md'
                  : 'bg-gray-100 text-[#767676] hover:bg-gray-200'
              }`}
              aria-pressed={loginMethod === 'password'}
              aria-label="使用密码登录"
            >
              密码登录
            </button>
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
                loginMethod === 'email'
                  ? 'bg-[#ff5a5f] text-white shadow-md'
                  : 'bg-gray-100 text-[#767676] hover:bg-gray-200'
              }`}
              aria-pressed={loginMethod === 'email'}
              aria-label="使用邮箱验证码登录"
            >
              邮箱验证码
            </button>
          </div>

          {/* 密码登录表单 */}
          {loginMethod === 'password' && (
            <form onSubmit={handlePasswordSignIn} className="space-y-4 mb-6" aria-label="密码登录表单">
              <div>
                <label htmlFor="signin-email-password" className="block text-sm font-medium text-[#484848] mb-2">
                  邮箱地址
                </label>
                <input
                  id="signin-email-password"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent transition-all"
                  placeholder="your@email.com"
                  aria-required="true"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="signin-password" className="block text-sm font-medium text-[#484848]">
                    密码
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-[#ff5a5f] hover:underline"
                    aria-label="忘记密码？点击重置"
                  >
                    忘记密码？
                  </Link>
                </div>
                <input
                  id="signin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent transition-all"
                  placeholder="••••••••"
                  aria-required="true"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#ff5a5f] border-gray-300 rounded focus:ring-[#ff5a5f]"
                />
                <label htmlFor="rememberMe" className="text-sm text-[#767676]">
                  记住我 (7 天)
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={loading ? '登录中' : '登录'}
              >
                {loading ? '登录中...' : '登录'}
              </button>
            </form>
          )}

          {/* 邮箱验证码登录表单 */}
          {loginMethod === 'email' && (
            <form onSubmit={handleEmailSignIn} className="space-y-4 mb-6" aria-label="邮箱验证码登录表单">
              <div>
                <label htmlFor="signin-email-otp" className="block text-sm font-medium text-[#484848] mb-2">
                  邮箱地址
                </label>
                <input
                  id="signin-email-otp"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent transition-all"
                  placeholder="your@email.com"
                  aria-required="true"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={loading ? '发送中' : '发送登录链接'}
              >
                {loading ? '发送中...' : '发送登录链接'}
              </button>

              <p className="text-xs text-[#767676] text-center" id="email-help">
                我们将发送一封包含登录链接的邮件到您的邮箱
              </p>
            </form>
          )}

          {/* 错误提示 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm" role="alert" aria-live="polite">
              {error}
            </div>
          )}

          {/* 分割线 */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#767676]">或</span>
            </div>
          </div>

          {/* 第三方登录 */}
          <div className="space-y-3 mb-6" role="group" aria-label="第三方登录选项">
            {/* Google 登录 */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 bg-white border border-gray-200 rounded-xl font-semibold text-[#484848] hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50"
              aria-label="使用 Google 账号登录"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              使用 Google 账号登录
            </button>

            {/* Facebook 登录 */}
            <button
              onClick={handleFacebookSignIn}
              disabled={loading}
              className="w-full py-3 bg-white border border-gray-200 rounded-xl font-semibold text-[#484848] hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50"
              aria-label="使用 Facebook 账号登录"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              使用 Facebook 账号登录
            </button>

            {/* OpenAI 登录 */}
            <button
              onClick={handleOpenAISignIn}
              disabled={loading}
              className="w-full py-3 bg-white border border-gray-200 rounded-xl font-semibold text-[#484848] hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50"
              aria-label="使用 OpenAI 账号登录"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#412991">
                <path d="M22.281 9.821a5.984 5.984 0 0 0-.516-3.909 6.046 6.046 0 0 0-6.509-2.9A6.065 6.065 0 0 0 4.977 4.18a5.983 5.983 0 0 0-3.993 2.9 6.046 6.046 0 0 0 .745 7.097 5.98 5.98 0 0 0 .51 3.91 6.051 6.051 0 0 0 6.515 2.9 5.984 5.984 0 0 0 3.988-2.91 6.056 6.056 0 0 0 10.032-1.174 5.987 5.987 0 0 0-.494-7.082zM13.94 19.407a4.462 4.462 0 0 1-4.449-2.145 4.345 4.345 0 0 1-.434-3.248 10.575 10.575 0 0 0 2.187.69 10.727 10.727 0 0 0 2.126.239c.18.897.568 1.736 1.118 2.436a4.466 4.466 0 0 1-.548 2.028zm-8.863-4.592a4.455 4.455 0 0 1-1.88-3.923 4.354 4.354 0 0 1 1.588-2.866 10.566 10.566 0 0 0 1.337 1.962 10.728 10.728 0 0 0 1.493 1.545 4.459 4.459 0 0 1-2.538 3.282zm1.034-8.863a4.462 4.462 0 0 1 4.45 2.145 4.345 4.345 0 0 1 .433 3.248 10.575 10.575 0 0 0-2.187-.69 10.727 10.727 0 0 0-2.126-.239 4.466 4.466 0 0 1-1.118-2.436 4.466 4.466 0 0 1 .548-2.028zm8.863 4.592a4.455 4.455 0 0 1 1.88 3.923 4.354 4.354 0 0 1-1.588 2.866 10.566 10.566 0 0 0-1.337-1.962 10.728 10.728 0 0 0-1.493-1.545 4.459 4.459 0 0 1 2.538-3.282z"/>
              </svg>
              使用 OpenAI 账号登录
            </button>
          </div>

          {/* 注册链接 */}
          <p className="text-center text-sm text-[#767676] mt-6">
            还没有账号？{' '}
            <Link 
              href="/auth/signup" 
              className="text-[#ff5a5f] hover:underline font-medium"
              aria-label="注册新账号"
            >
              立即注册
            </Link>
          </p>
        </div>

        {/* 底部提示 */}
        <p className="text-center text-xs text-[#767676] mt-6">
          登录即表示您同意我们的{' '}
          <a 
            href="/terms" 
            className="text-[#ff5a5f] hover:underline"
            aria-label="查看服务条款"
          >
            服务条款
          </a>{' '}
          和{' '}
          <a 
            href="/privacy" 
            className="text-[#ff5a5f] hover:underline"
            aria-label="查看隐私政策"
          >
            隐私政策
          </a>
        </p>
      </div>
    </div>
  );
}
