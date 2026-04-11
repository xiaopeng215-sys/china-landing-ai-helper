import React from 'react';
import Image from 'next/image';
import { Skeleton } from './ui';

interface TripCardProps {
  title: string;
  duration: string;
  budget: string;
  people: number;
  tags: string[];
  imageUrl?: string;
  onView?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
  isLoading?: boolean;
}

/**
 * Wanderlog 风格行程卡片组件
 * 用于展示行程概览信息
 */
export default function TripCard({
  title,
  duration,
  budget,
  people,
  tags,
  imageUrl = '/images/default-trip.jpg',
  onView,
  onEdit,
  onShare,
  isLoading = false,
}: TripCardProps) {
  // 加载状态显示骨架屏
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="relative h-40 w-full bg-gray-100">
          <Skeleton width="100%" height="160px" />
        </div>
        <div className="p-4">
          <Skeleton className="mb-3" height="1.5rem" width="70%" />
          <div className="flex gap-3 mb-3">
            <Skeleton height="1rem" width="4rem" />
            <Skeleton height="1rem" width="4rem" />
            <Skeleton height="1rem" width="3rem" />
          </div>
          <div className="flex gap-2 mb-4">
            <Skeleton height="1.5rem" width="4rem" borderRadius="9999px" />
            <Skeleton height="1.5rem" width="4rem" borderRadius="9999px" />
            <Skeleton height="1.5rem" width="4rem" borderRadius="9999px" />
          </div>
          <div className="flex gap-2">
            <Skeleton height="2.5rem" width="100%" />
            <Skeleton height="2.5rem" width="4rem" />
            <Skeleton height="2.5rem" width="4rem" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* 图片区域 */}
      <div className="relative h-40 w-full bg-gradient-to-br from-emerald-100 to-blue-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-4xl">📍</span>
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className="p-4">
        {/* 标题 */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>

        {/* 元信息 */}
        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
          <span className="flex items-center gap-1">
            <span>📅</span>
            <span>{duration}</span>
          </span>
          <span className="flex items-center gap-1">
            <span>💰</span>
            <span>{budget}</span>
          </span>
          <span className="flex items-center gap-1">
            <span>👤</span>
            <span>{people}人</span>
          </span>
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <button
            onClick={onView}
            className="flex-1 px-3 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors"
          >
            查看
          </button>
          <button
            onClick={onEdit}
            className="px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            编辑
          </button>
          <button
            onClick={onShare}
            className="px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            分享
          </button>
        </div>
      </div>
    </div>
  );
}
