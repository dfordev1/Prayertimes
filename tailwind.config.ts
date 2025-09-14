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
        // Apple-inspired color palette
        apple: {
          blue: '#007AFF',
          gray: {
            50: '#F2F2F7',
            100: '#E5E5EA',
            200: '#D1D1D6',
            300: '#C7C7CC',
            400: '#AEAEB2',
            500: '#8E8E93',
            600: '#636366',
            700: '#48484A',
            800: '#3A3A3C',
            900: '#1C1C1E',
          },
        },
      },
      fontFamily: {
        'sf': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backdropBlur: {
        'apple': '20px',
      },
      boxShadow: {
        'apple': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'apple-sm': '0 2px 10px rgba(0, 0, 0, 0.08)',
      },
      dropShadow: {
        'apple': '0 2px 8px rgba(0, 0, 0, 0.15)',
        'apple-text': '0 1px 3px rgba(0, 0, 0, 0.3)',
        'apple-marker': '0 2px 6px rgba(0, 0, 0, 0.2)',
        'apple-center': '0 3px 8px rgba(0, 122, 255, 0.3)',
        'apple-hand': '0 2px 6px rgba(0, 122, 255, 0.4)',
      },
    },
  },
  plugins: [],
};
export default config;