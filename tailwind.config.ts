import type { Config } from 'tailwindcss';

/**
 * Six named values, plus one utility. Nothing else is allowed in components —
 * if a colour isn't in this map it doesn't belong on the page.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0E1A',
        weave: '#141B31',
        thread: '#26304F',
        dust: '#8A93A8',
        silk: '#F2F4F8',
        spider: '#F03A42',
        web: '#6E93F5',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Impact', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        prose: '65ch',
        shell: '1120px',
      },
      fontSize: {
        micro: ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.08em' }],
      },
    },
  },
  plugins: [],
};

export default config;
