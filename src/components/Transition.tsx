'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface TransitionProps {
  children: React.ReactNode;
  duration?: number;
}

export default function Transition({ children, duration = 300 }: TransitionProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    if (pathname) {
      setIsTransitioning(true);
      
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setIsTransitioning(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [pathname, children, duration]);

  return (
    <div
      className={`transition-all duration-300 ${
        isTransitioning
          ? 'opacity-0 transform scale-95'
          : 'opacity-100 transform scale-100'
      }`}
    >
      {displayChildren}
    </div>
  );
}
