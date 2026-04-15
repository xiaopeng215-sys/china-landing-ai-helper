'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';

export interface AROverlayItem {
  text: string;
  translation: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ARCameraProps {
  overlays: AROverlayItem[];
  onFrame: (canvas: HTMLCanvasElement) => void;
  isProcessing: boolean;
}

export default function ARCamera({ overlays, onFrame, isProcessing }: ARCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = useCallback(async (mode: 'environment' | 'user') => {
    // 停掉旧流
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraError(null);
    } catch (err) {
      setCameraError('Camera access denied. Please allow camera permission.');
      console.error('Camera error:', err);
    }
  }, []);

  // 启动摄像头
  useEffect(() => {
    startCamera(facingMode);
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [facingMode, startCamera]);

  // 绘制 canvas 叠加层
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const draw = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx || video.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      canvas.width = video.videoWidth || canvas.offsetWidth;
      canvas.height = video.videoHeight || canvas.offsetHeight;

      // 清空
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制 AR 叠加
      for (const item of overlays) {
        const scaleX = canvas.width / 100;
        const scaleY = canvas.height / 100;
        const x = item.x * scaleX;
        const y = item.y * scaleY;
        const w = Math.max(item.width * scaleX, 120);
        const h = Math.max(item.height * scaleY, 32);

        // 半透明背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.beginPath();
        ctx.roundRect(x - 4, y - 4, w + 8, h + 8, 6);
        ctx.fill();

        // Teal 边框
        ctx.strokeStyle = '#14B8A6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x - 4, y - 4, w + 8, h + 8, 6);
        ctx.stroke();

        // 白色翻译文字
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${Math.max(14, h * 0.55)}px Inter, sans-serif`;
        ctx.fillText(item.translation, x + 2, y + h * 0.7);
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [overlays]);

  const handleFlip = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // 暴露 video 给父组件做 OCR 截帧
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const captureCanvas = document.createElement('canvas');

    const interval = setInterval(() => {
      if (video.readyState < 2) return;
      captureCanvas.width = video.videoWidth;
      captureCanvas.height = video.videoHeight;
      const ctx = captureCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        onFrame(captureCanvas);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [onFrame]);

  if (cameraError) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-900 text-white p-6 text-center">
        <div>
          <div className="text-4xl mb-4">📷</div>
          <p className="text-sm">{cameraError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* 摄像头视频流 */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
        autoPlay
      />

      {/* AR 叠加 canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* 处理中指示器 */}
      {isProcessing && (
        <div className="absolute top-4 right-4 bg-teal-600/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          Scanning...
        </div>
      )}

      {/* 翻转摄像头按钮 */}
      <button
        onClick={handleFlip}
        className="absolute bottom-6 right-6 bg-black/50 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl backdrop-blur-sm border border-white/20"
        aria-label="Flip camera"
      >
        🔄
      </button>
    </div>
  );
}
