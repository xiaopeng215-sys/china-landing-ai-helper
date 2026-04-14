import type { Config } from "tailwindcss";

const config: Config = {
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
        // Brand colors - Teal primary theme
        brand: {
          primary: '#0D9488',       // teal-600
          'primary-dark': '#0F766E', // teal-700
          'primary-light': '#CCFBF1', // teal-100
          accent: '#FBBF24',         // amber-400（CTA按钮，温暖行动色）
          'accent-dark': '#F59E0B',  // amber-500（hover状态）
        },
        primary: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6", // teal-500
          600: "#0d9488", // teal-600
          700: "#0f766e", // teal-700
          800: "#115e59",
          900: "#134e4a",
        },
        secondary: {
          400: "#fbbf24", // amber-400
          500: "#f59e0b", // amber-500
          600: "#d97706",
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
