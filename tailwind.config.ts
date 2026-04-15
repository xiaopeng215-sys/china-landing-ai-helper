import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Semantic surface tokens (CSS variable backed)
        surface: "var(--bg-primary)",
        "surface-alt": "var(--bg-secondary)",
        "text-primary": "var(--text-primary)",
        "text-muted": "var(--text-secondary)",
        border: "var(--border-color)",
        // Brand colors - Teal primary theme
        brand: {
          primary: '#0D9488',        // teal-600
          'primary-dark': '#0F766E', // teal-700
          'primary-light': '#CCFBF1',// teal-100
          accent: '#FBBF24',         // amber-400（CTA按钮）
          'accent-dark': '#F59E0B',  // amber-500（hover）
        },
        primary: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        secondary: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
      },
      borderRadius: {
        'card':    '1.5rem',   // 行程卡片
        'card-sm': '1rem',     // 小卡片
        'button':  '0.75rem',  // 按钮
        'badge':   '0.375rem', // 徽章/标签
      },
      boxShadow: {
        'card':       '0 4px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 12px 24px rgba(0,0,0,0.12)',
        'brand':      '0 4px 12px rgba(13,148,136,0.3)',
        'cta':        '0 4px 12px rgba(251,191,36,0.4)',
      },
      fontSize: {
        'display':   ['2.25rem',  { lineHeight: '1.2',  fontWeight: '700' }],
        'heading-1': ['1.75rem',  { lineHeight: '1.25', fontWeight: '700' }],
        'heading-2': ['1.375rem', { lineHeight: '1.3',  fontWeight: '600' }],
        'heading-3': ['1.125rem', { lineHeight: '1.4',  fontWeight: '600' }],
        'body-lg':   ['1rem',     { lineHeight: '1.6' }],
        'body-sm':   ['0.875rem', { lineHeight: '1.5' }],
        'caption':   ['0.75rem',  { lineHeight: '1.4' }],
        'label':     ['0.75rem',  { lineHeight: '1.2', fontWeight: '500' }],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
