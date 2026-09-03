'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const WebLattice = dynamic(() => import('./web-lattice'), { ssr: false });

const RADIALS = 20;
const RINGS = 8;
const R = 250;
const CX = 300;
const CY = 300;

const at = (i: number, r: number) => {
  const a = (i / RADIALS) * Math.PI * 2;
  return [CX + Math.cos(a) * r, CY + Math.sin(a) * r] as const;
};

/**
 * Flat stand-in for the WebGL scene, built from the same geometry rules. It
 * renders on the server, occupies the exact same box, and is what a visitor
 * sees before three.js loads — or permanently, on a narrow screen or with
 * reduced motion asked for.
 */
function StaticWeb({ className = '' }: { className?: string }) {
  const radials: string[] = [];
  const rings: string[] = [];

  for (let i = 0; i < RADIALS; i++) {
    const [x, y] = at(i, R);
    radials.push(`M${CX} ${CY}L${x.toFixed(1)} ${y.toFixed(1)}`);
  }

  for (let k = 1; k <= RINGS; k++) {
    const r = (R * k) / RINGS;
    const d: string[] = [];
    for (let i = 0; i < RADIALS; i++) {
      const [x0, y0] = at(i, r);
      const [x1, y1] = at(i + 1, r);
      // Control point pulled towards the hub — this is the sag.
      const [cx, cy] = at(i + 0.5, r * 0.84);
      d.push(
        `M${x0.toFixed(1)} ${y0.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(
          1,
        )} ${x1.toFixed(1)} ${y1.toFixed(1)}`,
      );
    }
    rings.push(d.join(''));
  }

  return (
    <svg
      viewBox="0 0 600 600"
      aria-hidden="true"
      className={className}
      fill="none"
      strokeWidth="1"
    >
      <g stroke="#26304F" opacity="0.9">
        <path d={radials.join('')} />
        <path d={rings.join('')} />
      </g>
      {/* Accent radials, matching the 3D scene's accentEvery={7}. Deliberately
          not evenly spaced — every fifth of twenty lands on the compass points
          and reads as a crosshair rather than as webbing. */}
      <g stroke="#F03A42" opacity="0.75">
        <path
          d={[0, 7, 14]
            .map((i) => {
              const [x, y] = at(i, R);
              return `M${CX} ${CY}L${x.toFixed(1)} ${y.toFixed(1)}`;
            })
            .join('')}
        />
      </g>
    </svg>
  );
}

export function HeroCanvas() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const wide = window.matchMedia('(min-width: 768px)');
    const idleSupported = typeof window.requestIdleCallback === 'function';

    let handle: number | undefined;
    const clear = () => {
      if (handle === undefined) return;
      if (idleSupported) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      handle = undefined;
    };

    /**
     * three.js is ~600KB of parse and execute. It buys a moving web in the
     * corner of the hero, which is worth it on a desktop with the headroom for
     * it and worth nothing on a phone, where the gradient covers most of it
     * anyway. So on a narrow screen — or when reduced motion is asked for —
     * the static SVG stays and the 3D bundle is never fetched at all.
     */
    const evaluate = () => {
      clear();
      if (!wide.matches || reduced.matches) {
        setEnabled(false);
        return;
      }
      // Wait for idle so the hero headline, which is the LCP element, is never
      // queued behind the 3D bundle.
      handle = idleSupported
        ? window.requestIdleCallback(() => setEnabled(true), { timeout: 1500 })
        : window.setTimeout(() => setEnabled(true), 500);
    };

    evaluate();
    reduced.addEventListener('change', evaluate);
    wide.addEventListener('change', evaluate);

    return () => {
      clear();
      reduced.removeEventListener('change', evaluate);
      wide.removeEventListener('change', evaluate);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/*
        Warm bloom behind the web. It separates the lattice from the halftone
        ground so the threads read as lit rather than as a faint grid.
      */}
      <div className="absolute right-[-20%] top-[-24%] h-[46rem] w-[46rem] rounded-full bg-[radial-gradient(circle,rgba(240,58,66,0.13),rgba(110,147,245,0.06)_42%,transparent_70%)] blur-2xl sm:right-[-6%] sm:top-[-14%]" />

      <div className="absolute right-[-22%] top-[-26%] h-[44rem] w-[44rem] sm:right-[-6%] sm:top-[-14%] lg:h-[52rem] lg:w-[52rem]">
        {enabled ? (
          <WebLattice />
        ) : (
          <StaticWeb className="h-full w-full opacity-70" />
        )}
      </div>

      {/*
        Legibility scrim. Opaque behind the headline on a narrow screen, where
        the web sits directly under the text; on a wide one it thins out fast
        so the lattice is actually visible rather than smothered.
      */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/20 sm:via-ink/70 sm:to-transparent" />
      {/* Hands the section off to the page ground instead of ending on an edge. */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent" />
    </div>
  );
}
