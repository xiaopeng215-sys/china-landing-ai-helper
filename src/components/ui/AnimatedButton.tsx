'use client';

import React, { useState } from 'react';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: string;
}

export default function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  icon,
}: AnimatedButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white shadow-lg hover:shadow-xl';
      case 'secondary':
        return 'bg-gray-100 text-[#767676] hover:bg-gray-200';
      case 'danger':
        return 'bg-red-600 text-white shadow-lg hover:bg-red-700 hover:shadow-xl';
      case 'ghost':
        return 'bg-transparent text-[#ff5a5f] hover:bg-[#ff5a5f]/10';
      default:
        return 'bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm rounded-lg';
      case 'md':
        return 'px-6 py-3 text-base rounded-xl';
      case 'lg':
        return 'px-8 py-4 text-lg rounded-2xl';
      default:
        return 'px-6 py-3 text-base rounded-xl';
    }
  };

  const handleMouseDown = () => {
    if (!disabled && !loading) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
    setIsHovered(false);
  };

  return (
    <button
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      disabled={disabled || loading}
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
        font-semibold
        transition-all
        duration-200
        ease-out
        ${isPressed && !disabled && !loading ? 'scale-95' : isHovered && !disabled && !loading ? 'scale-105 -translate-y-0.5' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        flex
        items-center
        justify-center
        gap-2
      `}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {icon && !loading && <span className="text-lg">{icon}</span>}
      {children}
    </button>
  );
}
