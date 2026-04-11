import React from 'react';
import Image from 'next/image';
import { Skeleton } from './ui';

interface RestaurantCardProps {
  name: string;
  rating: number;
  reviewCount: number;
  pricePerPerson: string;
  cuisine: string;
  location: string;
  distance?: string;
  imageUrl?: string;
  onNavigate?: () => void;
  onMenu?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  isLoading?: boolean;
}

/**
 * Wanderlog/美团风格餐厅卡片
 * 用于美食推荐和地图标记
 */
export default function RestaurantCard({
  name,
  rating,
  reviewCount,
  pricePerPerson,
  cuisine,
  location,
  distance,
  imageUrl,
  onNavigate,
  onMenu,
  onFavorite,
  isFavorite = false,
  isLoading = false,
}: RestaurantCardProps) {
  // 加载状态显示骨架屏
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex">
          <div className="relative w-32 h-32 flex-shrink-0 bg-gray-100">
            <Skeleton width="128px" height="128px" />
          </div>
          <div className="flex-1 p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <Skeleton height="1.25rem" width="60%" />
                <Skeleton width="1.5rem" height="1.5rem" borderRadius="9999px" />
              </div>
              <Skeleton className="mb-1" height="1rem" width="40%" />
              <div className="flex gap-2 mt-1">
                <Skeleton height="0.875rem" width="3rem" />
                <Skeleton height="0.875rem" width="3rem" />
              </div>
              <Skeleton className="mt-2" height="0.75rem" width="50%" />
            </div>
            <div className="flex gap-2 mt-2">
              <Skeleton height="2rem" width="100%" />
              <Skeleton height="2rem" width="100%" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="flex">
        {/* 图片区域 */}
        <div className="relative w-32 h-32 flex-shrink-0 bg-gradient-to-br from-orange-100 to-yellow-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="128px"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-3xl">🍜</span>
            </div>
          )}
        </div>

        {/* 内容区域 */}
        <div className="flex-1 p-3 flex flex-col justify-between">
          <div>
            {/* 餐厅名称 */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-gray-900 text-base line-clamp-1">
                {name}
              </h3>
              <button
                onClick={onFavorite}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                {isFavorite ? '❤️' : '🤍'}
              </button>
            </div>

            {/* 评分 */}
            <div className="flex items-center gap-2 mt-1">
              <span className="flex items-center text-sm">
                <span className="text-yellow-500 mr-1">⭐</span>
                <span className="font-semibold text-gray-900">{rating}</span>
                <span className="text-gray-500 ml-1">({reviewCount}+)</span>
              </span>
            </div>

            {/* 价格和菜系 */}
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
              <span>💰 {pricePerPerson}</span>
              <span>•</span>
              <span>{cuisine}</span>
            </div>

            {/* 位置信息 */}
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <span>📍</span>
              <span className="truncate">{location}</span>
              {distance && (
                <>
                  <span>•</span>
                  <span>🚇 {distance}</span>
                </>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={onNavigate}
              className="flex-1 px-2 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-lg hover:bg-emerald-600 transition-colors"
            >
              导航
            </button>
            <button
              onClick={onMenu}
              className="flex-1 px-2 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              菜单
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
