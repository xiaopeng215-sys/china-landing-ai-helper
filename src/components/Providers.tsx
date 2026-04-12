'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import { initClientMonitoring, reportWebVitals } from '@/lib/monitoring';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

/**
 * 应用 Providers - 包装整个应用的全局提供者
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 初始化客户端监控
    initClientMonitoring();

    // 报告 Web Vitals
    if (typeof window !== 'undefined') {
      // 使用 PerformanceObserver 监控 Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          reportWebVitals({
            name: entry.name,
            value: entry.startTime,
            rating: getRating(entry.name, entry.startTime),
          });
        }
      });

      // 观察 LCP (Largest Contentful Paint)
      observer.observe({ type: 'largest-contentful-paint', buffered: true });

      // 观察 FID (First Input Delay)
      observer.observe({ type: 'first-input', buffered: true });

      // 观察 CLS (Cumulative Layout Shift)
      observer.observe({ type: 'layout-shift', buffered: true });

      // 观察 FCP (First Contentful Paint)
      observer.observe({ type: 'paint', buffered: true });
    }
  }, []);

  return (
    <SessionProvider>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </SessionProvider>
  );
}

/**
 * 根据指标类型和值获取评级
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds: Record<string, { good: number; poor: number }> = {
    'largest-contentful-paint': { good: 2500, poor: 4000 },
    'first-input': { good: 100, poor: 300 },
    'first-contentful-paint': { good: 1800, poor: 3000 },
    'cumulative-layout-shift': { good: 0.1, poor: 0.25 },
  };

  const threshold = thresholds[name];
  if (!threshold) return 'needs-improvement';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}
