'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
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
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // 登录成功，跳转到主页
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || '登录失败，请检查邮箱和密码');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn('email', { 
        email, 
        callbackUrl: '/',
        redirect: false,
      });
      // 邮箱验证码登录会发送邮件，显示成功提示
    } catch (err: any) {
      setError(err.message || '发送失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (err: any) {
      setError('Google 登录失败，请重试');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#ff5a5f] to-[#ff3b3f] rounded-2xl flex items-center justify-center text-4xl shadow-lg mx-auto mb-4">
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
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setLoginMethod('password')}
              className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
                loginMethod === 'password'
                  ? 'bg-[#ff5a5f] text-white shadow-md'
                  : 'bg-gray-100 text-[#767676] hover:bg-gray-200'
              }`}
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
            >
              邮箱验证码
            </button>
          </div>

          {/* 密码登录表单 */}
          {loginMethod === 'password' && (
            <form onSubmit={handlePasswordSignIn} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#484848] mb-2">
                  邮箱地址
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-[#484848]">
                    密码
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-[#ff5a5f] hover:underline"
                  >
                    忘记密码？
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent transition-all"
                  placeholder="••••••••"
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
              >
                {loading ? '登录中...' : '登录'}
              </button>
            </form>
          )}

          {/* 邮箱验证码登录表单 */}
          {loginMethod === 'email' && (
            <form onSubmit={handleEmailSignIn} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#484848] mb-2">
                  邮箱地址
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '发送中...' : '发送登录链接'}
              </button>

              <p className="text-xs text-[#767676] text-center">
                我们将发送一封包含登录链接的邮件到您的邮箱
              </p>
            </form>
          )}

          {/* 错误提示 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
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

          {/* Google 登录 */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 bg-white border border-gray-200 rounded-xl font-semibold text-[#484848] hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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

          {/* 注册链接 */}
          <p className="text-center text-sm text-[#767676] mt-6">
            还没有账号？{' '}
            <Link href="/auth/signup" className="text-[#ff5a5f] hover:underline font-medium">
              立即注册
            </Link>
          </p>
        </div>

        {/* 底部提示 */}
        <p className="text-center text-xs text-[#767676] mt-6">
          登录即表示您同意我们的{' '}
          <a href="/terms" className="text-[#ff5a5f] hover:underline">
            服务条款
          </a>{' '}
          和{' '}
          <a href="/privacy" className="text-[#ff5a5f] hover:underline">
            隐私政策
          </a>
        </p>
      </div>
    </div>
  );
}
