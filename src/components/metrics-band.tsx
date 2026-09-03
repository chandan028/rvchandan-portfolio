'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { metrics, type Metric } from '@/data/metrics';

const DURATION = 1100;
/* Ease-out cubic. Fast off the mark, long settle — reads as counting, not sliding. */
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

function useCountUp(target: number, precision: number) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || typeof IntersectionObserver === 'undefined') {
      setValue(target);
      return;
    }

    let frame = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          setValue(target * ease(t));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, precision]);

  return { ref, value };
}

function MetricValue({ metric }: { metric: Metric }) {
  const { ref, value } = useCountUp(metric.value, metric.precision);

  return (
    <span
      ref={ref}
      className="numeric display block text-[clamp(2.25rem,7vw,3.25rem)] text-silk"
    >
      {/*
        Server-render the final value so the number is correct before hydration
        and in the static export's HTML — the animation only ever replaces a
        value that was already right.
      */}
      {(value ?? metric.value).toFixed(metric.precision)}
      <span className="text-spider">{metric.suffix}</span>
    </span>
  );
}

/**
 * The band that answers "why should I keep reading" above the fold-and-a-bit.
 * Four numbers, each one a door into the case study that earns it.
 */
export function MetricsBand() {
  return (
    <section
      aria-label="Impact at a glance"
      className="mx-auto max-w-shell px-5 sm:px-8"
    >
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => {
          const body = (
            <>
              <MetricValue metric={metric} />
              <span className="mt-3 block font-mono text-micro uppercase text-spider">
                {metric.label}
              </span>
              <span className="mt-2 block text-[0.9rem] leading-relaxed text-dust">
                {metric.note}
              </span>
              {metric.href ? (
                <span className="mt-auto flex items-center gap-1.5 pt-4 font-mono text-micro uppercase text-web">
                  Case study
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 ease-swift group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              ) : null}
            </>
          );

          const shell =
            'surface group flex h-full flex-col p-6 transition-[box-shadow,transform] duration-300 ease-settle';

          return (
            <li
              key={metric.label}
              data-reveal=""
              style={{ '--reveal-delay': `${i * 90}ms` } as React.CSSProperties}
            >
              {metric.href ? (
                <Link
                  href={metric.href}
                  className={`${shell} hover:-translate-y-1 hover:shadow-e3`}
                >
                  {body}
                </Link>
              ) : (
                <div className={shell}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
