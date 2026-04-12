'use client';

import React from 'react';

interface TripCardSkeletonProps {
  count?: number;
}

/**
 * 行程卡片骨架屏
 * 用于：首页行程列表、推荐线路
 */
export function TripCardSkeleton({ count = 3 }: TripCardSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
        >
          {/* 图片区域 */}
          <div className="relative h-40 bg-gradient-to-br from-gray-200 to-gray-300">
            <div className="absolute inset-0 shimmer-overlay" />
          </div>
          
          {/* 内容区域 */}
          <div className="p-4 space-y-3">
            {/* 标题 */}
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            
            {/* 副标题/天数 */}
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            
            {/* 价格标签 */}
            <div className="flex items-center gap-2 pt-2">
              <div className="h-6 bg-gray-200 rounded w-20" />
              <div className="h-6 bg-gray-100 rounded w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface ChatSkeletonProps {
  count?: number;
}

/**
 * 聊天消息骨架屏
 * 用于：AI 对话加载中、消息历史加载
 */
export function ChatSkeleton({ count = 5 }: ChatSkeletonProps) {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className={`flex gap-3 ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}
        >
          {/* 头像 */}
          <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 animate-pulse" />
          
          {/* 消息气泡 */}
          <div className={`max-w-[70%] space-y-2 ${i % 2 === 0 ? '' : 'items-end'}`}>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
            {i % 3 === 0 && (
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

interface ListSkeletonProps {
  count?: number;
}

/**
 * 列表项骨架屏
 * 用于：餐厅列表、景点列表、历史记录
 */
export function ListSkeleton({ count = 8 }: ListSkeletonProps) {
  return (
    <div className="divide-y divide-gray-100">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3 animate-pulse">
          {/* 缩略图 */}
          <div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0" />
          
          {/* 内容 */}
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
          
          {/* 箭头/按钮 */}
          <div className="w-6 h-6 bg-gray-100 rounded-full" />
        </div>
      ))}
    </div>
  );
}

interface ProfileSkeletonProps {}

/**
 * 个人资料骨架屏
 * 用于：用户 Profile 页面加载
 */
export function ProfileSkeleton({}: ProfileSkeletonProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
      {/* 头像区域 */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 bg-gray-200 rounded-full" />
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
      </div>
      
      {/* 统计信息 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center">
            <div className="h-8 bg-gray-200 rounded w-full mb-2" />
            <div className="h-3 bg-gray-100 rounded w-16 mx-auto" />
          </div>
        ))}
      </div>
      
      {/* 设置项列表 */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl" />
            <div className="h-4 bg-gray-200 rounded w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}

interface GallerySkeletonProps {
  columns?: number;
  rows?: number;
}

/**
 * 图片画廊骨架屏
 * 用于：景点图片、餐厅环境图
 */
export function GallerySkeleton({ columns = 2, rows = 3 }: GallerySkeletonProps) {
  const total = columns * rows;
  
  return (
    <div className={`grid grid-cols-${columns} gap-3`}>
      {Array.from({ length: total }).map((_, i) => (
        <div 
          key={i} 
          className="aspect-square bg-gray-200 rounded-xl animate-pulse relative overflow-hidden"
        >
          <div className="absolute inset-0 shimmer-overlay" />
        </div>
      ))}
    </div>
  );
}

interface TextSkeletonProps {
  lines?: number;
  width?: 'full' | 'wide' | 'medium' | 'short';
}

/**
 * 文本骨架屏
 * 用于：文章内容、描述文本
 */
export function TextSkeleton({ lines = 3, width = 'full' }: TextSkeletonProps) {
  const widthClasses = {
    full: 'w-full',
    wide: 'w-5/6',
    medium: 'w-3/4',
    short: 'w-1/2',
  };

  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className={`h-4 bg-gray-200 rounded ${
            i === lines - 1 ? widthClasses.short : widthClasses.full
          }`}
        />
      ))}
    </div>
  );
}

interface DashboardSkeletonProps {}

/**
 * 仪表盘骨架屏
 * 用于：数据统计页面
 */
export function DashboardSkeleton({}: DashboardSkeletonProps) {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="h-3 bg-gray-200 rounded w-16 mb-2" />
            <div className="h-8 bg-gray-200 rounded w-full mb-2" />
            <div className="h-3 bg-gray-100 rounded w-24" />
          </div>
        ))}
      </div>
      
      {/* 图表区域 */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="h-5 bg-gray-200 rounded w-32 mb-4" />
        <div className="h-48 bg-gray-100 rounded" />
      </div>
      
      {/* 列表区域 */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="h-5 bg-gray-200 rounded w-32 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
