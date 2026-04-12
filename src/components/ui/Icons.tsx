'use client';

import dynamic from 'next/dynamic';

/**
 * Icons - 按需加载 lucide-react 图标
 * 
 * 优化策略:
 * 1. 使用 Next.js dynamic import 实现代码分割
 * 2. 常用图标预加载，非常用图标懒加载
 * 3. 统一的 loading 状态
 * 
 * 用法:
 * ```tsx
 * import { Star, Calendar } from '@/components/ui/Icons';
 * ```
 */

// 预加载常用图标 (ssr: true)
export const Star = dynamic(
  () => import('lucide-react').then(mod => mod.Star),
  { ssr: true }
);

export const Calendar = dynamic(
  () => import('lucide-react').then(mod => mod.Calendar),
  { ssr: true }
);

export const MapPin = dynamic(
  () => import('lucide-react').then(mod => mod.MapPin),
  { ssr: true }
);

export const DollarSign = dynamic(
  () => import('lucide-react').then(mod => mod.DollarSign),
  { ssr: true }
);

export const Send = dynamic(
  () => import('lucide-react').then(mod => mod.Send),
  { ssr: true }
);

export const MessageSquare = dynamic(
  () => import('lucide-react').then(mod => mod.MessageSquare),
  { ssr: true }
);

// 懒加载图标 (ssr: false)
export const History = dynamic(
  () => import('lucide-react').then(mod => mod.History),
  { ssr: false, loading: () => <span className="w-5 h-5" /> }
);

export const Plus = dynamic(
  () => import('lucide-react').then(mod => mod.Plus),
  { ssr: false, loading: () => <span className="w-5 h-5" /> }
);

export const Trash2 = dynamic(
  () => import('lucide-react').then(mod => mod.Trash2),
  { ssr: false, loading: () => <span className="w-5 h-5" /> }
);

export const Mic = dynamic(
  () => import('lucide-react').then(mod => mod.Mic),
  { ssr: false, loading: () => <span className="w-5 h-5" /> }
);

// 导出所有图标供按需使用
export * from 'lucide-react';
