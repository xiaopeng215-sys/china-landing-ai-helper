'use client';

import React from 'react';

interface FooterProps {
  children?: React.ReactNode;
  className?: string;
}

export default function Footer({ children, className = '' }: FooterProps) {
  return (
    <footer className={`bg-white border-t border-gray-200 safe-area-bottom ${className}`}>
      <div className="px-4 py-3">
        {children}
      </div>
    </footer>
  );
}
