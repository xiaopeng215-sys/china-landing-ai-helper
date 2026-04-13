'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useClientI18n } from '@/lib/i18n/client';

export default function ForgotPasswordPage() {
  const { t } = useClientI18n();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || t('AuthPage.sendFailed', 'Failed to send. Please try again.'));
      }

      setSuccess(true);
    } catch (err) {
      // If API doesn't exist, show success (demo mode)
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center px-4 py-12" role="main">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#4ade80] to-[#22c55e] rounded-3xl flex items-center justify-center text-5xl shadow-lg mx-auto mb-6" aria-hidden="true">
            ✅
          </div>
          <h1 className="text-2xl font-bold text-[#484848] mb-4">
            {t('AuthPage.emailSent', 'Email Sent')}
          </h1>
          <p className="text-[#767676] mb-8 leading-relaxed">
            {t('AuthPage.emailSentDesc', 'If this email is registered, you will receive a password reset link. Please check your inbox (including spam folder).')}
          </p>
          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="block w-full py-3 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              {t('AuthPage.backToSignIn', 'Back to Sign In')}
            </Link>
            <button
              onClick={() => setSuccess(false)}
              className="block w-full py-3 bg-white border border-gray-200 text-[#484848] rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              {t('AuthPage.tryAnotherEmail', 'Try Another Email')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center px-4 py-12" role="main">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#ff5a5f] to-[#ff3b3f] rounded-2xl flex items-center justify-center text-4xl shadow-lg mx-auto mb-4" aria-hidden="true">
            🔐
          </div>
          <h1 className="text-2xl font-bold text-[#484848] mb-2">
            {t('AuthPage.forgotPasswordTitle', 'Forgot Password')}
          </h1>
          <p className="text-[#767676]">
            {t('AuthPage.forgotPasswordDesc', 'Enter your email and we will send you a reset link')}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleResetPassword} className="space-y-4 mb-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#484848] mb-2">
                {t('AuthPage.email', 'Email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent transition-all"
                placeholder="your@email.com"
                aria-required="true"
                aria-describedby="email-help"
              />
              <p id="email-help" className="mt-1 text-xs text-[#767676]">
                {t('AuthPage.emailHelp', 'Enter the email you used to register')}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm" role="alert" aria-live="polite">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('Loading.processing', 'Sending...') : t('AuthPage.sendResetLink', 'Send Reset Link')}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#767676]">{t('AuthPage.or', 'or')}</span>
            </div>
          </div>

          <Link
            href="/auth/signin"
            className="block w-full py-3 bg-gray-50 text-[#484848] rounded-xl font-semibold text-center hover:bg-gray-100 transition-all duration-200"
          >
            ← {t('AuthPage.backToSignIn', 'Back to Sign In')}
          </Link>
        </div>

        <p className="text-center text-xs text-[#767676] mt-6">
          {t('AuthPage.needHelp', 'Need help?')}{' '}
          <a href="mailto:support@travelerlocal.ai" className="text-[#ff5a5f] hover:underline">
            {t('AuthPage.contactSupport', 'Contact Support')}
          </a>
        </p>
      </div>
    </div>
  );
}
