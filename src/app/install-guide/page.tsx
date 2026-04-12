'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function InstallGuidePage() {
  const router = useRouter();

  const steps = [
    {
      icon: '📱',
      title: 'iOS Safari',
      steps: [
        '点击底部工具栏的分享按钮',
        '向下滚动并点击"添加到主屏幕"',
        '点击右上角的"添加"',
      ],
    },
    {
      icon: '🤖',
      title: 'Android Chrome',
      steps: [
        '点击右上角的三个点菜单',
        '点击"添加到主屏幕"',
        '点击"添加"确认',
      ],
    },
    {
      icon: '💻',
      title: '桌面浏览器',
      steps: [
        '查看地址栏右侧的安装图标',
        '点击"安装"按钮',
        '在弹出的对话框中确认',
      ],
    },
  ];

  const benefits = [
    { icon: '⚡', title: '快速启动', desc: '无需打开浏览器，直接从主屏幕启动' },
    { icon: '📶', title: '离线使用', desc: '部分功能支持离线访问' },
    { icon: '🔔', title: '消息通知', desc: '接收重要提醒和更新' },
    { icon: '💾', title: '节省空间', desc: '比原生应用更小，不占存储空间' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white py-8 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-10 w-20 h-20 bg-white rounded-full animate-float"></div>
          <div className="absolute bottom-8 left-20 w-24 h-24 bg-white rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2 text-white/80 hover:text-white transition-colors tap-feedback"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>返回</span>
          </button>
          <h1 className="text-3xl font-bold mb-2 animate-slide-up">📲 安装应用</h1>
          <p className="text-white/80 animate-slide-up" style={{ animationDelay: '0.1s' }}>将 China AI Helper 添加到您的设备</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        {/* Benefits */}
        <section className="animate-slide-up">
          <h2 className="text-xl font-bold text-[#484848] mb-4">✨ 为什么要安装？</h2>
          <div className="grid grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div 
                key={benefit.title} 
                className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 hover-lift stagger-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl mb-2 animate-float">{benefit.icon}</div>
                <h3 className="font-bold text-[#484848] mb-1">{benefit.title}</h3>
                <p className="text-sm text-[#767676]">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Installation Steps */}
        <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-bold text-[#484848] mb-4">📖 如何安装</h2>
          <div className="space-y-4">
            {steps.map((platform, index) => (
              <div 
                key={platform.title} 
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover-lift stagger-item"
                style={{ animationDelay: `${0.3 + index * 0.15}s` }}
              >
                <div className="bg-gradient-to-r from-[#ff5a5f]/10 to-[#ff3b3f]/10 p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl animate-wiggle">{platform.icon}</span>
                    <h3 className="font-bold text-[#484848]">{platform.title}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <ol className="space-y-3">
                    {platform.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${stepIndex * 0.1}s` }}>
                        <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-[#ff5a5f] to-[#ff3b3f] text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                          {stepIndex + 1}
                        </span>
                        <span className="text-[#767676] pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-xl font-bold text-[#484848] mb-4">❓ 常见问题</h2>
          <div className="space-y-3">
            {[
              { q: '安装需要付费吗？', a: '完全免费！这是一个渐进式 Web 应用 (PWA)，不需要任何费用。' },
              { q: '会占用很多存储空间吗？', a: '不会，PWA 非常轻量，通常只占用几 MB 空间。' },
              { q: '如何卸载？', a: '像卸载普通应用一样，长按图标选择移除即可。' },
              { q: '会自动更新吗？', a: '会的，PWA 会自动更新到最新版本，无需手动操作。' },
            ].map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 hover-lift stagger-item"
                style={{ animationDelay: `${0.7 + index * 0.1}s` }}
              >
                <p className="font-bold text-[#484848] mb-2">❓ {faq.q}</p>
                <p className="text-sm text-[#767676]">💡 {faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-[#ff5a5f] to-[#ff3b3f] rounded-3xl shadow-xl p-6 text-white text-center animate-bounce-in" style={{ animationDelay: '1s' }}>
          <div className="text-5xl mb-4 animate-float">🚀</div>
          <h2 className="text-2xl font-bold mb-2">准备好安装了吗？</h2>
          <p className="text-white/80 mb-6">只需几秒钟，即可获得更好的使用体验</p>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 bg-white text-[#ff5a5f] rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover-lift tap-feedback"
          >
            🏠 返回首页
          </button>
        </div>
      </main>
    </div>
  );
}
