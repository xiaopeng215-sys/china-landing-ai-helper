'use client';

import React from 'react';

interface Activity {
  time: string;
  icon: string;
  title: string;
  description: string;
  cost: string;
}

interface ItineraryCardProps {
  activities?: Activity[];
}

const DEFAULT_ACTIVITIES: Activity[] = [
  { time: '09:00', icon: '🌉', title: '外滩', description: '经典地标，拍照打卡', cost: '免费' },
  { time: '10:30', icon: '🏛️', title: '豫园', description: '古典园林，明代建筑', cost: '¥40' },
  { time: '12:00', icon: '🥟', title: '南翔馒头店', description: '百年老字号小笼包', cost: '人均 ¥60' },
  { time: '14:00', icon: '🚴', title: '滨江骑行', description: '8km 滨江大道，风景优美', cost: '¥15/小时' },
  { time: '18:00', icon: '🌃', title: '外滩夜景', description: '灯光秀，魔都精华', cost: '免费' },
];

export default function ItineraryCard({ activities = DEFAULT_ACTIVITIES }: ItineraryCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover-lift animate-slideUp" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-md">
            📍
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Day 1 · 经典上海</h3>
            <p className="text-sm text-gray-600">全天 · 骑行探索 · 美食之旅</p>
          </div>
        </div>
        <span className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-full shadow-md flex items-center gap-1">
          ⭐ 4.9
        </span>
      </div>
      
      {/* 时间线展示 */}
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div 
            key={index} 
            className="group flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-red-200 hover-lift"
            style={{ borderRadius: '16px' }}
          >
            {/* 时间线节点 */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-lg shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all`}>
                {activity.icon}
              </div>
              {index < activities.length - 1 && (
                <div className="w-0.5 flex-1 bg-gradient-to-b from-red-300 to-transparent my-2"></div>
              )}
            </div>
            
            {/* 活动内容 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                  {activity.time}
                </span>
                <span className="font-semibold text-gray-900 text-base">{activity.title}</span>
              </div>
              <div className="text-sm text-gray-600 mb-2">{activity.description}</div>
              <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                💰 {activity.cost}
              </span>
            </div>
            
            {/* 操作按钮 */}
            <button className="opacity-0 group-hover:opacity-100 transition-all p-3 hover:bg-white rounded-xl hover:shadow-md btn-ripple">
              <span className="text-red-500 text-lg">→</span>
            </button>
          </div>
        ))}
      </div>
      
      <button className="mt-6 w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] btn-ripple transition-all duration-300 flex items-center justify-center gap-2">
        📋 查看完整行程
        <span>→</span>
      </button>
    </div>
  );
}
