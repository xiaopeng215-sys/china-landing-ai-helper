'use client';

import React from 'react';
import Link from 'next/link';

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-[#4ade80] to-[#22c55e] rounded-3xl flex items-center justify-center text-5xl shadow-lg mx-auto mb-6">
          📧
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-[#484848] mb-4">
          检查您的邮箱
        </h1>

        {/* Message */}
        <p className="text-[#767676] mb-6 leading-relaxed">
          我们已发送一封包含登录链接的邮件到您的邮箱。<br/>
          点击邮件中的链接即可登录。
        </p>

        {/* Tips */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
          <h2 className="text-sm font-semibold text-[#484848] mb-3">
            💡 温馨提示
          </h2>
          <ul className="text-sm text-[#767676] space-y-2 text-left">
            <li className="flex items-start gap-2">
              <span className="text-[#ff5a5f] mt-0.5">•</span>
              <span>检查垃圾邮件文件夹</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ff5a5f] mt-0.5">•</span>
              <span>链接有效期为 24 小时</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ff5a5f] mt-0.5">•</span>
              <span>每个链接只能使用一次</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ff5a5f] mt-0.5">•</span>
              <span>未收到邮件？<Link href="/auth/signin" className="text-[#ff5a5f] hover:underline">重新发送</Link></span>
            </li>
          </ul>
        </div>

        {/* Back to login */}
        <Link
          href="/auth/signin"
          className="inline-flex items-center gap-2 text-[#ff5a5f] hover:text-[#ff3b3f] font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回登录
        </Link>
      </div>
    </div>
  );
}
