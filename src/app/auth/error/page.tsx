'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'Verification':
        return {
          title: '验证链接无效',
          message: '该验证链接已过期或已被使用。请重新请求登录链接。',
          icon: '⚠️',
        };
      case 'AccessDenied':
        return {
          title: '访问被拒绝',
          message: '您没有权限访问此资源。请联系管理员。',
          icon: '🚫',
        };
      case 'CredentialsSignin':
        return {
          title: '登录失败',
          message: '邮箱或密码错误。请检查后重试。',
          icon: '❌',
        };
      case 'OAuthSignin':
        return {
          title: '第三方登录失败',
          message: '无法通过第三方账号登录。请尝试其他方式。',
          icon: '🔐',
        };
      case 'OAuthCallback':
        return {
          title: '授权回调失败',
          message: '第三方授权过程中出现错误。请重试。',
          icon: '🔄',
        };
      case 'OAuthCreateAccount':
        return {
          title: '账号创建失败',
          message: '无法使用第三方账号创建新用户。请联系管理员。',
          icon: '👤',
        };
      case 'EmailCreateAccount':
        return {
          title: '邮箱账号创建失败',
          message: '无法使用该邮箱创建账号。请尝试其他方式。',
          icon: '📧',
        };
      case 'Callback':
        return {
          title: '回调错误',
          message: '登录回调过程中出现错误。请重试。',
          icon: '⚡',
        };
      case 'OAuthAccountNotLinked':
        return {
          title: '账号未关联',
          message: '该第三方账号未与任何用户关联。请先注册账号。',
          icon: '🔗',
        };
      default:
        return {
          title: '认证错误',
          message: '登录过程中出现未知错误。请重试或联系客服。',
          icon: '❓',
        };
    }
  };

  const errorInfo = getErrorMessage(error);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-500 rounded-3xl flex items-center justify-center text-5xl shadow-lg mx-auto mb-6">
          {errorInfo.icon}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-[#484848] mb-4">
          {errorInfo.title}
        </h1>

        {/* Message */}
        <p className="text-[#767676] mb-8 leading-relaxed">
          {errorInfo.message}
        </p>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            href="/auth/signin"
            className="block w-full py-3 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            重新登录
          </Link>

          <Link
            href="/"
            className="block w-full py-3 bg-white border border-gray-200 text-[#484848] rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
          >
            返回首页
          </Link>
        </div>

        {/* Help */}
        <div className="mt-8 text-sm text-[#767676]">
          <p>仍有问题？</p>
          <p className="mt-1">
            联系支持：{' '}
            <a href="mailto:support@chinalanding.ai" className="text-[#ff5a5f] hover:underline">
              support@chinalanding.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
