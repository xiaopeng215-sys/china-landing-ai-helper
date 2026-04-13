'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useClientI18n } from '@/lib/i18n/client';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const { t } = useClientI18n();

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'Verification':
        return {
          title: t('AuthErrors.verification.title', 'Invalid verification link'),
          message: t('AuthErrors.verification.message', 'This link has expired or already been used. Please request a new sign-in link.'),
          icon: '⚠️',
        };
      case 'AccessDenied':
        return {
          title: t('AuthErrors.accessDenied.title', 'Access denied'),
          message: t('AuthErrors.accessDenied.message', 'You do not have permission to access this resource. Please contact support.'),
          icon: '🚫',
        };
      case 'CredentialsSignin':
        return {
          title: t('AuthErrors.credentialsSignin.title', 'Sign in failed'),
          message: t('AuthErrors.credentialsSignin.message', 'Incorrect email or password. Please check and try again.'),
          icon: '❌',
        };
      case 'OAuthSignin':
        return {
          title: t('AuthErrors.oauthSignin.title', 'OAuth sign-in failed'),
          message: t('AuthErrors.oauthSignin.message', 'Could not sign in with this provider. Please try another method.'),
          icon: '🔐',
        };
      case 'OAuthCallback':
        return {
          title: t('AuthErrors.oauthCallback.title', 'OAuth callback failed'),
          message: t('AuthErrors.oauthCallback.message', 'An error occurred during authorization. Please try again.'),
          icon: '🔄',
        };
      case 'OAuthCreateAccount':
        return {
          title: t('AuthErrors.oauthCreateAccount.title', 'Account creation failed'),
          message: t('AuthErrors.oauthCreateAccount.message', 'Could not create account with this provider. Please contact support.'),
          icon: '👤',
        };
      case 'EmailCreateAccount':
        return {
          title: t('AuthErrors.emailCreateAccount.title', 'Email account creation failed'),
          message: t('AuthErrors.emailCreateAccount.message', 'Could not create account with this email. Please try another method.'),
          icon: '📧',
        };
      case 'Callback':
        return {
          title: t('AuthErrors.callback.title', 'Callback error'),
          message: t('AuthErrors.callback.message', 'An error occurred during sign-in callback. Please try again.'),
          icon: '⚡',
        };
      case 'OAuthAccountNotLinked':
        return {
          title: t('AuthErrors.oauthNotLinked.title', 'Account not linked'),
          message: t('AuthErrors.oauthNotLinked.message', 'This provider account is not linked to any user. Please sign up first.'),
          icon: '🔗',
        };
      default:
        return {
          title: t('AuthErrors.default.title', 'Authentication error'),
          message: t('AuthErrors.default.message', 'An unknown error occurred during sign-in. Please try again or contact support.'),
          icon: '❓',
        };
    }
  };

  const errorInfo = getErrorMessage(error);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center px-4 py-12" role="main">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-500 rounded-3xl flex items-center justify-center text-5xl shadow-lg mx-auto mb-6" aria-hidden="true">
          {errorInfo.icon}
        </div>
        <h1 className="text-2xl font-bold text-[#484848] mb-4">{errorInfo.title}</h1>
        <p className="text-[#767676] mb-8 leading-relaxed">{errorInfo.message}</p>
        <div className="space-y-4">
          <Link
            href="/auth/signin"
            className="block w-full py-3 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            {t('AuthPage.signIn', 'Sign In Again')}
          </Link>
          <Link
            href="/"
            className="block w-full py-3 bg-white border border-gray-200 text-[#484848] rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
          >
            {t('Actions.goBack', 'Back to Home')}
          </Link>
        </div>
        <div className="mt-8 text-sm text-[#767676]">
          <p>{t('AuthErrors.needHelp', 'Still having trouble?')}</p>
          <p className="mt-1">
            {t('AuthErrors.contactSupport', 'Contact support')}:{' '}
            <a
              href="mailto:support@travelerlocal.ai"
              className="text-[#ff5a5f] hover:underline"
            >
              support@travelerlocal.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff5a5f]" /></div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
