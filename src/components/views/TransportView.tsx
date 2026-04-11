'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { ErrorMessage } from '@/components/ui/ErrorBoundary';

interface TransportViewProps {
  from: string;
  to: string;
  setFrom: (from: string) => void;
  setTo: (to: string) => void;
  onSearch: () => void;
  loading: boolean;
  error: Error | null;
}

export default function TransportView({
  from,
  to,
  setFrom,
  setTo,
  onSearch,
  loading,
  error,
}: TransportViewProps) {
  return (
    <div className="p-4 pb-24">
      <Header title="交通指南" />
      <div className="space-y-3 mb-6 mt-4">
        <div className="px-4 py-3 bg-white rounded-xl border border-gray-200">
          <div className="text-xs text-gray-500 mb-1">从哪里？</div>
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="输入起点 或 使用当前位置"
            className="w-full text-sm focus:outline-none"
          />
        </div>
        <div className="px-4 py-3 bg-white rounded-xl border border-gray-200">
          <div className="text-xs text-gray-500 mb-1">到哪里？</div>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="输入终点"
            className="w-full text-sm focus:outline-none"
          />
        </div>
        <button
          onClick={onSearch}
          className="w-full py-3 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors"
        >
          查询路线
        </button>
      </div>
      {loading ? (
        <ListSkeleton count={2} />
      ) : error ? (
        <ErrorMessage message={error.message} />
      ) : (
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { icon: '🚇', label: '地铁' },
            { icon: '🚲', label: '单车' },
            { icon: '🚌', label: '公交' },
            { icon: '🚕', label: '打车' },
          ].map((tool) => (
            <button
              key={tool.label}
              className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow text-center"
            >
              <div className="text-2xl mb-2">{tool.icon}</div>
              <div className="text-xs text-gray-600">{tool.label}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
