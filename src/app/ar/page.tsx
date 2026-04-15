'use client';

import dynamic from 'next/dynamic';
import { useTextRecognizer } from '@/components/ar/TextRecognizer';

// ARCamera 用到 getUserMedia，必须 client-only
const ARCamera = dynamic(() => import('@/components/ar/ARCamera'), { ssr: false });

export default function ARPage() {
  const { overlays, isProcessing, history, processFrame } = useTextRecognizer();

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* 顶部提示栏 */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center pt-safe-top">
        <div className="mt-4 mx-4 bg-black/60 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full border border-teal-500/50">
          📷 Point camera at Chinese text
        </div>
      </div>

      {/* 摄像头 + AR 叠加 */}
      <div className="flex-1 relative">
        <ARCamera
          overlays={overlays}
          onFrame={processFrame}
          isProcessing={isProcessing}
        />
      </div>

      {/* 底部翻译历史 */}
      {history.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-safe-bottom">
          <div className="mx-4 mb-4 bg-black/70 backdrop-blur-sm rounded-2xl border border-teal-500/30 overflow-hidden">
            <div className="px-4 py-2 border-b border-white/10">
              <span className="text-teal-400 text-xs font-semibold uppercase tracking-wide">
                Recent Translations
              </span>
            </div>
            <div className="max-h-40 overflow-y-auto">
              {history.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 px-4 py-2 border-b border-white/5 last:border-0"
                >
                  <span className="text-gray-400 text-sm shrink-0">{item.original}</span>
                  <span className="text-white/30 text-sm shrink-0">→</span>
                  <span className="text-white text-sm font-medium">{item.translation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 返回按钮 */}
      <button
        onClick={() => window.history.back()}
        className="absolute top-4 left-4 z-20 mt-safe-top bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm border border-white/20"
        aria-label="Go back"
      >
        ←
      </button>
    </div>
  );
}
