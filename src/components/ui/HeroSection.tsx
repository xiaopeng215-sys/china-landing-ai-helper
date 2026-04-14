"use client";

import React from "react";

export interface HeroFeature {
  label: string;
  onClick?: () => void;
}

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  backgroundImage?: string;
  gradient?: string;
  features?: HeroFeature[];
}

/**
 * HeroSection - 首页英雄区组件
 * 
 * 设计原则:
 * - 极简主义：少即是多，每个像素都有存在的理由
 * - 品牌一致性：使用 Antigravity 视觉规范配色
 * - 前端友好：使用 Tailwind CSS，便于实现和维护
 * - 可访问性：WCAG AA 对比度标准
 */
const DEFAULT_FEATURES: HeroFeature[] = [
  { label: "✨ AI Trip Planning" },
  { label: "🍜 Local Food" },
  { label: "🚇 Transport Guide" },
];

export default function HeroSection({
  title = "Land in China, start from here",
  subtitle = "AI-powered trip planning · Local food · Transport guide",
  ctaText = "Start Now",
  onCtaClick,
  backgroundImage,
  gradient = "from-teal-600 to-teal-500",
  features = DEFAULT_FEATURES,
}: HeroSectionProps) {
  return (
    <section
      className={`relative w-full h-[420px] sm:h-[500px] bg-gradient-to-br ${gradient} overflow-hidden`}
      aria-label="Hero section"
    >
      {/* 背景图案 - 几何网格 */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* 光晕效果 */}
      <div
        className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-amber-400/10 rounded-full blur-2xl"
        aria-hidden="true"
      />

      {/* 内容区域 */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        {/* Logo/图标 */}
        <div className="mb-6 animate-fade-in">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-4xl sm:text-5xl" role="img" aria-label="China travel">
              🇨🇳
            </span>
          </div>
        </div>

        {/* 标题 */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight max-w-3xl animate-slide-up">
          {title}
        </h1>

        {/* 副标题 */}
        <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-2xl animate-slide-up animation-delay-200">
          {subtitle}
        </p>

        {/* CTA 按钮 */}
        <button
          onClick={onCtaClick}
          className="group relative px-8 py-4 bg-white text-teal-700 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 animate-fade-in animation-delay-400"
          aria-label={ctaText}
        >
          <span className="flex items-center gap-2">
            {ctaText}
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>
        </button>

        {/* Feature tags */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 animate-fade-in animation-delay-600">
          {features.map((feature, i) => (
            feature.onClick ? (
              <button
                key={i}
                onClick={feature.onClick}
                className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium hover:bg-white/25 transition-colors cursor-pointer"
              >
                {feature.label}
              </button>
            ) : (
              <span
                key={i}
                className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium"
              >
                {feature.label}
              </span>
            )
          ))}
        </div>
      </div>

      {/* 底部渐变遮罩 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}

// 动画样式 (可添加到 globals.css)
const heroAnimations = `
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out forwards;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

.animation-delay-600 {
  animation-delay: 0.6s;
}
`;
