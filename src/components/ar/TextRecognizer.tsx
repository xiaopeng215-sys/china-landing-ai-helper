'use client';

import { useCallback, useRef, useState } from 'react';
import { translateChineseText } from '@/lib/ar/translator';
import type { AROverlayItem } from './ARCamera';

// 检测是否包含中文字符
function hasChinese(text: string): boolean {
  return /[\u4e00-\u9fff\u3400-\u4dbf]/.test(text);
}

interface UseTextRecognizerReturn {
  overlays: AROverlayItem[];
  isProcessing: boolean;
  history: { original: string; translation: string }[];
  processFrame: (canvas: HTMLCanvasElement) => void;
}

export function useTextRecognizer(): UseTextRecognizerReturn {
  const [overlays, setOverlays] = useState<AROverlayItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<{ original: string; translation: string }[]>([]);
  const busyRef = useRef(false);
  const workerRef = useRef<import('tesseract.js').Worker | null>(null);

  const getWorker = useCallback(async () => {
    if (workerRef.current) return workerRef.current;
    const { createWorker } = await import('tesseract.js');
    const worker = await createWorker('chi_sim', 1, {
      logger: () => {}, // 静默
    });
    workerRef.current = worker;
    return worker;
  }, []);

  const processFrame = useCallback(
    async (canvas: HTMLCanvasElement) => {
      if (busyRef.current) return;
      busyRef.current = true;
      setIsProcessing(true);

      try {
        const worker = await getWorker();
        const { data } = await worker.recognize(canvas);

        const newOverlays: AROverlayItem[] = [];
        const newHistory: { original: string; translation: string }[] = [];

        for (const word of data.words) {
          if (!hasChinese(word.text)) continue;

          const translation = await translateChineseText(word.text);
          if (!translation || translation === word.text) continue;

          // 将像素坐标转换为百分比（便于 canvas 缩放）
          const scaleX = 100 / canvas.width;
          const scaleY = 100 / canvas.height;

          newOverlays.push({
            text: word.text,
            translation,
            x: word.bbox.x0 * scaleX,
            y: word.bbox.y0 * scaleY,
            width: (word.bbox.x1 - word.bbox.x0) * scaleX,
            height: (word.bbox.y1 - word.bbox.y0) * scaleY,
          });

          newHistory.push({ original: word.text, translation });
        }

        if (newOverlays.length > 0) {
          setOverlays(newOverlays);
          setHistory((prev) => {
            const combined = [...newHistory, ...prev];
            // 去重 + 最多保留 10 条
            const seen = new Set<string>();
            return combined.filter((h) => {
              if (seen.has(h.original)) return false;
              seen.add(h.original);
              return true;
            }).slice(0, 10);
          });
        }
      } catch (err) {
        console.error('OCR error:', err);
      } finally {
        busyRef.current = false;
        setIsProcessing(false);
      }
    },
    [getWorker]
  );

  return { overlays, isProcessing, history, processFrame };
}
