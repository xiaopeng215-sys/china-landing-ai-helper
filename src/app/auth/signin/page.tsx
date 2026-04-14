'use client';

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useClientI18n } from '@/lib/i18n/client';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useClientI18n();
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
      const callbackUrl = searchParams.get('callbackUrl') || '/profile';
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (!result?.ok) throw new Error(result?.error || t('Errors.generic', 'Sign in failed'));
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError((err as Error).message || t('Errors.generic', 'Sign in failed. Please check your email and password.'));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      setError(t('AuthPage.emailSignInComingSoon', 'Email sign-in is coming soon. Please use password sign-in.'));
    } catch (err) {
      setError((err as Error).message || t('Errors.generic', 'Failed to send. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  // Social sign-in handlers removed — providers not yet configured in production

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50 flex items-center justify-center px-4 py-12" role="main">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg mx-auto mb-4" aria-hidden="true">
            🇨🇳
          </div>
          <h1 className="text-2xl font-bold text-[#484848] mb-2">
            {t('AuthPage.welcomeBack', 'Welcome back')}
          </h1>
          <p className="text-[#767676]">
            {t('AuthPage.signInSubtitle', 'Sign in to continue your China journey')}
          </p>
        </div>

        {/* Sign-in form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          {/* Method toggle */}
          <div className="flex gap-2 mb-6" role="group">
            <button
              onClick={() => setLoginMethod('password')}
              className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
                loginMethod === 'password'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-gray-100 text-[#767676] hover:bg-gray-200'
              }`}
              aria-pressed={loginMethod === 'password'}
            >
              {t('AuthPage.passwordSignIn', 'Password')}
            </button>
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
                loginMethod === 'email'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-gray-100 text-[#767676] hover:bg-gray-200'
              }`}
              aria-pressed={loginMethod === 'email'}
            >
              {t('AuthPage.emailCode', 'Magic Link')}
            </button>
          </div>

          {/* Password sign-in form */}
          {loginMethod === 'password' && (
            <form onSubmit={handlePasswordSignIn} className="space-y-4 mb-6">
              <div>
                <label htmlFor="signin-email-password" className="block text-sm font-medium text-[#484848] mb-2">
                  {t('AuthPage.email', 'Email')}
                </label>
                <input
                  id="signin-email-password"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                  aria-required="true"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="signin-password" className="block text-sm font-medium text-[#484848]">
                    {t('AuthPage.password', 'Password')}
                  </label>
                  <Link href="/auth/forgot-password" className="text-sm text-teal-600 hover:underline">
                    {t('AuthPage.forgotPassword', 'Forgot password?')}
                  </Link>
                </div>
                <input
                  id="signin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
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
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <label htmlFor="rememberMe" className="text-sm text-[#767676]">
                  {t('AuthPage.rememberMe', 'Remember me (7 days)')}
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('Loading.processing', 'Signing in...') : t('AuthPage.signIn', 'Sign In')}
              </button>
            </form>
          )}

          {/* Magic link form */}
          {loginMethod === 'email' && (
            <form onSubmit={handleEmailSignIn} className="space-y-4 mb-6">
              <div>
                <label htmlFor="signin-email-otp" className="block text-sm font-medium text-[#484848] mb-2">
                  {t('AuthPage.email', 'Email')}
                </label>
                <input
                  id="signin-email-otp"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                  aria-required="true"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('Loading.processing', 'Sending...') : t('AuthPage.sendMagicLink', 'Send Magic Link')}
              </button>

              <p className="text-xs text-[#767676] text-center">
                {t('AuthPage.magicLinkDesc', "We'll send a sign-in link to your email")}
              </p>
            </form>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm" role="alert" aria-live="polite">
              {error}
            </div>
          )}

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#767676]">{t('AuthPage.or', 'or')}</span>
            </div>
          </div>

          {/* Social sign-in */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/' })}
              disabled={loading}
              className="w-full py-3 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>{t('AuthPage.signInWithGoogle', 'Sign in with Google')}</span>
            </button>

            <button
              type="button"
              onClick={() => alert('Facebook login coming soon!')}
              disabled={true}
              className="w-full py-3 bg-white border border-gray-200 rounded-xl font-semibold text-gray-400 flex items-center justify-center gap-3 transition-all duration-200 opacity-50 cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>{t('AuthPage.signInWithFacebook', 'Sign in with Facebook')}</span>
            </button>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-[#767676] mt-6">
            {t('AuthPage.noAccount', "Don't have an account?")}{' '}
            <Link href="/auth/signup" className="text-teal-600 hover:underline font-medium">
              {t('AuthPage.signUp', 'Sign Up')}
            </Link>
          </p>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-[#767676] mt-6">
          {t('AuthPage.agreeTerms', 'By signing in, you agree to our')}{' '}
          <a href="/legal/terms" className="text-teal-600 hover:underline">
            {t('AuthPage.termsOfService', 'Terms of Service')}
          </a>{' '}
          {t('AuthPage.and', 'and')}{' '}
          <a href="/legal/privacy" className="text-teal-600 hover:underline">
            {t('AuthPage.privacyPolicy', 'Privacy Policy')}
          </a>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <SignInForm />
    </Suspense>
  );
}
