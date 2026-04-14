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
        // Brand colors - Klook/TripAdvisor style (orange-amber travel theme)
        primary: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316", // orange-500
          600: "#ea580c", // orange-600
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        secondary: {
          400: "#fbbf24", // amber-400
          500: "#f59e0b", // amber-500
          600: "#d97706",
        },
      },
    },
  },
  plugins: [],
};
export default config;
