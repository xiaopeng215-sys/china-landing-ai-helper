'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Card } from '@/components/ui';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="text-center max-w-md w-full" padding="lg">
        <div className="text-6xl mb-4">🤔</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">页面不存在</h1>
        <p className="text-gray-600 mb-6">抱歉，你访问的页面不存在或已被移除</p>
        <Link href="/" className="inline-block">
          <Button size="lg">返回首页</Button>
        </Link>
      </Card>
    </div>
  );
}
