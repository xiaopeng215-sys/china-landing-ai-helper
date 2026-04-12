'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-[#ff5a5f] hover:text-[#ff3b3f] font-medium mb-4 inline-block"
          >
            ← 返回首页
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">隐私政策</h1>
          <p className="text-gray-600">生效日期：2026 年 4 月 12 日</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">我们收集的信息</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-[#ff5a5f] mt-1">•</span>
                <div>
                  <strong>账户信息</strong>：邮箱地址、昵称（注册时提供）
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#ff5a5f] mt-1">•</span>
                <div>
                  <strong>使用数据</strong>：浏览历史、搜索记录、行程规划（自动收集）
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#ff5a5f] mt-1">•</span>
                <div>
                  <strong>设备信息</strong>：设备型号、操作系统、IP 地址（自动收集）
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#ff5a5f] mt-1">•</span>
                <div>
                  <strong>位置信息</strong>：仅在您授权时收集，用于提供本地化服务
                </div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">我们如何使用信息</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-[#ff5a5f] mt-1">•</span>
                <div>提供和改进我们的服务</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#ff5a5f] mt-1">•</span>
                <div>为您生成个性化行程推荐</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#ff5a5f] mt-1">•</span>
                <div>发送服务相关的通知（可随时取消订阅）</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#ff5a5f] mt-1">•</span>
                <div>分析使用情况，优化产品体验</div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">信息共享</h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-red-800 font-semibold">
                ⚠️ 我们不会出售您的个人信息
              </p>
            </div>
            <p className="text-gray-700 mb-3">仅在以下情况共享：</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">○</span>
                <div>获得您的明确同意</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">○</span>
                <div>法律要求或配合执法</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">○</span>
                <div>与服务提供商合作（如云存储、数据分析）</div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">您的权利</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>访问、更正、删除您的个人信息</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>撤回同意</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>数据可携带性</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>投诉权</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">数据安全</h2>
            <p className="text-gray-700 mb-4">
              我们采取合理的技术和组织措施保护您的信息安全，包括但不限于：
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">○</span>
                <div>数据传输加密（HTTPS/TLS）</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">○</span>
                <div>数据存储加密</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">○</span>
                <div>访问控制和权限管理</div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">联系我们</h2>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-700 mb-2">如有隐私相关问题，请联系：</p>
              <a 
                href="mailto:privacy@chinalanding.ai" 
                className="text-[#ff5a5f] hover:text-[#ff3b3f] font-medium"
              >
                privacy@chinalanding.ai
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">儿童隐私保护</h2>
            <p className="text-gray-700">
              本服务不面向 13 岁以下儿童。我们不会故意收集 13 岁以下儿童的个人信息。
              如发现我们收集了儿童信息，将立即删除。家长如发现儿童向我们提供了信息，请联系我们删除。
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            完整版隐私政策请访问:{' '}
            <a href="https://chinalanding.ai/privacy" className="text-[#ff5a5f] hover:underline">
              chinalanding.ai/privacy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
