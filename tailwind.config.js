/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: {
          450: '#4f8dfd',
        },
        indigo: {
          450: '#6f6cfb',
        },
        emerald: {
          450: '#4ade80',
        },
        amber: {
          450: '#fbbf24',
        },
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      boxShadow: {
        soft: '0 10px 25px rgba(0,0,0,0.08)',
        glow: '0 0 20px rgba(99, 102, 241, 0.3)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },


  plugins: [],
};
