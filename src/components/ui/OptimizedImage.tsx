'use client';

import React from 'react';
import NextImage, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'priority' | 'loading' | 'placeholder'> {
  /** 是否为首屏图片 (优先加载) */
  priority?: boolean;
  /** 占位符类型: 'blur' | 'empty' */
  placeholder?: 'blur' | 'empty';
  /** 模糊占位符数据 (base64) */
  blurDataURL?: string;
}

/**
 * 优化的图片组件
 * 
 * 特性:
 * - 自动 WebP/AVIF 格式转换
 * - 懒加载 (非首屏图片)
 * - 响应式尺寸
 * - 骨架屏占位符
 * 
 * @example
 * // 首屏图片
 * <OptimizedImage
 *   src="/hero.jpg"
 *   alt="Hero"
 *   width={800}
 *   height={600}
 *   priority={true}
 * />
 * 
 * @example
 * // 普通图片 (懒加载)
 * <OptimizedImage
 *   src="/trip.jpg"
 *   alt="Trip"
 *   width={400}
 *   height={300}
 *   placeholder="blur"
 *   blurDataURL="/blur-data.jpg"
 * />
 */
export default function OptimizedImage({
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  sizes = '(max-width: 768px) 100vw, 50vw',
  quality = 85,
  ...props
}: OptimizedImageProps) {
  return (
    <NextImage
      {...props}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      sizes={sizes}
      quality={quality}
      className={`object-cover ${props.className || ''}`}
    />
  );
}

/**
 * 响应式图片网格组件
 * 
 * @example
 * <ImageGrid>
 *   <OptimizedImage src="/1.jpg" alt="1" width={400} height={300} />
 *   <OptimizedImage src="/2.jpg" alt="2" width={400} height={300} />
 * </ImageGrid>
 */
export function ImageGrid({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`grid grid-cols-2 gap-4 md:grid-cols-3 ${className}`}>
      {children}
    </div>
  );
}

/**
 * 带骨架屏的图片卡片
 * 
 * @example
 * <ImageCard
 *   src="/trip.jpg"
 *   alt="Trip"
 *   title="北京三日游"
 *   description="经典行程推荐"
 * />
 */
export function ImageCard({
  src,
  alt,
  title,
  description,
  width = 400,
  height = 300,
}: {
  src: string;
  alt: string;
  title: string;
  description?: string;
  width?: number;
  height?: number;
}) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div className="relative overflow-hidden">
        <OptimizedImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
          placeholder="blur"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
}
