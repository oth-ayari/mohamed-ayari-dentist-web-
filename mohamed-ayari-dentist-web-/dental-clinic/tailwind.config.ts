import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Public site — clean, warm, medical
        navy: {
          50:  '#EEF3F8',
          100: '#D5E1EE',
          200: '#AABDDC',
          300: '#7898C6',
          400: '#4F74AE',
          500: '#2E5494',
          600: '#1B3A5C',
          700: '#132B45',
          800: '#0B1E30',
          900: '#06121E',
          950: '#04111F', // kept for admin dark mode
        },
        warm: {
          50:  '#FDFCFB',
          100: '#F8F6F2',
          200: '#F1EDE7',
          300: '#E8E3DB',
          400: '#D9D3C8',
          500: '#C2BAB0',
          600: '#A39C93',
          700: '#7D7870',
          800: '#5A5550',
          900: '#3A362F',
        },
        // Legacy admin colors — kept for admin dashboard backward compat
        cyan: {
          DEFAULT: '#06B6D4',
          50:  '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
        },
        gold: {
          DEFAULT: '#C9A84C',
          50:  '#FDF8EC',
          100: '#FAF0D0',
          200: '#F4E0A1',
          300: '#EDCC6C',
          400: '#E6B93D',
          500: '#C9A84C',
          600: '#A88A3A',
          700: '#876C2A',
          800: '#664F1A',
          900: '#45330D',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans:    ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        // Public site — restrained, clean
        'card':       '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-md':    '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        'card-lg':    '0 10px 15px -3px rgb(0 0 0 / 0.06), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
        // Legacy admin
        'glass':      '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'navy':       '0 20px 60px -10px rgba(7, 25, 41, 0.4)',
        'cyan':       '0 20px 60px -10px rgba(6, 182, 212, 0.3)',
        'gold':       '0 20px 60px -10px rgba(201, 168, 76, 0.3)',
        'card-hover': '0 16px 48px rgba(7, 25, 41, 0.16), 0 4px 16px rgba(7, 25, 41, 0.08)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in':  'fadeIn 0.4s ease-out forwards',
        'fade-up':  'fadeUp 0.5s ease-out forwards',
        // Legacy admin
        'float':         'float 6s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out 2s infinite',
        'pulse-slow':    'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':     'spin 20s linear infinite',
        'glow':          'glow 2s ease-in-out infinite alternate',
        'blob':          'blob 12s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        // Legacy admin keyframes
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        blob: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%':      { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(6, 182, 212, 0.7), 0 0 80px rgba(6, 182, 212, 0.3)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
