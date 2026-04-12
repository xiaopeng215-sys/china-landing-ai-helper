'use client';

import React, { useEffect, useState } from 'react';

interface AnimatedPageProps {
  children: React.ReactNode;
  animation?: 'slide-up' | 'slide-down' | 'fade-in' | 'scale-in' | 'bounce-in';
  delay?: number;
  duration?: number;
  className?: string;
}

export default function AnimatedPage({
  children,
  animation = 'slide-up',
  delay = 0,
  duration = 300,
  className = '',
}: AnimatedPageProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getAnimationClass = () => {
    switch (animation) {
      case 'slide-up':
        return isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-5';
      case 'slide-down':
        return isVisible ? 'animate-slide-down' : 'opacity-0 -translate-y-5';
      case 'fade-in':
        return isVisible ? 'animate-fade-in' : 'opacity-0';
      case 'scale-in':
        return isVisible ? 'animate-scale-in' : 'opacity-0 scale-95';
      case 'bounce-in':
        return isVisible ? 'animate-bounce-in' : 'opacity-0 scale-50';
      default:
        return isVisible ? 'animate-fade-in' : 'opacity-0';
    }
  };

  return (
    <div
      className={`${getAnimationClass()} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </div>
  );
}
