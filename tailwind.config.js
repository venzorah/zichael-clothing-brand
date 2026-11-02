const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        ivory: token('ivory'),
        ink: token('ink'),
        body: token('body'),
        muted: token('muted'),
        line: token('line'),
        gold: {
          DEFAULT: '#D4AF37',
          ink: token('gold-ink'),
          soft: token('gold-soft'),
        },
        luxe: '#111111',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        luxe: '0.22em',
      },
      maxWidth: {
        site: '1440px',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
};
