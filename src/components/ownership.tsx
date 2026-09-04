import { ownership } from '@/data/ownership';
import { Reveal } from './reveal';

/**
 * Scope, stated directly.
 *
 * A recruiter screening for SDE 2 is asking one question — how much can this
 * person be handed — and a stack list cannot answer it. Each row names a
 * system I was on the hook for, so the answer is on the page rather than
 * inferred from job titles.
 */
export function Ownership() {
  return (
    <ul className="grid gap-px overflow-hidden rounded-card bg-thread/60 shadow-e2 sm:grid-cols-2">
      {ownership.map((item, i) => (
        <Reveal
          as="li"
          key={item.area}
          delay={i * 80}
          /*
           * An odd count would leave the last row half empty, and in a
           * hairline grid that gap reads as a missing cell rather than as
           * whitespace. The final item spans instead.
           */
          className={
            i === ownership.length - 1 && ownership.length % 2 === 1
              ? 'sm:col-span-2'
              : undefined
          }
        >
          {/*
            A hairline grid: the gap-px on the parent shows through as the
            rule, so the rows read as one table rather than as loose cards.
          */}
          <div className="flex h-full flex-col bg-weave/70 p-6 transition-colors duration-300 hover:bg-weave">
            <p className="numeric font-mono text-micro text-dust">
              {String(i + 1).padStart(2, '0')}
            </p>
            <h3 className="mt-3 font-semibold text-silk">{item.area}</h3>
            <p className="mt-2 max-w-prose text-[0.95rem] leading-relaxed text-dust">
              {item.detail}
            </p>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}
