'use client';

import React from 'react';
import Link from 'next/link';

export default function CookiePolicyPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cookie 政策</h1>
          <p className="text-gray-600">生效日期：2026 年 4 月 12 日</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 space-y-8">
          <section>
            <p className="text-gray-700 mb-4">
              我们使用 Cookie 和类似技术来提升您的使用体验。
              继续使用本服务即表示您同意我们使用 Cookie。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">使用的 Cookie 类型</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 font-semibold text-gray-900">类型</th>
                    <th className="py-3 px-4 font-semibold text-gray-900">用途</th>
                    <th className="py-3 px-4 font-semibold text-gray-900">是否必需</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        必要 Cookie
                      </span>
                    </td>
                    <td className="py-3 px-4">维持登录状态、安全验证</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        是
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
                        功能 Cookie
                      </span>
                    </td>
                    <td className="py-3 px-4">记住您的偏好设置</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-gray-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        否
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        分析 Cookie
                      </span>
                    </td>
                    <td className="py-3 px-4">分析使用情况，改进服务</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-gray-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        否
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                        营销 Cookie
                      </span>
                    </td>
                    <td className="py-3 px-4">无（我们不使用营销 Cookie）</td>
                    <td className="py-3 px-4">
                      <span className="text-gray-400">-</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">管理 Cookie</h2>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <p className="text-gray-700">
                您可以通过浏览器设置管理或禁用 Cookie：
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">○</span>
                  <div>
                    <strong>Chrome:</strong> 设置 → 隐私和安全 → Cookie 及其他网站数据
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">○</span>
                  <div>
                    <strong>Safari:</strong> 设置 → 隐私 → 管理网站数据
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">○</span>
                  <div>
                    <strong>Firefox:</strong> 设置 → 隐私与安全 → Cookie 和网站数据
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">○</span>
                  <div>
                    <strong>Edge:</strong> 设置 → Cookie 和网站权限
                  </div>
                </li>
              </ul>
              <p className="text-amber-600 text-sm mt-3">
                ⚠️ 禁用 Cookie 可能影响部分功能的使用，如登录状态保持、个性化设置等。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">第三方 Cookie</h2>
            <p className="text-gray-700 mb-4">
              我们使用的第三方服务可能设置 Cookie：
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">○</span>
                <div>
                  <strong>云服务提供商</strong>：用于数据存储和备份
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">○</span>
                <div>
                  <strong>分析工具</strong>：用于统计使用情况，优化产品
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">○</span>
                <div>
                  <strong>地图服务</strong>：用于位置展示和导航
                </div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cookie 更新</h2>
            <p className="text-gray-700">
              我们可能会不时更新本 Cookie 政策。重大变更将通过网站公告或邮件通知您。
              建议您定期查看本政策以了解最新信息。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">联系我们</h2>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-700 mb-2">如有 Cookie 相关问题，请联系：</p>
              <a 
                href="mailto:privacy@chinalanding.ai" 
                className="text-[#ff5a5f] hover:text-[#ff3b3f] font-medium"
              >
                privacy@chinalanding.ai
              </a>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            更多信息请访问:{' '}
            <Link href="/legal/privacy" className="text-[#ff5a5f] hover:underline">
              隐私政策
            </Link>
            {' '}或{' '}
            <Link href="/legal/terms" className="text-[#ff5a5f] hover:underline">
              服务条款
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
