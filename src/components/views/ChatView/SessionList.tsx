'use client';

import React from 'react';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';

interface SessionListProps {
  sessions: Array<{ id: string; title: string; updated_at: string }>;
  currentSessionId: string | null;
  onSelect: (sessionId: string) => void;
  onNewChat: () => void;
  onClose: () => void;
}

export function SessionList({ sessions, currentSessionId, onSelect, onNewChat, onClose }: SessionListProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex">
      <div className="bg-white w-80 max-w-[80%] h-full overflow-y-auto animate-in slide-in-from-left">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-bold text-lg">会话历史</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <span className="text-xl">×</span>
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-b">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] 
                       text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            新对话
          </button>
        </div>

        {/* Session List */}
        <div className="p-2">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-[#767676]">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>暂无会话</p>
            </div>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelect(session.id)}
                className={`w-full text-left p-3 rounded-xl mb-2 transition-all ${
                  currentSessionId === session.id
                    ? 'bg-[#ff5a5f]/10 text-[#ff5a5f] border border-[#ff5a5f]/20'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <p className="font-medium text-sm truncate">{session.title}</p>
                <p className="text-xs text-[#767676] mt-1">
                  {new Date(session.updated_at).toLocaleDateString('zh-CN')}
                </p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
