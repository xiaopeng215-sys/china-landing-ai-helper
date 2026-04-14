'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsOfServicePage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">服务条款</h1>
          <p className="text-gray-600">生效日期：2026 年 4 月 12 日</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">服务说明</h2>
            <p className="text-gray-700 mb-4">
              本服务为 AI 驱动的中国旅行规划助手，提供：
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-[#ff5a5f] mt-1">•</span>
                <div>行程规划建议</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#ff5a5f] mt-1">•</span>
                <div>交通、餐饮、景点推荐</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#ff5a5f] mt-1">•</span>
                <div>实时信息和翻译协助</div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">免责声明</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
              <p className="text-amber-800">
                ⚠️ 重要提示：请仔细阅读以下免责条款
              </p>
              <ul className="space-y-3 text-amber-900">
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 mt-1">○</span>
                  <div>
                    <strong>信息仅供参考</strong>：本服务提供的信息仅供参考，不构成专业建议
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 mt-1">○</span>
                  <div>
                    <strong>不保证准确性</strong>：我们不保证信息的准确性、完整性或及时性
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 mt-1">○</span>
                  <div>
                    <strong>个人安全自负</strong>：旅行过程中的个人安全和财产安全由用户自行负责
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 mt-1">○</span>
                  <div>
                    <strong>责任限制</strong>：因使用本服务产生的任何损失，我们不承担责任
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">用户义务</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">○</span>
                <div>提供真实、准确的个人信息</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">○</span>
                <div>不利用本服务从事违法活动</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">○</span>
                <div>不攻击、干扰服务正常运行</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">○</span>
                <div>尊重第三方知识产权</div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">知识产权</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>我们的权利：</strong>
                本服务的所有内容（包括但不限于文本、图片、代码）归我们所有。
              </p>
              <p>
                <strong>您的权利：</strong>
                用户生成的行程内容归用户所有，但我们有权匿名化后用于服务改进。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">服务变更</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">○</span>
                <div>我们保留随时修改或终止服务的权利</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">○</span>
                <div>重大变更将提前通知用户</div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">法律适用</h2>
            <div className="bg-gray-50 rounded-xl p-4 text-gray-700">
              <p className="mb-2">
                <strong>管辖法律：</strong>本条款受中华人民共和国法律管辖
              </p>
              <p>
                <strong>争议解决：</strong>争议应通过友好协商解决，协商不成可提交有管辖权的法院
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">AI 使用声明</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
              <p className="text-amber-800 font-semibold">
                🤖 本服务使用人工智能技术
              </p>
              <ul className="space-y-3 text-amber-900">
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 mt-1">○</span>
                  <div>
                    <strong>AI 生成内容</strong>：行程建议、餐厅推荐、交通路线等由 AI 生成
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 mt-1">○</span>
                  <div>
                    <strong>人工审核</strong>：关键信息经过人工审核，但仍可能存在误差
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 mt-1">○</span>
                  <div>
                    <strong>持续学习</strong>：AI 会根据用户反馈不断优化
                  </div>
                </li>
              </ul>
              <p className="text-amber-900 pt-2 border-t border-amber-200">
                <strong>重要提示：</strong>AI 建议仅供参考，请结合实际情况判断。
                对于重要决策（如医疗、法律、财务），请咨询专业人士。
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            完整服务条款请访问:{' '}
            <a href="https://chinalanding.ai/terms" className="text-[#ff5a5f] hover:underline">
              chinalanding.ai/terms
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
