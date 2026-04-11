'use client';

import React from 'react';

interface TransportOption {
  id: string;
  icon: string;
  name: string;
  desc: string;
  price: string;
  tips: string[];
  color: string;
}

export default function TransportView() {
  const options: TransportOption[] = [
    {
      id: 'metro',
      icon: '🚇',
      name: 'Metro',
      desc: 'Fastest & cheapest option',
      price: '¥3-8',
      tips: [
        'Download Metro Man app',
        'Use Alipay for tickets',
        'Avoid rush hour (8-9am, 5-6pm)',
        'Most signs in English',
      ],
      color: 'from-[#1a73e8] to-[#174ea6]',
    },
    {
      id: 'bike',
      icon: '🚴',
      name: 'Bike Sharing',
      desc: 'Great for short distances',
      price: '¥1.5/30min',
      tips: [
        'Scan QR with Alipay/WeChat',
        'HelloBike & Meituan available',
        'Wear helmet (recommended)',
        'Use bike lanes',
      ],
      color: 'from-[#34a853] to-[#2d8e47]',
    },
    {
      id: 'taxi',
      icon: '🚕',
      name: 'Taxi / Ride-hailing',
      desc: 'Convenient & comfortable',
      price: '¥15-50',
      tips: [
        'Use DiDi app (English)',
        'Show hotel address in Chinese',
        'Metered taxis are safer',
        'Tip not required',
      ],
      color: 'from-[#fbbc04] to-[#ea8600]',
    },
    {
      id: 'walking',
      icon: '🚶',
      name: 'Walking',
      desc: 'Best for exploring areas',
      price: 'Free',
      tips: [
        'Use maps.me (offline maps)',
        'Watch for bikes on sidewalks',
        'Bring portable charger',
        'Wear comfortable shoes',
      ],
      color: 'from-[#a855f7] to-[#9333ea]',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-[#484848]">Transport Guide</h1>
          <p className="text-sm text-[#767676]">Get around like a local</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Quick Compare */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-[#484848] mb-4">Quick Compare</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-[#767676]">Mode</th>
                  <th className="text-center py-3 px-2 text-[#767676]">Price</th>
                  <th className="text-center py-3 px-2 text-[#767676]">Speed</th>
                  <th className="text-center py-3 px-2 text-[#767676]">Easy</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2">🚇 Metro</td>
                  <td className="text-center py-3 px-2 text-[#34a853]">¥</td>
                  <td className="text-center py-3 px-2">⚡⚡⚡</td>
                  <td className="text-center py-3 px-2">✅</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2">🚴 Bike</td>
                  <td className="text-center py-3 px-2 text-[#34a853]">¥</td>
                  <td className="text-center py-3 px-2">⚡⚡</td>
                  <td className="text-center py-3 px-2">✅</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2">🚕 Taxi</td>
                  <td className="text-center py-3 px-2 text-[#fbbc04]">¥¥¥</td>
                  <td className="text-center py-3 px-2">⚡⚡⚡</td>
                  <td className="text-center py-3 px-2">✅✅</td>
                </tr>
                <tr>
                  <td className="py-3 px-2">🚶 Walking</td>
                  <td className="text-center py-3 px-2 text-[#34a853]">Free</td>
                  <td className="text-center py-3 px-2">⚡</td>
                  <td className="text-center py-3 px-2">✅✅✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Transport Options */}
        <div className="space-y-4">
          {options.map((option) => (
            <div
              key={option.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className={`bg-gradient-to-r ${option.color} p-4 text-white`}>
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{option.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold">{option.name}</h4>
                    <p className="text-white/90 text-sm">{option.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/80">Typical Price</p>
                    <p className="text-lg font-bold">{option.price}</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h5 className="font-semibold text-[#484848] mb-3 text-sm">💡 Pro Tips:</h5>
                <ul className="space-y-2">
                  {option.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#767676]">
                      <span className="text-[#34a853] mt-0.5">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Info */}
        <div className="bg-gradient-to-br from-[#1a73e8] to-[#174ea6] rounded-3xl shadow-xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💳</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2">Payment for Transport</h3>
              <p className="text-white/90 text-sm mb-4">
                Most transport accepts Alipay & WeChat Pay. Link your international card before arriving!
              </p>
              <button className="px-4 py-2 bg-white text-[#1a73e8] rounded-xl font-semibold text-sm hover:bg-white/90 transition-all">
                Setup Guide →
              </button>
            </div>
          </div>
        </div>

        {/* Apps to Download */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-[#484848] mb-4">📱 Essential Apps</h3>
          <div className="space-y-3">
            {[
              { name: 'Metro Man', desc: 'Metro maps & routes', icon: '🚇' },
              { name: 'DiDi', desc: 'Ride-hailing (English)', icon: '🚕' },
              { name: 'Alipay', desc: 'Payment & transport', icon: '💳' },
              { name: 'Maps.me', desc: 'Offline maps', icon: '🗺️' },
            ].map((app) => (
              <div key={app.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="text-2xl">{app.icon}</div>
                <div className="flex-1">
                  <p className="font-semibold text-[#484848]">{app.name}</p>
                  <p className="text-xs text-[#767676]">{app.desc}</p>
                </div>
                <button className="px-3 py-1.5 bg-[#1a73e8] text-white text-xs rounded-lg hover:bg-[#174ea6] transition-all">
                  Get
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
