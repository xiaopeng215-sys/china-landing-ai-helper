'use client';

import React from 'react';
import { Skeleton } from '../ui';

interface TransportCardProps {
  type: 'subway' | 'bike' | 'bus' | 'taxi';
  duration: string;
  price: string;
  icon: string;
  recommended?: boolean;
  onClick?: () => void;
  isLoading?: boolean;
}

export default function TransportCard({
  type,
  duration,
  price,
  icon,
  recommended = false,
  onClick,
  isLoading = false,
}: TransportCardProps) {
  // 加载状态显示骨架屏
  if (isLoading) {
    return (
      <div className="p-4 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton width="2.5rem" height="2.5rem" borderRadius="0.5rem" />
            <div>
              <Skeleton className="mb-1" height="1rem" width="5rem" />
              <Skeleton height="0.875rem" width="4rem" />
            </div>
          </div>
          <div className="text-right">
            <Skeleton height="1.25rem" width="3rem" />
            {recommended && <Skeleton className="mt-1" height="0.75rem" width="2rem" />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border transition-all cursor-pointer ${
        recommended
          ? 'bg-emerald-50 border-emerald-200 shadow-sm'
          : 'bg-white border-gray-200 hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{icon}</div>
          <div>
            <div className="font-medium text-gray-900 capitalize">
              {type === 'subway' && '地铁'}
              {type === 'bike' && '单车'}
              {type === 'bus' && '公交'}
              {type === 'taxi' && '打车'}
            </div>
            <div className="text-sm text-gray-600">{duration}</div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="font-bold text-emerald-600">{price}</div>
          {recommended && (
            <div className="text-xs text-emerald-600 mt-1">推荐</div>
          )}
        </div>
      </div>
    </div>
  );
}
