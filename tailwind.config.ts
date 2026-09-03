import type { Config } from 'tailwindcss';

/**
 * Six named hues, plus one link blue. Nothing else is allowed in components —
 * if a colour isn't in this map it doesn't belong on the page.
 *
 * Depth is deliberately NOT a colour problem. Elevation comes from the shadow
 * scale below (a white ring plus ambient darkness), so a raised surface reads
 * as raised on any ground without inventing a new grey for every layer.
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
      borderRadius: {
        /* Concentric pairs: card 20 → inner 12 at 8px padding. */
        card: '1.25rem',
        inner: '0.75rem',
      },
      boxShadow: {
        /*
         * Dark-mode elevation. A single white ring carries the edge; the
         * ambient layers sit underneath it and only get darker with height.
         * Layered black-on-black is invisible, so it is spent sparingly.
         */
        e1: '0 0 0 1px rgba(255,255,255,0.07)',
        e2: '0 0 0 1px rgba(255,255,255,0.10), 0 12px 28px -14px rgba(0,0,0,0.9)',
        e3: '0 0 0 1px rgba(255,255,255,0.14), 0 26px 60px -22px rgba(0,0,0,0.95), 0 4px 12px -6px rgba(0,0,0,0.7)',
        /* Hover on an interactive card: the ring picks up the accent. */
        accent:
          '0 0 0 1px rgba(240,58,66,0.55), 0 26px 60px -22px rgba(0,0,0,0.95), 0 0 44px -18px rgba(240,58,66,0.65)',
        glow: '0 0 40px -12px rgba(240,58,66,0.5)',
      },
      keyframes: {
        /* Entrance lives in globals.css — see the note there. */
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.45', transform: 'scale(0.82)' },
        },
      },
      animation: {
        marquee: 'marquee 42s linear infinite',
        pulseDot: 'pulseDot 2.4s ease-in-out infinite',
      },
      transitionTimingFunction: {
        /* Spring-ish. Used anywhere a value settles rather than just moves. */
        settle: 'cubic-bezier(0.22, 1, 0.36, 1)',
        swift: 'cubic-bezier(0.2, 0, 0, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
