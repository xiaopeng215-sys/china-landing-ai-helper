/**
 * Design Tokens — Single Source of Truth
 * tailwind.config.ts 中的值应与此文件保持同步
 */
export const tokens = {
  color: {
    brand: {
      primary:      '#0D9488', // teal-600
      primaryDark:  '#0F766E', // teal-700
      primaryLight: '#CCFBF1', // teal-100
      accent:       '#FBBF24', // amber-400 (CTA)
      accentDark:   '#F59E0B', // amber-500
    },
    text: {
      primary:   '#484848',
      secondary: '#767676',
      muted:     '#9CA3AF',
    },
    bg: {
      primary:   '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary:  '#F3F4F6',
    },
    status: {
      error:   '#EF4444',
      success: '#10B981',
      warning: '#F59E0B',
      info:    '#3B82F6',
    },
    outline: '#E5E7EB',
  },
  radius: {
    badge:   '0.375rem', // 6px
    button:  '0.75rem',  // 12px
    cardSm:  '1rem',     // 16px
    card:    '1.5rem',   // 24px
    full:    '9999px',
  },
  shadow: {
    card:      '0 4px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
    cardHover: '0 12px 24px rgba(0,0,0,0.12)',
    brand:     '0 4px 12px rgba(13,148,136,0.3)',
    cta:       '0 4px 12px rgba(251,191,36,0.4)',
  },
  typography: {
    display:   { size: '2.25rem',  lineHeight: '1.2',  weight: '700' },
    heading1:  { size: '1.75rem',  lineHeight: '1.25', weight: '700' },
    heading2:  { size: '1.375rem', lineHeight: '1.3',  weight: '600' },
    heading3:  { size: '1.125rem', lineHeight: '1.4',  weight: '600' },
    bodyLg:    { size: '1rem',     lineHeight: '1.6',  weight: '400' },
    bodySm:    { size: '0.875rem', lineHeight: '1.5',  weight: '400' },
    caption:   { size: '0.75rem',  lineHeight: '1.4',  weight: '400' },
    label:     { size: '0.75rem',  lineHeight: '1.2',  weight: '500' },
  },
} as const;

export type Tokens = typeof tokens;
