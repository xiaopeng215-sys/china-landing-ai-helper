'use client';

import React from 'react';
import Link from 'next/link';
import { useClientI18n } from '@/lib/i18n/client';

export default function VerifyRequestPage() {
  const { t } = useClientI18n();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center px-4 py-12" role="main">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-[#ff5a5f] to-[#ff3b3f] rounded-3xl flex items-center justify-center text-5xl shadow-lg mx-auto mb-6" aria-hidden="true">
          📧
        </div>
        <h1 className="text-2xl font-bold text-[#484848] mb-4">
          {t('AuthPage.checkEmail', 'Check Your Email')}
        </h1>
        <p className="text-[#767676] mb-8 leading-relaxed">
          {t('AuthPage.verifyDesc', 'We sent a sign-in link to your email. Click the link to sign in.')}
        </p>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 text-left">
          <p className="font-semibold text-[#484848] mb-3">💡 {t('AuthPage.tips', 'Tips')}</p>
          <ul className="space-y-2 text-sm text-[#767676]">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>{t('AuthPage.tipSpam', 'Check your spam folder')}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>{t('AuthPage.tipExpiry', 'Link expires in 24 hours')}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>{t('AuthPage.tipOneTime', 'Each link can only be used once')}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>
                {t('AuthPage.tipResend', "Didn't receive it?")}{' '}
                <Link href="/auth/signin" className="text-[#ff5a5f] hover:underline">
                  {t('AuthPage.resend', 'Resend')}
                </Link>
              </span>
            </li>
          </ul>
        </div>

        <Link
          href="/auth/signin"
          className="block w-full py-3 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          {t('AuthPage.backToSignIn', 'Back to Sign In')}
        </Link>
      </div>
    </div>
  );
}
