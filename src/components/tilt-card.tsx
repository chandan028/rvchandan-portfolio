'use client';

import { useRef, type ReactNode } from 'react';

const MAX_TILT = 7; // degrees. Past ~8 the text starts to look distorted.

/**
 * Real perspective tilt driven by the pointer, written to CSS custom
 * properties rather than to React state — this runs on every pointermove and
 * has no business causing a re-render.
 *
 * Skipped entirely for coarse pointers and for prefers-reduced-motion, which
 * is also enforced in CSS so it holds even if this handler runs.
 */
export function TiltCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const enabled = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node || !enabled()) return;

    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    node.style.setProperty('--tilt-y', `${(px * MAX_TILT * 2).toFixed(2)}deg`);
    node.style.setProperty('--tilt-x', `${(-py * MAX_TILT * 2).toFixed(2)}deg`);
  };

  const reset = () => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty('--tilt-y', '0deg');
    node.style.setProperty('--tilt-x', '0deg');
  };

  return (
    <div className={`tilt-scene ${className}`}>
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        className="tilt-card h-full"
      >
        {children}
      </div>
    </div>
  );
}
