import React, { useState } from 'react';
import Image from 'next/image';
import { Skeleton } from './ui';

interface Activity {
  time: string;
  title: string;
  description?: string;
  cost?: string;
  icon?: string;
}

interface DayCardProps {
  dayNumber: number;
  title: string;
  subtitle: string;
  imageUrl?: string;
  activities: Activity[];
  totalCost: string;
  steps?: number;
  isExpanded?: boolean;
  onToggle?: () => void;
  isLoading?: boolean;
}

/**
 * Wanderlog 风格每日行程卡片
 * 展示单日的详细活动安排
 */
export default function DayCard({
  dayNumber,
  title,
  subtitle,
  imageUrl,
  activities,
  totalCost,
  steps,
  isExpanded = false,
  onToggle,
  isLoading = false,
}: DayCardProps) {
  const [expanded, setExpanded] = useState(isExpanded);

  const handleToggle = () => {
    setExpanded(!expanded);
    onToggle?.();
  };

  // 加载状态显示骨架屏
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
        <div className="relative h-48 w-full bg-gray-100">
          <Skeleton width="100%" height="192px" />
          <div className="absolute top-3 left-3">
            <Skeleton width="5rem" height="1.5rem" borderRadius="9999px" />
          </div>
        </div>
        <div className="p-4">
          <Skeleton className="mb-2" height="1.5rem" width="60%" />
          <Skeleton className="mb-4" height="1rem" width="40%" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <Skeleton width="0.5rem" height="0.5rem" borderRadius="9999px" />
                  <Skeleton className="my-1" width="0.125rem" height="3rem" />
                </div>
                <div className="flex-1 pb-4">
                  <Skeleton className="mb-1" height="0.875rem" width="3rem" />
                  <Skeleton className="mb-1" height="1rem" width="70%" />
                  <Skeleton height="0.75rem" width="50%" />
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="mt-4 pt-4 border-t" height="1.5rem" width="30%" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      {/* 头部图片区域 */}
      <div className="relative h-48 w-full bg-gradient-to-br from-orange-100 to-amber-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={dayNumber === 1} // 首日图片优先加载，优化 LCP
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8ABAA="
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-6xl">🗓️</span>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-sm font-bold text-gray-900">Day {dayNumber}</span>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-4">
        {/* 标题 */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>

        {/* 活动列表 */}
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={index}
              className={`flex gap-3 ${!expanded && index >= 2 ? 'hidden' : ''}`}
            >
              {/* 时间线 */}
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                {index < activities.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gray-200 my-1" />
                )}
              </div>

              {/* 活动内容 */}
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900">
                    {activity.time}
                  </span>
                  {activity.icon && <span>{activity.icon}</span>}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {activity.title}
                </div>
                {activity.description && (
                  <p className="text-xs text-gray-600 mt-1">
                    {activity.description}
                  </p>
                )}
                {activity.cost && (
                  <span className="inline-block mt-2 px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full">
                    💰 {activity.cost}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 展开/收起按钮 */}
        {activities.length > 2 && (
          <button
            onClick={handleToggle}
            className="w-full mt-2 py-2 text-sm text-orange-600 font-medium hover:bg-orange-50 rounded-lg transition-colors"
          >
            {expanded ? '收起详情' : `展开更多 (${activities.length - 2}项活动)`}
          </button>
        )}

        {/* 底部统计 */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm">
            <span className="font-semibold text-gray-900">今日总计：</span>
            <span className="text-orange-600 font-bold">💰{totalCost}</span>
            {steps && (
              <span className="ml-3 text-gray-600">🚶 {steps.toLocaleString()}步</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
