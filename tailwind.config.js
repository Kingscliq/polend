/** @type {import('tailwindcss').Config} */

const withMT = require('@material-tailwind/react/utils/withMT');

module.exports = withMT({
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // primary: '#008DED',
        'tifi-dark': '#14141E',
        'dark-grey': 'rgba(29, 29, 63, 0.893)',
        'grade-1': '#047CFD',
        'grade-2': '#31B8F6',
        'tifi-grey': '#A3A2B8',
        'grey-100': '#9A99A0',
        'tifi-gray-500': '#667085',
        'neutral-black': '#0C0C17',
        'neutral-black-0': '#8D8D99',
        'neutral-black-10': '#858491',
        'neutral-black-200': '#363641',
        'neutral-black-400': '#282832',
        'neutral-black-500': '#21212B',
        'neutral-black-600': '#1B1B24',
        'neutral-black-700': '#14141E',
        'light-60': 'rgba(255, 255, 255, 0.6)',
        'tifi-light-grey': '#F1F1F3',
        'primary-400': '#33B8F0',
        fire: '#BB5800',
        glow: 'rgba(5, 167, 236, 0.2)',
      },
      boxShadow: {
        'nav-shadow':
          '0px 32px 32px -8px rgba(0, 0, 0, 0.08), 0px 0px 32px -8px rgba(0, 0, 0, 0.12), 0px 0px 1px rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: theme => ({
        chartBall: "url('/src/assets/images/chart-ball.svg')",
        stackBg: "url('/src/assets/images/stack-bg.svg')",
        // primary: 'linear-gradient(to right, #ec2F4B, #009FFF)',
        primary: 'linear-gradient(to right, #4A00E0, #8E2DE2)',
        // primary: 'linear-gradient(to right, #A5FECB, #20BDFF, #5433FF)',
      }),
      animation: {
        'bounce-slow': 'bounce 1.1s linear infinite',
        'bounce-slower': 'bounce 1.2s linear infinite',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
});
