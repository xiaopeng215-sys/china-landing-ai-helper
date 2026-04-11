'use client';

import React, { useState } from 'react';

type StyleVersion = 'china' | 'french' | 'materialLight' | 'materialDark';

export default function StyleSwitcher() {
  const [selectedStyle, setSelectedStyle] = useState<StyleVersion>('china');

  const styles = {
    china: {
      name: '中国红金版',
      subtitle: '热情奔放 · 中国传统',
      gradient: 'from-red-600 via-red-700 to-red-800',
      bg: 'bg-gradient-to-br from-red-50 via-white to-red-50',
    },
    french: {
      name: '法式轻奢版',
      subtitle: '优雅高级 · 法式轻奢',
      gradient: 'from-[#1a1a2e] via-[#16213e] to-[#0f3460]',
      bg: 'bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]',
    },
    materialLight: {
      name: 'Google 明亮版',
      subtitle: '现代简洁 · Material Design',
      gradient: 'from-blue-600 via-blue-700 to-blue-800',
      bg: 'bg-[#fdfcff]',
    },
    materialDark: {
      name: 'Google 深色版',
      subtitle: '深色护眼 · 科技感',
      gradient: 'from-gray-800 via-gray-900 to-black',
      bg: 'bg-[#1a1c1e]',
    },
  };

  return (
    <div className={`min-h-screen ${styles[selectedStyle].bg} transition-colors duration-500`}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">🎨 设计风格对比</h1>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value as StyleVersion)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="china">🇨🇳 中国红金版</option>
              <option value="french">🇫🇷 法式轻奢版</option>
              <option value="materialLight">🔵 Google 明亮版</option>
              <option value="materialDark">🌙 Google 深色版</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Style Info Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className={`h-32 rounded-2xl bg-gradient-to-r ${styles[selectedStyle].gradient} mb-6 flex items-center justify-center`}>
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
              {styles[selectedStyle].name}
            </h2>
          </div>
          <p className="text-lg text-gray-600 text-center mb-6">
            {styles[selectedStyle].subtitle}
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-sm text-gray-600 mb-2">当前风格</div>
              <div className="text-xl font-bold text-gray-900">{styles[selectedStyle].name}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-sm text-gray-600 mb-2">圆角规格</div>
              <div className="text-xl font-bold text-gray-900">
                {selectedStyle.includes('material') ? '28px' : '24px'}
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">📊 4 版本对比</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">特性</th>
                  <th className="text-center py-3 px-4 font-semibold text-red-600">中国红金</th>
                  <th className="text-center py-3 px-4 font-semibold text-[#1a1a2e]">法式轻奢</th>
                  <th className="text-center py-3 px-4 font-semibold text-blue-600">Google 明亮</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-600">Google 深色</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">主色调</td>
                  <td className="text-center py-3 px-4"><span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm">红色</span></td>
                  <td className="text-center py-3 px-4"><span className="px-2 py-1 bg-[#1a1a2e] text-white rounded-full text-sm">深蓝黑</span></td>
                  <td className="text-center py-3 px-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">蓝色</span></td>
                  <td className="text-center py-3 px-4"><span className="px-2 py-1 bg-gray-800 text-white rounded-full text-sm">深灰</span></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">风格</td>
                  <td className="text-center py-3 px-4 text-sm">热情奔放</td>
                  <td className="text-center py-3 px-4 text-sm">优雅高级</td>
                  <td className="text-center py-3 px-4 text-sm">现代简洁</td>
                  <td className="text-center py-3 px-4 text-sm">科技感强</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">圆角</td>
                  <td className="text-center py-3 px-4 text-sm">24px</td>
                  <td className="text-center py-3 px-4 text-sm">24px</td>
                  <td className="text-center py-3 px-4 text-sm">28px</td>
                  <td className="text-center py-3 px-4 text-sm">28px</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">字体</td>
                  <td className="text-center py-3 px-4 text-sm">Inter</td>
                  <td className="text-center py-3 px-4 text-sm">Playfair</td>
                  <td className="text-center py-3 px-4 text-sm">Roboto</td>
                  <td className="text-center py-3 px-4 text-sm">Roboto</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-700">动画</td>
                  <td className="text-center py-3 px-4 text-sm">6 种平滑</td>
                  <td className="text-center py-3 px-4 text-sm">优雅过渡</td>
                  <td className="text-center py-3 px-4 text-sm">水波纹</td>
                  <td className="text-center py-3 px-4 text-sm">水波纹</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setSelectedStyle('china')}
            className={`py-4 px-6 rounded-2xl font-semibold shadow-lg transition-all ${
              selectedStyle === 'china'
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white scale-105'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            🇨🇳 中国红金版
          </button>
          <button
            onClick={() => setSelectedStyle('french')}
            className={`py-4 px-6 rounded-2xl font-semibold shadow-lg transition-all ${
              selectedStyle === 'french'
                ? 'bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white scale-105'
                : 'bg-[#1a1a2e]/10 text-[#1a1a2e] hover:bg-[#1a1a2e]/20'
            }`}
          >
            🇫🇷 法式轻奢版
          </button>
          <button
            onClick={() => setSelectedStyle('materialLight')}
            className={`py-4 px-6 rounded-2xl font-semibold shadow-lg transition-all ${
              selectedStyle === 'materialLight'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white scale-105'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            🔵 Google 明亮版
          </button>
          <button
            onClick={() => setSelectedStyle('materialDark')}
            className={`py-4 px-6 rounded-2xl font-semibold shadow-lg transition-all ${
              selectedStyle === 'materialDark'
                ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white scale-105'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            🌙 Google 深色版
          </button>
        </div>

        {/* Links */}
        <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">🔗 独立访问链接</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <a href="https://china-landing-red-gold.vercel.app" className="text-blue-600 hover:underline">
                https://china-landing-red-gold.vercel.app
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#1a1a2e] rounded-full"></span>
              <a href="https://china-landing-french.vercel.app" className="text-blue-600 hover:underline">
                https://china-landing-french.vercel.app
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              <a href="https://china-landing-material-light.vercel.app" className="text-blue-600 hover:underline">
                https://china-landing-material-light.vercel.app
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-800 rounded-full"></span>
              <a href="https://china-landing-material-dark.vercel.app" className="text-blue-600 hover:underline">
                https://china-landing-material-dark.vercel.app
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
