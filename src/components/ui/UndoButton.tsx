'use client';

import React, { useCallback, useEffect, useState } from 'react';

export interface UndoAction {
  id: string;
  type: string;
  description: string;
  timestamp: number;
  data?: any;
}

interface UndoButtonProps {
  onUndo?: (action: UndoAction) => void;
  maxHistory?: number;
  className?: string;
  disabled?: boolean;
}

interface UndoHistory {
  actions: UndoAction[];
  currentIndex: number;
}

// 全局撤销历史管理
class UndoHistoryManager {
  private static instance: UndoHistoryManager;
  private history: UndoAction[] = [];
  private maxHistory: number = 10;
  private subscribers: Set<() => void> = new Set();

  private constructor() {}

  static getInstance(): UndoHistoryManager {
    if (!UndoHistoryManager.instance) {
      UndoHistoryManager.instance = new UndoHistoryManager();
    }
    return UndoHistoryManager.instance;
  }

  setMaxHistory(max: number) {
    this.maxHistory = max;
  }

  addAction(action: UndoAction): void {
    // 移除当前索引之后的所有动作（如果有重做功能）
    this.history = this.history.slice(0, this.history.length);
    this.history.push(action);

    // 限制历史记录数量
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    this.notifySubscribers();
  }

  undo(): UndoAction | null {
    if (this.history.length === 0) {
      return null;
    }
    const action = this.history.pop()!;
    this.notifySubscribers();
    return action;
  }

  canUndo(): boolean {
    return this.history.length > 0;
  }

  getHistory(): UndoAction[] {
    return [...this.history];
  }

  clear(): void {
    this.history = [];
    this.notifySubscribers();
  }

  subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback());
  }
}

export const useUndoHistory = (maxHistory: number = 10) => {
  const manager = UndoHistoryManager.getInstance();
  const [, forceUpdate] = useState({});

  useEffect(() => {
    manager.setMaxHistory(maxHistory);
    return manager.subscribe(() => forceUpdate({}));
  }, [maxHistory]);

  const addAction = useCallback((action: Omit<UndoAction, 'id' | 'timestamp'>) => {
    const newAction: UndoAction = {
      ...action,
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    manager.addAction(newAction);
    return newAction;
  }, []);

  const undo = useCallback(() => {
    return manager.undo();
  }, []);

  const canUndo = useCallback(() => {
    return manager.canUndo();
  }, []);

  const clear = useCallback(() => {
    manager.clear();
  }, []);

  return { addAction, undo, canUndo, clear };
};

export default function UndoButton({
  onUndo,
  maxHistory = 10,
  className = '',
  disabled = false,
}: UndoButtonProps) {
  const { undo, canUndo } = useUndoHistory(maxHistory);

  const handleUndo = useCallback(() => {
    const action = undo();
    if (action && onUndo) {
      onUndo(action);
    }
  }, [undo, onUndo]);

  // 键盘快捷键 Ctrl+Z / Cmd+Z
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (!disabled && canUndo()) {
          handleUndo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, disabled, canUndo]);

  const baseClasses = `
    inline-flex items-center gap-2 px-4 py-2
    bg-gray-100 hover:bg-gray-200 active:bg-gray-300
    text-gray-700 rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100
  `;

  return (
    <button
      onClick={handleUndo}
      disabled={disabled || !canUndo()}
      className={`${baseClasses} ${className}`}
      title="撤销上一步操作 (Ctrl+Z)"
      aria-label="撤销"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
        />
      </svg>
      <span className="text-sm font-medium">撤销</span>
    </button>
  );
}

// Hook 导出
export { UndoHistoryManager };
