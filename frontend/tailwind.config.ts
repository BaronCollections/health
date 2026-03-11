import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6DB578',
          50: '#F0F7F1',
          100: '#D9EDDC',
          200: '#B3DBB8',
          300: '#8DC995',
          400: '#6DB578',
          500: '#4F945A',
          600: '#3D7346',
          700: '#2B5232',
          800: '#1A311E',
          900: '#09100A',
        },
        accent: {
          DEFAULT: '#F39C12',
          light: '#F5B041',
          dark: '#D68910',
        },
        background: '#F8FAFB',
        surface: '#FFFFFF',
        danger: '#E74C3C',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
