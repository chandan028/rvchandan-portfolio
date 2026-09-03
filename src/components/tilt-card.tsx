'use client';

import { useCallback, useRef, type ReactNode } from 'react';

const MAX_TILT = 8; // degrees. Past ~9 the text starts to look distorted.

/**
 * Real perspective tilt plus a cursor-tracked sheen, driven by CSS custom
 * properties rather than React state — this runs on every pointermove and has
 * no business causing a re-render.
 *
 * Writes are batched into one rAF so a fast pointer cannot queue more style
 * work than the compositor can drain, and the element's box is measured once
 * on enter instead of on every move.
 *
 * Skipped for coarse pointers and for prefers-reduced-motion, which is also
 * enforced in CSS so it holds even if this handler somehow runs.
 */
export function TiltCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const frame = useRef(0);
  const next = useRef({ tx: 0, ty: 0, mx: 50, my: 50 });

  const enabled = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const flush = useCallback(() => {
    frame.current = 0;
    const node = ref.current;
    if (!node) return;
    const { tx, ty, mx, my } = next.current;
    node.style.setProperty('--tilt-x', `${tx.toFixed(2)}deg`);
    node.style.setProperty('--tilt-y', `${ty.toFixed(2)}deg`);
    node.style.setProperty('--mx', `${mx.toFixed(1)}%`);
    node.style.setProperty('--my', `${my.toFixed(1)}%`);
  }, []);

  const onEnter = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!enabled()) return;
    // Measure once per hover. Reading layout on every move is the expensive part.
    rect.current = event.currentTarget.getBoundingClientRect();
  };

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!enabled()) return;
    const box = rect.current ?? event.currentTarget.getBoundingClientRect();
    rect.current = box;

    const px = (event.clientX - box.left) / box.width;
    const py = (event.clientY - box.top) / box.height;

    next.current = {
      ty: (px - 0.5) * MAX_TILT * 2,
      tx: -(py - 0.5) * MAX_TILT * 2,
      mx: px * 100,
      my: py * 100,
    };

    if (!frame.current) frame.current = requestAnimationFrame(flush);
  };

  const reset = () => {
    const node = ref.current;
    rect.current = null;
    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    }
    if (!node) return;
    node.style.setProperty('--tilt-x', '0deg');
    node.style.setProperty('--tilt-y', '0deg');
    // Sheen returns to centre so the next hover fades in from neutral.
    node.style.setProperty('--mx', '50%');
    node.style.setProperty('--my', '50%');
  };

  return (
    <div className={`tilt-scene ${className}`}>
      <div
        ref={ref}
        onPointerEnter={onEnter}
        onPointerMove={onMove}
        onPointerLeave={reset}
        className="tilt-card h-full"
      >
        {children}
      </div>
    </div>
  );
}
