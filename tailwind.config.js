/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    // Flat design: every shadow size renders a fully transparent shadow.
    // `ring-*` utilities (focus rings) are unaffected.
    boxShadow: {
      sm: '0 0 #0000',
      DEFAULT: '0 0 #0000',
      md: '0 0 #0000',
      lg: '0 0 #0000',
      xl: '0 0 #0000',
      '2xl': '0 0 #0000',
      inner: '0 0 #0000',
      none: 'none',
    },
    extend: {
      colors: {
        primary: {
          50: '#f5f0ff',
          100: '#ede5ff',
          200: '#ddd0ff',
          300: '#c4a8ff',
          400: '#a060ff',
          500: '#a060ff',
          600: '#8a3ffc',
          700: '#7c2df0',
          800: '#6925c9',
          900: '#571fa3',
          950: '#380d6e',
        },
        secondary: {
          50: '#effefd',
          100: '#c8fffb',
          200: '#91fef8',
          300: '#53f6f1',
          400: '#00e4e3',
          500: '#00e4e3',
          600: '#00b8ba',
          700: '#009295',
          800: '#067276',
          900: '#0a5d62',
          950: '#003a3f',
        },
        brand: {
          50: '#f5f0ff',
          100: '#ede5ff',
          500: '#a060ff',
          600: '#8a3ffc',
          700: '#7c2df0',
        },
        surface: {
          DEFAULT: '#f8f9fc',
          50: '#f8f9fc',
          100: '#f1f3f9',
          200: '#e5e8f0',
          300: '#d1d5e0',
        },
        sidebar: {
          bg: '#1a1b26',
          hover: '#24253a',
          active: '#a060ff',
          text: '#9ca3af',
          textActive: '#ffffff',
        landing: {
          blue: '#1154FF',
          dark: '#202020',
          bgLight: '#F7F8FA',
          bgSecondary: '#F1F3F5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        manrope: ['Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': 'none',
        'card': 'none',
        'card-hover': 'none',
        'modal': 'none',
        'mobile-bar': 'none',
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
